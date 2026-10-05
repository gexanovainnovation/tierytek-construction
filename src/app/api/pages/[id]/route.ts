import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;
  const body = await request.json();

  await db
    .update(pages)
    .set({
      title: body.title,
      content: body.content,
      slug: body.slug,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      published: body.published,
      updatedAt: new Date(),
    })
    .where(eq(pages.id, id));

  const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  return NextResponse.json(result[0]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;
  await db.delete(pages).where(eq(pages.id, id));
  return NextResponse.json({ success: true });
}
