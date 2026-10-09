import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSession, destroySession } from "@/lib/auth";
import { ensureAllTables } from "@/db/init";
import { sendBusinessNotification } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    await ensureAllTables();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const foundUsers = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);

    if (foundUsers.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = foundUsers[0];
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user.id);
    await sendBusinessNotification(
      "Tierytek admin sign-in",
      `An administrator signed in successfully.\nEmail: ${user.email}\nTime: ${new Date().toISOString()}`
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Authentication error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Logout error" }, { status: 500 });
  }
}
