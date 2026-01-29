# 🚀 Deployment Guide for HisaabHub AEO System

This guide outlines the steps to deploy the HisaabHub Next.js application, including the new AEO News System, to **Vercel**.

## 1. Prerequisites

Before deploying, ensure:
1.  **Supabase Database** is set up with the AEO schema (`supabase-aeo-schema.sql`).
2.  **Environment Variables** are available.

## 2. Environment Variables

You need to add the following environment variables to your deployment project settings (e.g., in Vercel Dashboard > Settings > Environment Variables):

| Variable Name | Description | Required? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | **Yes** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anonymous Key (public) | **Yes** |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (secret) | **Yes** |
| `NEXT_PUBLIC_APP_URL` | The production URL (e.g., https://hisaabhub.com) | **Yes** |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification code | Optional |

> ⚠️ **IMPORTANT:** Never expose `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_` prefix. It must remain a secret for server-side operations only.

## 3. Deployment on Vercel (Recommended)

Next.js is built by Vercel, making it the easiest platform for deployment.

1.  **Push your code** to a Git repository (GitHub, GitLab, Bitbucket).
2.  **Log in to Vercel** and click **"Add New..."** > **"Project"**.
3.  **Import your repository**.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js
    *   **Root Directory**: `.` (default)
    *   **Build Command**: `next build` (default)
    *   **Output Directory**: `.next` (default)
    *   **Install Command**: `npm install` (default)
5.  **Add Environment Variables**: Paste the variables from Step 2.
6.  **Click "Deploy"**.

## 4. Post-Deployment Verification

Once deployed, check the following:

### ✅ 1. Check AEO Index Page
Visit: `https://your-domain.com/aeo`
- Verify the black and gold theme loads.
- Ensure articles (if any) are listed.

### ✅ 2. Check Admin Panel Access
Visit: `https://your-domain.com/admin/aeo/new`
- Ensure you can access the page.
- Try creating a test article.

### ✅ 3. Verify SSR and SEO
Visit an article page (e.g., `https://your-domain.com/aeo/your-article-slug`).
- View Page Source (`Ctrl+U`).
- Search for `application/ld+json`. You should see 3 script tags (FAQPage, Article, Breadcrumb).
- Search for `<title>` and `<meta name="description">`.

### ✅ 4. Google Analytics
- Verify that real-time users are showing up in your GA4 dashboard.

## 5. Troubleshooting Common Issues

### 🔴 "Cookies was called outside a request scope"
**Fix:** This has been resolved in `src/app/aeo/[slug]/page.tsx` by using `createAdminSupabaseClient` for `generateStaticParams`. If it reappears, ensure you are not using `cookies()` in static generation functions.

### 🔴 "Service Role Key Missing"
**Fix:** Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel Environment Variables. It is required for the Admin Panel and static generation.

### 🔴 Styles Missing / Broken UI
**Fix:** Ensure `tailwind.config.js` includes all component paths:
```js
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

## 6. Maintenance

- **Revalidation**: Articles update automatically every hour (`revalidate = 3600`). To update instantly, you may need to redeploy or implement on-demand revalidation.
- **Database Backups**: Enable auto-backups in Supabase.

---

**🚀 Your System is Ready for Production!**
