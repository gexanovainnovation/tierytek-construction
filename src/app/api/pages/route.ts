import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import { asc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export async function GET() {
  const result = await db.select().from(pages).orderBy(asc(pages.createdAt));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  await requireAdmin();

  const body = await request.json();
  const id = generateId();

  await db.insert(pages).values({
    id,
    slug: body.slug,
    title: body.title,
    content: body.content,
    seoTitle: body.seoTitle,
    seoDescription: body.seoDescription,
    published: body.published !== false,
  });

  const result = await db.select().from(pages).where(require("drizzle-orm").eq(pages.id, id)).limit(1);
  return NextResponse.json(result[0]);
}
