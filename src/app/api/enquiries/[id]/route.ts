import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const rows = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const allowedUpdates: any = { updatedAt: new Date() };
    if (body.status !== undefined) allowedUpdates.status = body.status;
    if (body.notes !== undefined) allowedUpdates.notes = body.notes;

    await db.update(enquiries).set(allowedUpdates).where(eq(enquiries.id, id));

    const updated = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
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
    await db.delete(enquiries).where(eq(enquiries.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
