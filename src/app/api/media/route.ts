import { NextRequest, NextResponse } from "next/server";
import { getAllMedia, saveUploadedFile, isR2Configured } from "@/lib/media";
import { requireAdmin } from "@/lib/auth";
import { ensureAllTables } from "@/db/init";

export async function GET() {
  try {
    await ensureAllTables();
    await requireAdmin();
    const items = await getAllMedia();
    return NextResponse.json({
      items,
      storageType: isR2Configured ? "cloudflare-r2" : "local-disk",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureAllTables();
    const admin = await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const caption = (formData.get("caption") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploaded = await saveUploadedFile(file, admin.name, { altText, caption });

    return NextResponse.json({
      success: true,
      media: uploaded,
      storage: isR2Configured ? "cloudflare-r2" : "local-disk",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
