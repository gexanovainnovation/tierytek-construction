import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
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

    const updateData: any = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      image: body.image,
      imageAlt: body.imageAlt,
      category: body.category,
      orderIndex: Number(body.orderIndex) || 0,
      published: body.published,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      updatedAt: new Date(),
    };

    if (body.slug) {
      updateData.slug = slugify(body.slug);
    }

    await db.update(services).set(updateData).where(eq(services.id, id));
    const updated = await db.select().from(services).where(eq(services.id, id)).limit(1);
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
    await db.delete(services).where(eq(services.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
