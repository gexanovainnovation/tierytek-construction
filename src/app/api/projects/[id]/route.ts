import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
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
      client: body.client,
      location: body.location,
      category: body.category,
      year: body.year,
      overview: body.overview,
      scope: body.scope,
      challenge: body.challenge,
      solution: body.solution,
      results: body.results,
      services: Array.isArray(body.services) ? body.services : [],
      featured: body.featured,
      published: body.published,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      orderIndex: Number(body.orderIndex) || 0,
      updatedAt: new Date(),
    };

    if (Array.isArray(body.images)) {
      updateData.images = body.images;
    }

    if (body.slug) {
      updateData.slug = slugify(body.slug);
    }

    await db.update(projects).set(updateData).where(eq(projects.id, id));
    const updated = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
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
    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
