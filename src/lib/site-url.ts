const DEFAULT_SITE_URL = "https://tierytek.com.ng";

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return DEFAULT_SITE_URL;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    console.warn("NEXT_PUBLIC_SITE_URL is invalid; using the default site URL.");
    return DEFAULT_SITE_URL;
  }
}