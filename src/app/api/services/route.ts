import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { generateId, slugify } from "@/lib/utils";
import { ensureAllTables } from "@/db/init";

export async function GET() {
  try {
    await ensureAllTables();
    const rows = await db.select().from(services).orderBy(asc(services.orderIndex));
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

    await db.insert(services).values({
      id,
      title: body.title,
      slug,
      shortDescription: body.shortDescription,
      content: body.content,
      image: body.image || null,
      imageAlt: body.imageAlt || null,
      category: body.category || "Engineering",
      orderIndex: Number(body.orderIndex) || 0,
      published: body.published ?? true,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
    });

    const created = await db.select().from(services).where(eq(services.id, id)).limit(1);
    return NextResponse.json(created[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
