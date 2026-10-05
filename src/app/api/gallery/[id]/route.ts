import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gallery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    await db
      .update(gallery)
      .set({
        title: body.title,
        client: body.client,
        project: body.project,
        location: body.location,
        category: body.category,
        description: body.description,
        caption: body.caption,
        altText: body.altText,
        year: body.year,
        images: Array.isArray(body.images) ? body.images : [],
        featured: body.featured,
        orderIndex: Number(body.orderIndex) || 0,
        published: body.published,
        updatedAt: new Date(),
      })
      .where(eq(gallery.id, id));

    const updated = await db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.delete(gallery).where(eq(gallery.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
