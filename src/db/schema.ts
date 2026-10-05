import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin"] }).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const pages = pgTable("pages", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  imageAlt: text("image_alt"),
  category: text("category"),
  orderIndex: integer("order_index").notNull().default(0),
  published: boolean("published").notNull().default(true),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  client: text("client"),
  location: text("location"),
  category: text("category"),
  year: text("year"),
  overview: text("overview").notNull(),
  scope: text("scope"),
  challenge: text("challenge"),
  solution: text("solution"),
  results: text("results"),
  images: jsonb("images").notNull().$type<{ url: string; alt: string }[]>().default([]),
  services: jsonb("services").notNull().$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const gallery = pgTable("gallery", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  client: text("client"),
  project: text("project"),
  location: text("location"),
  category: text("category"),
  description: text("description"),
  caption: text("caption"),
  altText: text("alt_text"),
  year: text("year"),
  images: jsonb("images").notNull().$type<{ url: string; alt: string }[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  orderIndex: integer("order_index").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  caption: text("caption"),
  uploadedBy: text("uploaded_by"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insights = pgTable("insights", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  imageAlt: text("image_alt"),
  category: text("category"),
  tags: jsonb("tags").notNull().$type<string[]>().default([]),
  authorName: text("author_name"),
  publishedAt: timestamp("published_at"),
  published: boolean("published").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const enquiries = pgTable("enquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  projectType: text("project_type"),
  location: text("location"),
  budget: text("budget"),
  message: text("message").notNull(),
  attachment: text("attachment"),
  status: text("status", { enum: ["new", "contacted", "in_progress", "quoted", "won", "closed"] }).notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type GalleryItem = typeof gallery.$inferSelect;
export type MediaItem = typeof media.$inferSelect;
export type Insight = typeof insights.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type Setting = typeof settings.$inferSelect;
