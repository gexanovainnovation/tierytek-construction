import { NextRequest, NextResponse } from "next/server";
import { deleteMediaItem } from "@/lib/media";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const success = await deleteMediaItem(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
