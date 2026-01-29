# HisaabHub AEO News System - Complete Documentation

## 📋 Overview

This system enables you to create SEO-optimized news articles with FAQ-style questions that Google can index and display in:
- **Answer Boxes**
- **People Also Ask (PAA)**
- **AI Overview**
- **Featured Snippets**

---

## 🗂️ Folder Structure

```
e:\hisabhub\
├── src\
│   ├── app\
│   │   ├── aeo\
│   │   │   ├── [slug]\
│   │   │   │   └── page.tsx          # SSR Article Page
│   │   │   └── page.tsx               # AEO Index Page
│   │   ├── admin\
│   │   │   └── aeo\
│   │   │       └── new\
│   │   │           └── page.tsx       # Admin Panel
│   │   └── api\
│   │       └── articles\
│   │           ├── route.ts           # POST/GET Articles
│   │           └── [slug]\
│   │               └── route.ts       # GET Article by Slug
│   ├── lib\
│   │   ├── supabase.ts                # Client-side Supabase
│   │   └── supabaseServer.ts          # Server-side Supabase
│   ├── types\
│   │   ├── database.ts                # Database Types
│   │   └── article.ts                 # Article Types
│   └── utils\
│       └── schema.ts                  # JSON-LD Schema Generators
├── pages\
│   └── api\
│       └── articles\
│           ├── index.ts               # Pages Router API
│           └── [slug].ts              # Pages Router API
└── supabase-aeo-schema.sql            # Database Schema

```

---

## 🗄️ Database Schema

### Tables

#### 1. **articles**
| Column      | Type         | Description                    |
|-------------|--------------|--------------------------------|
| id          | UUID         | Primary key                    |
| slug        | TEXT         | URL-friendly identifier (unique)|
| keyword     | TEXT         | Main SEO keyword               |
| summary     | TEXT         | 2-3 line news summary          |
| published   | BOOLEAN      | Publication status             |
| views       | INTEGER      | View count                     |
| created_at  | TIMESTAMPTZ  | Creation timestamp             |
| updated_at  | TIMESTAMPTZ  | Last update timestamp          |

#### 2. **questions**
| Column        | Type         | Description                    |
|---------------|--------------|--------------------------------|
| id            | UUID         | Primary key                    |
| article_id    | UUID         | Foreign key to articles        |
| question_text | TEXT         | Question content               |
| answer_text   | TEXT         | Answer content                 |
| position      | INTEGER      | Display order                  |
| created_at    | TIMESTAMPTZ  | Creation timestamp             |
| updated_at    | TIMESTAMPTZ  | Last update timestamp          |

### Indexes
- `idx_articles_slug` - Fast slug lookups
- `idx_articles_keyword` - Keyword search
- `idx_articles_published` - Filter published articles
- `idx_questions_article_id` - Join optimization
- `idx_questions_position` - Ordering questions

### RLS Policies
- **Public**: Can view published articles and their questions
- **Admin**: Full CRUD access (requires `admin@hisabhub.com` email)

---

## 🔌 API Endpoints

### 1. **POST /api/articles**
Create a new article with questions.

**Request Body:**
```json
{
  "slug": "gst-rate-changes-2026",
  "keyword": "GST Rate Changes 2026",
  "summary": "Government announces new GST rate changes effective from April 2026.",
  "questions": [
    {
      "question_text": "What are the new GST rates for 2026?",
      "answer_text": "The new GST rates include reductions in textile and electronics sectors..."
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "gst-rate-changes-2026",
    "keyword": "GST Rate Changes 2026",
    "summary": "...",
    "questions": [...]
  }
}
```

**Validation:**
- Slug: 3-100 chars, lowercase, hyphens only
- Keyword: 3-200 chars
- Summary: 10-500 chars
- Questions: 1-20 questions
- Question text: 10-500 chars
- Answer text: 20-2000 chars

---

### 2. **GET /api/articles**
List all published articles.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "gst-rate-changes-2026",
      "keyword": "GST Rate Changes 2026",
      "summary": "...",
      "views": 150,
      "created_at": "2026-01-29T08:30:00Z"
    }
  ]
}
```

---

### 3. **GET /api/articles/[slug]**
Get a specific article with all questions.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "gst-rate-changes-2026",
    "keyword": "GST Rate Changes 2026",
    "summary": "...",
    "questions": [
      {
        "id": "uuid",
        "question_text": "What are the new GST rates?",
        "answer_text": "...",
        "position": 1
      }
    ]
  }
}
```

---

## 📄 Pages

