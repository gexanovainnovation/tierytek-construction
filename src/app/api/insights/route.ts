import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { insights } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { generateId, slugify } from "@/lib/utils";
import { ensureAllTables } from "@/db/init";

export async function GET() {
  try {
    await ensureAllTables();
    const rows = await db.select().from(insights).orderBy(desc(insights.publishedAt));
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const id = generateId();
    const slug = slugify(body.slug || body.title);

    await db.insert(insights).values({
      id,
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image || null,
      imageAlt: body.imageAlt || null,
      category: body.category || "General",
      tags: Array.isArray(body.tags) ? body.tags : [],
      authorName: body.authorName || "Tierytek Engineering Team",
      publishedAt: body.published ? new Date() : null,
      published: body.published ?? false,
      featured: body.featured ?? false,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      orderIndex: Number(body.orderIndex) || 0,
    });

    const created = await db.select().from(insights).where(eq(insights.id, id)).limit(1);
    return NextResponse.json(created[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
