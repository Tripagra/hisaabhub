# 🚀 HisaabHub AEO System - Quick Setup Guide

## Step 1: Database Setup

### 1.1 Run SQL Schema in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase-aeo-schema.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute

This will create:
- ✅ `articles` table
- ✅ `questions` table
- ✅ Indexes for performance
- ✅ RLS policies for security
- ✅ Triggers for auto-updates
- ✅ Helper functions

### 1.2 Verify Tables Created

Run this query to verify:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('articles', 'questions');
```

You should see both tables listed.

---

## Step 2: Environment Variables

### 2.1 Check Existing Variables

Your `.env.development` should already have:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2.2 Add Service Role Key (Required for Admin)

Add this to `.env.development` and `.env.production`:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Where to find it:**
1. Supabase Dashboard → Settings → API
2. Copy the `service_role` key (keep it secret!)

---

## Step 3: Install Dependencies (Already Done)

Your project already has all required dependencies:
- ✅ `@supabase/ssr`
- ✅ `@supabase/supabase-js`
- ✅ `next`
- ✅ `react`
- ✅ TypeScript

---

## Step 4: Test the System

### 4.1 Start Development Server

```bash
npm run dev
```

Server should be running at: `http://localhost:3000`

### 4.2 Access Admin Panel

Navigate to: `http://localhost:3000/admin/aeo/new`

### 4.3 Create Your First Article

Fill in the form:
- **Keyword**: "GST Rate Changes 2026"
- **Slug**: Auto-generated as "gst-rate-changes-2026"
- **Summary**: "Government announces new GST rate changes effective from April 2026, affecting multiple sectors including textiles and electronics."
- **Questions**: Add 3-5 questions with detailed answers

Click **Create Article**

### 4.4 View the Article

After creation, you'll be redirected to:
`http://localhost:3000/aeo/gst-rate-changes-2026`

### 4.5 View All Articles

Navigate to: `http://localhost:3000/aeo`

---

## Step 5: Verify SEO Implementation

### 5.1 Check Page Source

1. Visit your article page
2. Right-click → View Page Source
3. Search for `application/ld+json`
4. You should see 3 JSON-LD schemas:
   - FAQPage
   - Article
   - BreadcrumbList

### 5.2 Test with Google Rich Results

1. Go to: https://search.google.com/test/rich-results
2. Enter your article URL (use ngrok for local testing)
3. Verify that FAQPage schema is detected

---

## Step 6: Admin Access Configuration

### 6.1 Create Admin User in Supabase

1. Go to Supabase → Authentication → Users
2. Click **Add User**
3. Email: `admin@hisabhub.com`
4. Password: (choose a strong password)
5. Confirm email (or disable email confirmation for testing)

### 6.2 Update RLS Policy (Optional)

If you want to use a different admin email, update the SQL:

```sql
-- Replace 'admin@hisabhub.com' with your email
CREATE POLICY "Admins can insert articles"
    ON public.articles FOR INSERT
    WITH CHECK (auth.jwt() ->> 'email' = 'your-email@example.com');
```

Run this for all admin policies in the schema.

---

## Step 7: API Testing

### 7.1 Test POST Endpoint

Use Postman or curl:

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-article",
    "keyword": "Test Article",
    "summary": "This is a test article summary for testing purposes.",
    "questions": [
      {
        "question_text": "What is this test about?",
        "answer_text": "This is a test to verify the API is working correctly."
      }
    ]
  }'
```

Expected response: `201 Created`

### 7.2 Test GET Endpoint

```bash
curl http://localhost:3000/api/articles/test-article
```

Expected response: Article with questions

---

## Step 8: Production Deployment

### 8.1 Add Production Environment Variables

In your hosting platform (Vercel, etc.):
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 8.2 Build and Deploy

```bash
npm run build
npm run start
```

Or deploy to Vercel:
```bash
vercel --prod
```

---

## Step 9: Google Search Console Setup

### 9.1 Submit Sitemap

Create a sitemap that includes your AEO pages:
```xml
<url>
  <loc>https://hisaabhub.com/aeo</loc>
  <changefreq>daily</changefreq>
</url>
<url>
  <loc>https://hisaabhub.com/aeo/gst-rate-changes-2026</loc>
  <changefreq>weekly</changefreq>
</url>
```

### 9.2 Request Indexing

1. Go to Google Search Console
2. URL Inspection tool
3. Enter your article URL
4. Click **Request Indexing**

---

## Step 10: Monitor and Optimize

### 10.1 Check Analytics

Monitor:
- Page views
- Click-through rates
- Search queries
- Rich result impressions

### 10.2 Optimize Content

- Add more questions based on user queries
- Update answers with latest information
- Target trending keywords
- Improve answer quality

---

## 🎯 Quick Checklist

- [ ] SQL schema executed in Supabase
- [ ] Tables created and verified
- [ ] Environment variables configured
- [ ] Service role key added
- [ ] Development server running
- [ ] Admin panel accessible
- [ ] First article created
- [ ] Article page renders correctly
- [ ] JSON-LD schemas present in source
- [ ] API endpoints tested
- [ ] Production deployment configured
- [ ] Google Search Console setup

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Check `.env.development` has all required variables

### Issue: "Failed to create article"
**Solution**: Verify RLS policies and admin email in Supabase

### Issue: "Article not found"
**Solution**: Check if article is published (`published = true`)

### Issue: "JSON-LD not showing"
**Solution**: View page source (not browser inspector)

### Issue: "API returns 500 error"
**Solution**: Check Supabase logs and Next.js console

---

## 📞 Need Help?

- Check `AEO_SYSTEM_DOCUMENTATION.md` for detailed info
- Review Supabase logs for database errors
- Check Next.js build output for compilation errors
- Test API endpoints individually

---

**Ready to create SEO-optimized content! 🚀**
