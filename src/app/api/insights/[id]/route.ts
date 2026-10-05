import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { insights } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db.select().from(insights).where(eq(insights.id, id)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 });
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
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      imageAlt: body.imageAlt,
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      authorName: body.authorName,
      featured: body.featured,
      published: body.published,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      orderIndex: Number(body.orderIndex) || 0,
      updatedAt: new Date(),
    };

    if (body.published && !body.publishedAt) {
      updateData.publishedAt = new Date();
    }

    if (body.slug) {
      updateData.slug = slugify(body.slug);
    }

    await db.update(insights).set(updateData).where(eq(insights.id, id));
    const updated = await db.select().from(insights).where(eq(insights.id, id)).limit(1);
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
    await db.delete(insights).where(eq(insights.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
