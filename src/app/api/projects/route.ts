import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { generateId, slugify } from "@/lib/utils";
import { ensureAllTables } from "@/db/init";

export async function GET() {
  try {
    await ensureAllTables();
    const rows = await db.select().from(projects).orderBy(asc(projects.orderIndex));
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

    await db.insert(projects).values({
      id,
      title: body.title,
      slug,
      client: body.client || null,
      location: body.location || null,
      category: body.category || null,
      year: body.year || null,
      overview: body.overview || "",
      scope: body.scope || null,
      challenge: body.challenge || null,
      solution: body.solution || null,
      results: body.results || null,
      images: Array.isArray(body.images) ? body.images : [],
      services: Array.isArray(body.services) ? body.services : [],
      featured: body.featured ?? false,
      published: body.published ?? true,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      orderIndex: Number(body.orderIndex) || 0,
    });

    const created = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return NextResponse.json(created[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
