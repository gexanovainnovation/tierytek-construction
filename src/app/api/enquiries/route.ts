import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import { ensureAllTables } from "@/db/init";

export async function GET() {
  try {
    await requireAdmin();
    const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch enquiries" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureAllTables();
    const body = await request.json();

    const { name, email, phone, company, projectType, location, budget, message, attachment } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and project message are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const id = generateId();
    await db.insert(enquiries).values({
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      projectType: projectType || null,
      location: location?.trim() || null,
      budget: budget?.trim() || null,
      message: message.trim(),
      attachment: attachment || null,
      status: "new",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting Tierytek Construction. Your enquiry has been received and our engineering team will get in touch shortly.",
      id,
    });
  } catch (error: any) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again or call us directly." },
      { status: 500 }
    );
  }
}
