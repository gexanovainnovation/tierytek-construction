import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gallery } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import { ensureAllTables } from "@/db/init";

export async function GET() {
  try {
    await ensureAllTables();
    const rows = await db.select().from(gallery).orderBy(asc(gallery.orderIndex));
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

    await db.insert(gallery).values({
      id,
      title: body.title,
      client: body.client || null,
      project: body.project || null,
      location: body.location || null,
      category: body.category || "General",
      description: body.description || null,
      caption: body.caption || null,
      altText: body.altText || null,
      year: body.year || null,
      images: Array.isArray(body.images) ? body.images : [],
      featured: body.featured ?? false,
      orderIndex: Number(body.orderIndex) || 0,
      published: body.published ?? true,
    });

    const created = await db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
    return NextResponse.json(created[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
