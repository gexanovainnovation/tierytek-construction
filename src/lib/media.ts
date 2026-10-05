import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "./utils";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://media.tierytek.com or https://pub-xxxx.r2.dev

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID &&
  R2_ACCESS_KEY_ID &&
  R2_SECRET_ACCESS_KEY &&
  R2_BUCKET_NAME &&
  R2_PUBLIC_URL
);

let s3Client: S3Client | null = null;
if (isR2Configured) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function ensureUploadDir(): Promise<void> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export function validateFile(mimeType: string, size: number): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: "Invalid file type. Only JPG, PNG, WebP, GIF, SVG, and PDF are allowed." };
  }
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: "File too large. Maximum size is 15MB." };
  }
  return { valid: true };
}

export async function saveUploadedFile(
  file: File,
  uploadedBy: string,
  options?: { altText?: string; caption?: string }
): Promise<{ url: string; filename: string; id: string }> {
  const validation = validateFile(file.type, file.size);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const id = generateId();
  const filename = `${id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let url: string;

  if (isR2Configured && s3Client && R2_BUCKET_NAME && R2_PUBLIC_URL) {
    // Upload to Cloudflare R2
    const key = `uploads/${filename}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );
    const cleanBaseUrl = R2_PUBLIC_URL.replace(/\/+$/, "");
    url = `${cleanBaseUrl}/${key}`;
  } else {
    // Fallback to local storage
    await ensureUploadDir();
    const filepath = path.join(UPLOAD_DIR, filename);
    await writeFile(filepath, buffer);
    url = `/uploads/${filename}`;
  }

  await db.insert(media).values({
    id,
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url,
    altText: options?.altText || file.name.replace(/\.[^/.]+$/, ""),
    caption: options?.caption || "",
    uploadedBy,
  });

  return { url, filename, id };
}

export async function getMediaItem(id: string) {
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0] || null;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const item = await getMediaItem(id);
  if (!item) return false;

  if (isR2Configured && s3Client && R2_BUCKET_NAME) {
    try {
      const key = `uploads/${item.filename}`;
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        })
      );
    } catch (e) {
      console.warn("Error deleting from R2:", e);
    }
  } else {
    const filepath = path.join(UPLOAD_DIR, item.filename);
    try {
      await unlink(filepath);
    } catch {
      // Local file may not exist, continue
    }
  }

  await db.delete(media).where(eq(media.id, id));
  return true;
}

export async function getAllMedia() {
  return db.select().from(media).orderBy(media.createdAt);
}
