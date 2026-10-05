import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export interface SiteSettings {
  companyName: string;
  siteTitle: string;
  siteDescription: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  businessHours: string;
  googleMapsEmbed?: string;
  logoUrl?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  footerText?: string;
  copyrightText?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  [key: string]: string | undefined;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "Tierytek Construction",
  siteTitle: "Tierytek Construction | Steel Construction, Roofing & Renovation",
  siteDescription:
    "Tierytek Construction is a premier construction and engineering company in Nigeria specializing in industrial steel frameworks, roofing solutions, and commercial renovation.",
  phone: "+234 800 000 0000",
  email: "info@tierytek.com",
  address: "Lagos, Nigeria",
  whatsapp: "+234 800 000 0000",
  businessHours: "Monday - Friday: 8:00 AM - 5:00 PM",
  footerText: "Precision engineering, structural capability, and durable construction solutions across Nigeria.",
  copyrightText: "Tierytek Construction. All rights reserved.",
  socialFacebook: "https://facebook.com",
  socialTwitter: "https://x.com",
  socialInstagram: "https://instagram.com",
  socialLinkedin: "https://linkedin.com",
};

/**
 * Ensures the settings table exists in PostgreSQL.
 * If the relation does not exist yet, it creates it automatically.
 */
export async function ensureSettingsTable(): Promise<void> {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "settings" (
        "key" TEXT PRIMARY KEY,
        "value" TEXT NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.warn("Could not auto-create settings table:", err);
  }
}

/**
 * Retrieves all site settings as a key-value record.
 * Never throws — if the database or table is not ready, returns DEFAULT_SETTINGS.
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    // This executes: select "key", "value", "updated_at" from "settings"
    const rows = await db
      .select({
        key: settings.key,
        value: settings.value,
        updatedAt: settings.updatedAt,
      })
      .from(settings);

    if (!rows || rows.length === 0) {
      return { ...DEFAULT_SETTINGS };
    }

    const loadedSettings: Record<string, string> = {};
    for (const row of rows) {
      if (row.key) {
        loadedSettings[row.key] = row.value;
      }
    }

    return {
      ...DEFAULT_SETTINGS,
      ...loadedSettings,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    // PostgreSQL error code 42P01: relation does not exist
    if (error?.code === "42P01" || error?.message?.includes("does not exist")) {
      console.warn("[Tierytek Settings] Table 'settings' does not exist yet. Attempting to create it...");
      await ensureSettingsTable();
    } else {
      console.error("[Tierytek Settings] Failed to load settings from DB, using defaults:", error?.message || err);
    }
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Retrieves a single setting by key, with optional fallback.
 */
export async function getSetting(key: keyof SiteSettings | string, fallback = ""): Promise<string> {
  try {
    const rows = await db
      .select({
        key: settings.key,
        value: settings.value,
      })
      .from(settings)
      .where(eq(settings.key, String(key)))
      .limit(1);

    if (rows && rows.length > 0 && rows[0].value !== undefined) {
      return rows[0].value;
    }
  } catch (err) {
    console.warn(`[Tierytek Settings] Error getting setting "${key}":`, err);
  }

  return (DEFAULT_SETTINGS as Record<string, string>)[key] ?? fallback;
}

/**
 * Updates or inserts a single setting.
 */
export async function setSetting(key: string, value: string): Promise<void> {
  await ensureSettingsTable();
  await db
    .insert(settings)
    .values({
      key,
      value,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value,
        updatedAt: new Date(),
      },
    });
}

/**
 * Updates multiple settings in batch.
 */
export async function updateSettings(newSettings: Partial<SiteSettings>): Promise<void> {
  await ensureSettingsTable();
  for (const [key, value] of Object.entries(newSettings)) {
    if (value !== undefined) {
      await setSetting(key, String(value));
    }
  }
}

/**
 * Seeds default settings if the table is currently empty.
 */
export async function seedDefaultSettings(): Promise<void> {
  try {
    await ensureSettingsTable();
    const existing = await db.select().from(settings).limit(1);
    if (existing.length === 0) {
      for (const [key, val] of Object.entries(DEFAULT_SETTINGS)) {
        if (val) {
          await db
            .insert(settings)
            .values({
              key,
              value: val,
              updatedAt: new Date(),
            })
            .onConflictDoNothing();
        }
      }
    }
  } catch (err) {
    console.warn("[Tierytek Settings] Could not seed default settings:", err);
  }
}
