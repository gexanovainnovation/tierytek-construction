import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings, seedDefaultSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  await seedDefaultSettings();
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    await updateSettings(body);
    const updated = await getSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
