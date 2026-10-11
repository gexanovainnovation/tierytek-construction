import { db } from "./index";
import { sql } from "drizzle-orm";
import { hashPassword } from "../lib/auth";

export async function ensureAllTables(): Promise<void> {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password_hash" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'admin',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "pages" (
        "id" TEXT PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "seo_title" TEXT,
        "seo_description" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "services" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "short_description" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "image" TEXT,
        "image_alt" TEXT,
        "category" TEXT,
        "order_index" INTEGER NOT NULL DEFAULT 0,
        "published" BOOLEAN NOT NULL DEFAULT TRUE,
        "seo_title" TEXT,
        "seo_description" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "projects" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "client" TEXT,
        "location" TEXT,
        "category" TEXT,
        "year" TEXT,
        "overview" TEXT NOT NULL,
        "scope" TEXT,
        "challenge" TEXT,
        "solution" TEXT,
        "results" TEXT,
        "images" JSONB NOT NULL DEFAULT '[]'::jsonb,
        "services" JSONB NOT NULL DEFAULT '[]'::jsonb,
        "featured" BOOLEAN NOT NULL DEFAULT FALSE,
        "published" BOOLEAN NOT NULL DEFAULT TRUE,
        "seo_title" TEXT,
        "seo_description" TEXT,
        "order_index" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "gallery" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "client" TEXT,
        "project" TEXT,
        "location" TEXT,
        "category" TEXT,
        "description" TEXT,
        "caption" TEXT,
        "alt_text" TEXT,
        "year" TEXT,
        "images" JSONB NOT NULL DEFAULT '[]'::jsonb,
        "featured" BOOLEAN NOT NULL DEFAULT FALSE,
        "order_index" INTEGER NOT NULL DEFAULT 0,
        "published" BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "media" (
        "id" TEXT PRIMARY KEY,
        "filename" TEXT NOT NULL,
        "original_name" TEXT NOT NULL,
        "mime_type" TEXT NOT NULL,
        "size" INTEGER NOT NULL,
        "url" TEXT NOT NULL,
        "alt_text" TEXT,
        "caption" TEXT,
        "uploaded_by" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "insights" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "excerpt" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "image" TEXT,
        "image_alt" TEXT,
        "category" TEXT,
        "tags" JSONB NOT NULL DEFAULT '[]'::jsonb,
        "author_name" TEXT,
        "published_at" TIMESTAMP,
        "published" BOOLEAN NOT NULL DEFAULT FALSE,
        "featured" BOOLEAN NOT NULL DEFAULT FALSE,
        "seo_title" TEXT,
        "seo_description" TEXT,
        "order_index" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "enquiries" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "company" TEXT,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "project_type" TEXT,
        "location" TEXT,
        "budget" TEXT,
        "message" TEXT NOT NULL,
        "attachment" TEXT,
        "status" TEXT NOT NULL DEFAULT 'new',
        "notes" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "settings" (
        "key" TEXT PRIMARY KEY,
        "value" TEXT NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Seed default admin if no user exists
    const usersCount = await db.execute(sql`SELECT count(*) FROM users;`);
    const count = Number((usersCount as any)[0]?.count ?? (usersCount.rows as any)?.[0]?.count ?? 0);
    if (count === 0) {
      const defaultPasswordHash = await hashPassword("AdminTierytek2025!");
      await db.execute(sql`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ('admin-default', 'Tierytek Admin', 'admin@tierytek.com', ${defaultPasswordHash}, 'admin')
        ON CONFLICT (email) DO NOTHING;
      `);
    }

    // Seed initial verified Tierytek services if empty
    const servicesCount = await db.execute(sql`SELECT count(*) FROM services;`);
    const sCount = Number((servicesCount as any)[0]?.count ?? (servicesCount.rows as any)?.[0]?.count ?? 0);
    if (sCount === 0) {
      await db.execute(sql`
        INSERT INTO services (id, title, slug, short_description, content, category, order_index, published)
        VALUES 
        ('srv-1', 'Steel Construction', 'steel-construction', 'Precision-built frames and beams engineered for strength and longevity.', 'At Tierytek Construction, we specialize in high-precision structural steel fabrication, erection, and heavy industrial framework design. From multi-storey steel buildings to industrial warehouses, we deliver durable, modern, and efficient solutions tailored to your operational needs.', 'Engineering', 1, true),
        ('srv-2', 'Roofing Solutions', 'roofing-solutions', 'Weather-resistant roofs installed with safety, speed, and durability.', 'We provide innovative, weather-resistant roofing systems engineered to withstand severe climate conditions across Nigeria. Our offerings include long-span steel trusses, industrial sheeting, insulation, and complete water management systems.', 'Construction', 2, true),
        ('srv-3', 'Renovation & Structural Retrofitting', 'renovation', 'Revamping spaces with modern finishes and thoughtful functionality.', 'Transforming existing industrial, commercial, and residential spaces with modern engineering techniques, structural reinforcement, and high-standard finishing.', 'Renovation', 3, true),
        ('srv-4', 'Structural Engineering', 'structural-engineering', 'Comprehensive analysis and engineering of load-bearing structural members.', 'Our licensed engineers perform precision load calculations, seismic analysis, structural integrity audits, and bespoke steel design.', 'Engineering', 4, true),
        ('srv-5', 'Architectural Design', 'architectural-design', 'Creative designs that bring architectural visions to life.', 'Functional, modern architectural design aligned with structural engineering principles for industrial and commercial projects.', 'Architecture', 5, true),
        ('srv-6', 'Logistics & Supply', 'logistics-supply', 'Reliable delivery of materials for seamless construction flow.', 'End-to-end procurement and delivery of high-grade construction steel, structural beams, and roofing hardware.', 'Logistics', 6, true)
        ON CONFLICT (slug) DO NOTHING;
      `);
    }

    const projectsCount = await db.execute(sql`SELECT count(*) FROM projects;`);
    const pCount = Number((projectsCount as any)[0]?.count ?? (projectsCount.rows as any)?.[0]?.count ?? 0);
    if (pCount === 0) {
      await db.execute(sql`
        INSERT INTO projects (id, title, slug, category, overview, scope, images, featured, published, order_index)
        VALUES
        ('project-showcase-steel-frame', 'Structural Steel Framing', 'structural-steel-framing-showcase', 'Steel Construction', 'A representative look at structural steel framing and on-site assembly. Replace this showcase with verified project details as they become available.', 'Steel framing, component alignment, and construction-site coordination.', '[{"url":"/images/hero1.png","alt":"Structural steel frame assembled on a construction site"}]'::jsonb, true, true, 1),
        ('project-showcase-roofing', 'Roofing & Truss Systems', 'roofing-truss-systems-showcase', 'Roofing Solutions', 'Construction photography highlighting roof framing and weather-resistant building envelopes. Project-specific details can be updated by the team.', 'Roof structure preparation and roofing system installation.', '[{"url":"/images/home-hero.jpg","alt":"Roof structure and construction work"}]'::jsonb, true, true, 2),
        ('project-showcase-site-assembly', 'On-Site Structural Assembly', 'on-site-structural-assembly-showcase', 'Structural Work', 'A representative view of steel components assembled on site. Replace the image and description with verified client project information when ready.', 'Structural component placement and site assembly.', '[{"url":"/images/hero2.png","alt":"Steel construction work in progress"}]'::jsonb, false, true, 3)
        ON CONFLICT (slug) DO NOTHING;
      `);
    }

    const galleryCount = await db.execute(sql`SELECT count(*) FROM gallery;`);
    const gCount = Number((galleryCount as any)[0]?.count ?? (galleryCount.rows as any)?.[0]?.count ?? 0);
    if (gCount === 0) {
      await db.execute(sql`
        INSERT INTO gallery (id, title, category, description, caption, alt_text, images, featured, order_index, published)
        VALUES
        ('gallery-showcase-steel-frame', 'Steel Frame Assembly', 'Steel Construction', 'Structural steelwork and assembly photography.', 'Structural steel framing', 'Steel frame assembly at a construction site', '[{"url":"/images/hero1.png","alt":"Steel frame assembly at a construction site"}]'::jsonb, true, 1, true),
        ('gallery-showcase-roofing', 'Roofing Work', 'Roofing Solutions', 'Roof structure and construction photography.', 'Roof structure installation', 'Roof structure during construction', '[{"url":"/images/home-hero.jpg","alt":"Roof structure during construction"}]'::jsonb, true, 2, true),
        ('gallery-showcase-steel-work', 'Structural Steelwork', 'Structural Work', 'Steel components arranged and assembled on site.', 'Steel construction in progress', 'Steel construction work in progress', '[{"url":"/images/hero2.png","alt":"Steel construction work in progress"}]'::jsonb, true, 3, true),
        ('gallery-showcase-roof-detail', 'Roofing Detail', 'Roofing Solutions', 'A closer look at roofing construction and building details.', 'Roofing construction detail', 'Roofing and building construction detail', '[{"url":"/images/home-hero1.jpg","alt":"Roofing construction detail"}]'::jsonb, false, 4, true)
        ON CONFLICT (id) DO NOTHING;
      `);
    }

    // Seed verified news articles from existing site
    const insightsCount = await db.execute(sql`SELECT count(*) FROM insights;`);
    const iCount = Number((insightsCount as any)[0]?.count ?? (insightsCount.rows as any)?.[0]?.count ?? 0);
    if (iCount === 0) {
      await db.execute(sql`
        INSERT INTO insights (id, title, slug, excerpt, content, category, published, published_at)
        VALUES
        ('ins-1', 'Tierytek Expands Steel Construction Projects', 'tierytek-expands-steel-construction', 'Our team recently completed a landmark steel framework project, setting new standards in durability.', 'Our team recently completed a landmark steel framework project, setting new standards in durability and structural integrity across Nigeria. We continue to pioneer modern construction techniques to support growing infrastructure demands.', 'Steel Construction', true, '2025-12-10 00:00:00'),
        ('ins-2', 'Innovative Roofing Solutions for Urban Homes', 'innovative-roofing-solutions', 'We introduced advanced roofing materials designed to withstand Nigeria''s toughest weather conditions.', 'We introduced advanced roofing materials designed to withstand Nigeria''s toughest weather conditions, providing long-lasting protection and thermal efficiency.', 'Roofing', true, '2025-11-28 00:00:00'),
        ('ins-3', 'Renovation Project Transforms Old Spaces', 'renovation-transforms-old-spaces', 'Tierytek recently renovated a commercial space, blending modern design with functional layouts.', 'Tierytek recently renovated a commercial space, blending modern design with functional layouts to create productive, aesthetically sound commercial spaces.', 'Renovation', true, '2025-11-15 00:00:00')
        ON CONFLICT (slug) DO NOTHING;
      `);
    }
  } catch (err) {
    console.warn("[Tierytek DB Init] Notice:", err);
  }
}
