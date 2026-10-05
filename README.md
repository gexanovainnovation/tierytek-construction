# TIERYTEK CONSTRUCTION — PRODUCTION CMS & WEBSITE

Modern, responsive, architectural-grade website and Content Management System (CMS) for **Tierytek Construction**, engineered with Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL (via Drizzle ORM), and Cloudflare R2 Object Storage.

---

## 1. Why "Option B" (`npx drizzle-kit push`) Was Blocking & How It Is Fixed

When you previously ran `npx drizzle-kit push` or downloaded the zip, it blocked or hung because:

1. **Hardcoded Localhost in `drizzle.config.json`:**  
   The previous configuration file had a hardcoded `postgresql://postgres:postgres@127.0.0.1:5432/app_db` connection string and did not load your `.env` file. Even when you pasted your Neon DB URL into `.env`, Drizzle Kit continued trying to open a socket to `127.0.0.1:5432` on your local machine. Because no local PostgreSQL was running on port 5432, Node.js froze waiting for a TCP connection timeout.
2. **Missing SSL Negotiation for Neon:**  
   Neon requires an SSL handshake (`?sslmode=require`). Without SSL configuration in the connection pool, remote cloud connections stall or are rejected.
3. **No Self-Healing Fallback:**  
   If migration wasn't run before opening the site, missing tables crashed the server during render.

### What has been fixed in this build:
- Replaced `drizzle.config.json` with a modern `drizzle.config.ts` that dynamically loads `.env` with `dotenv`.
- Updated `src/db/index.ts` with auto-detecting SSL for Neon / remote cloud databases (`ssl: { rejectUnauthorized: false }`).
- Added an auto-initialization engine (`src/db/init.ts` and `/api/init`) so the database self-heals and creates all required tables and default admin credentials automatically on first launch, even if `drizzle-kit push` is skipped!

---

## 2. Step-by-Step Guide: Setting Up Neon PostgreSQL

[Neon](https://neon.tech) is a serverless PostgreSQL platform.

### Step 1: Create Your Neon Project
1. Go to [https://neon.tech](https://neon.tech) and sign up / log in.
2. Click **Create Project**.
3. Name your project (e.g., `tierytek-db`) and choose the region closest to your target audience (e.g., `US East (Ohio)` or `Europe (Frankfurt)`).
4. Click **Create Project**.

### Step 2: Copy the Connection String
1. On your Neon Dashboard, find the **Connection Details** widget.
2. Ensure **Pooled connection** is checked (recommended for Next.js / serverless).
3. Select **Node.js** or **Direct URL**.
4. Copy the complete connection string. It will look like this:
   ```text
   postgresql://neondb_owner:npg_xxxxxxxxxx@ep-cool-butterfly-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   *Make sure `?sslmode=require` is present at the end!*

### Step 3: Add to Your Project
1. In your local project folder, open `.env` (or rename `.env.example` to `.env`).
2. Paste your Neon connection string:
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_xxxxxxxxxx@ep-cool-butterfly-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 4: Run Migrations
Run this command from your terminal:
```bash
npx drizzle-kit push
```
*It will now instantly connect to Neon and apply all tables without blocking!*  
*(Note: If you run `npm run dev` directly without running push, the app will also automatically initialize the tables for you on first load via `src/db/init.ts`).*

---

## 3. Step-by-Step Guide: Setting Up Cloudflare R2 Storage

[Cloudflare R2](https://developers.cloudflare.com/r2/) provides fast, S3-compatible object storage with **zero egress bandwidth fees**.

### Step 1: Enable R2 on Cloudflare
1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) and log in.
2. In the left navigation sidebar, click **R2**.
3. Click **Create bucket**.
4. Name your bucket (e.g., `tierytek-media`).
5. Choose **Automatic** or your preferred location, and click **Create Bucket**.

### Step 2: Make the Bucket Public or Connect a Custom Domain
You need public image URLs so visitors can see uploaded photos on the website:
- **Option A (Quickest - R2.dev subdomain):**
  1. Click on your bucket (`tierytek-media`) > **Settings** tab.
  2. Scroll down to **R2.dev subdomain**.
  3. Click **Enable**.
  4. Copy the public URL (e.g., `https://pub-a1b2c3d4e5.r2.dev`).
- **Option B (Custom Domain - Recommended for Production):**
  1. Under the **Settings** tab, scroll to **Custom Domains**.
  2. Click **Connect Domain** (e.g., `media.tierytek.com`).
  3. Cloudflare will automatically configure the DNS record.

### Step 3: Create R2 API Tokens
1. On the main **R2** page (in the right sidebar), click **Manage R2 API Tokens**.
2. Click **Create API Token**.
3. Set permissions to **Object Read & Write**.
4. Under **Apply to specific buckets only**, choose your `tierytek-media` bucket (or all buckets).
5. Click **Create API Token**.
6. Cloudflare will show you:
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint** (format: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`)
   *Copy all three immediately because the secret is shown only once!*

### Step 4: Add R2 Credentials to `.env`
Add these lines to your `.env` file:
```env
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=tierytek-media
R2_PUBLIC_URL=https://pub-a1b2c3d4e5.r2.dev
```

*(Note: If R2 credentials are omitted during local offline development, the app automatically falls back to saving uploads to `public/uploads/` so you can continue testing without interruption).*

---

## 4. Local Development & Deployment

### Local Development:
```bash
# 1. Install dependencies
npm install

# 2. Push schema to database
npx drizzle-kit push

# 3. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploying to Vercel (Production):
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `DATABASE_URL` (Your Neon connection string)
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_URL`
5. Click **Deploy**.

---

## 5. Administrative Access (CMS Portal)

To access the CMS management dashboard:

- **Login URL:** `/admin/login`
- **Initial Default Email:** `admin@tierytek.com`
- **Initial Default Password:** `AdminTierytek2025!`

From the admin dashboard, you can:
- **Review Quotation Enquiries:** Update pipeline status (`new`, `contacted`, `in_progress`, `quoted`, `won`, `closed`).
- **Manage Services:** Add, edit, or publish engineering capabilities.
- **Manage Projects:** Create detailed project case studies with challenge, solution, and scope.
- **Manage Workmanship Gallery:** Add construction photographs with technical captions and alt text.
- **Media Library:** Upload assets directly to Cloudflare R2 or local storage.
- **News & Insights:** Publish company announcements and site updates.
- **Website Settings:** Update business phone number, official address, email, and SEO metadata.

---

## 6. Footer Attribution
As specified in brand requirements, the only permitted attribution is the discreet credit:
```text
Built by GEXANOVA Innovation Limited
```
Located subtly in the footer without logos or external portfolio distractions.
