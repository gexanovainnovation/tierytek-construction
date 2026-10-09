import { MetadataRoute } from "next";
import { db } from "@/db";
import { services, projects, insights } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureAllTables } from "@/db/init";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await ensureAllTables();
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/request-a-quote`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];

  try {
    const publishedServices = await db.select().from(services).where(eq(services.published, true));
    const serviceRoutes: MetadataRoute.Sitemap = publishedServices.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: new Date(s.updatedAt || new Date()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const publishedProjects = await db.select().from(projects).where(eq(projects.published, true));
    const projectRoutes: MetadataRoute.Sitemap = publishedProjects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(p.updatedAt || new Date()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const publishedInsights = await db.select().from(insights).where(eq(insights.published, true));
    const insightRoutes: MetadataRoute.Sitemap = publishedInsights.map((i) => ({
      url: `${baseUrl}/insights/${i.slug}`,
      lastModified: new Date(i.publishedAt || new Date()),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...insightRoutes];
  } catch {
    return staticRoutes;
  }
}
