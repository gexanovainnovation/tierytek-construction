import { NextResponse } from "next/server";
import { ensureAllTables } from "@/db/init";
import { seedDefaultSettings } from "@/lib/settings";

export async function GET() {
  try {
    await ensureAllTables();
    await seedDefaultSettings();
    return NextResponse.json({
      success: true,
      message: "Database schema and default records initialized successfully.",
    });
  } catch (error: any) {
    console.error("Initialization error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize database" },
      { status: 500 }
    );
  }
}