### 1. **AEO Article Page** (`/aeo/[slug]`)
- **SSR**: Server-side rendered for instant indexing
- **JSON-LD Schemas**: FAQ, Article, Breadcrumb
- **SEO Metadata**: Title, description, Open Graph, Twitter
- **Structured Content**: H1, H2, H3 hierarchy
- **View Tracking**: Automatic view count increment

### 2. **AEO Index Page** (`/aeo`)
- Lists all published articles
- Responsive grid layout
- SEO optimized listing page

### 3. **Admin Panel** (`/admin/aeo/new`)
- Create new articles
- Add 1-20 questions
- Auto-generate slug from keyword
- Form validation
- Success/error handling

---

## 🔍 SEO Features

### JSON-LD Schemas

#### 1. **FAQPage Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the new GST rates?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

#### 2. **Article Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "GST Rate Changes 2026",
  "description": "...",
  "datePublished": "2026-01-29T08:30:00Z",
  "author": {
    "@type": "Organization",
    "name": "HisaabHub"
  }
}
```

#### 3. **Breadcrumb Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

### Meta Tags
- **Title**: Auto-generated (max 60 chars)
- **Description**: Auto-generated (max 160 chars)
- **Open Graph**: Full support
- **Twitter Cards**: Summary with large image
- **Canonical URL**: Prevents duplicate content

---

## 🚀 Setup Instructions

### 1. **Run SQL Schema**
```bash
# Copy the SQL from supabase-aeo-schema.sql
# Run it in Supabase SQL Editor
```

### 2. **Add Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. **Install Dependencies**
```bash
npm install
```

### 4. **Run Development Server**
```bash
npm run dev
```

### 5. **Create First Article**
Navigate to: `http://localhost:3000/admin/aeo/new`

---

## 📊 How Google Will Index This

### 1. **Server-Side Rendering**
- All content is in HTML on first load
- No client-side fetching delays
- Instant crawlability

### 2. **Structured Data**
- FAQPage schema tells Google these are Q&A pairs
- Article schema provides publication metadata
- Breadcrumb schema shows site hierarchy

### 3. **Content Structure**
- H1: Main keyword (article title)
- H2: "Frequently Asked Questions"
- H3: Each question
- Paragraphs: Each answer

### 4. **Expected Google Features**
- **Answer Box**: Direct answers to questions
- **People Also Ask**: Related questions expansion
- **AI Overview**: Summarized in AI-generated responses
- **Featured Snippets**: Rich result cards
- **Knowledge Graph**: Potential inclusion

### 5. **Indexing Timeline**
- **Immediate**: Submit sitemap to Google Search Console
- **24-48 hours**: Initial indexing
- **1-2 weeks**: Rich results appear
- **Ongoing**: Rankings improve with content quality

---

## 🔐 Security

### RLS Policies
- Public users: Read-only access to published content
- Admin users: Full CRUD access
- Email-based authentication: `admin@hisabhub.com`

### Input Sanitization
- All user inputs are sanitized
- SQL injection protection via Supabase
- XSS prevention via React

### Validation
- Server-side validation on all API routes
- Client-side validation in admin panel
- Type safety with TypeScript

---

## 🧪 Testing

### Manual Testing
1. Create article via admin panel
2. View article at `/aeo/[slug]`
3. Check JSON-LD in page source
4. Verify in Google Rich Results Test
5. Submit to Google Search Console

### Google Tools
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Search Console**: Monitor indexing status
- **PageSpeed Insights**: Check performance

---

## 📈 Best Practices

### Content Guidelines
1. **Keywords**: Use trending, high-volume keywords
2. **Questions**: Natural language, user-focused
3. **Answers**: Comprehensive, 20-200 words
4. **Summary**: Compelling, 2-3 sentences
5. **Freshness**: Update regularly

### SEO Tips
1. Target long-tail keywords
2. Answer specific user queries
3. Use conversational language
4. Include numbers and dates
5. Update existing articles

### Performance
- Static generation with ISR (revalidate: 3600s)
- Optimized database queries
- Indexed foreign keys
- Minimal client-side JavaScript

---

## 🛠️ Maintenance

### Regular Tasks
- Monitor view counts
- Update outdated articles
- Add new trending topics
- Check Google Search Console
- Analyze user engagement

### Database Maintenance
- Vacuum tables monthly
- Monitor index performance
- Archive old articles
- Backup regularly

---

## 📞 Support

For issues or questions:
- Check Supabase logs
- Review Next.js build output
- Test API endpoints with Postman
- Validate JSON-LD with Google tools

---

**Built with ❤️ for HisaabHub AEO System**
