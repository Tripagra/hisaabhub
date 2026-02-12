# HisaabHub Platform Improvements - Design Document

**Feature Name**: HisaabHub Platform Improvements  
**Version**: 1.0.0  
**Status**: Design Phase  
**Created**: February 12, 2026

---

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js 14)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Public Pages │  │ Admin Panel  │  │ API Routes   │      │
│  │ /aeo/*       │  │ /admin/aeo/* │  │ /api/*       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Middleware Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Check   │  │ Role Check   │  │ Rate Limit   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Auth         │  │ Storage      │      │
│  │ Database     │  │ Service      │  │ (Images)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow

#### Article Creation Flow
```
Admin → Create Form → Validation → API → Database → Revalidate → Sitemap
```

#### Article Edit Flow
```
Admin → Edit Form → Pre-fill Data → Validation → API → Update DB → Revalidate
```

#### Article View Flow
```
User → Article Page → SSR → Database → Render → Increment Views
```

---

## 2. Component Design

### 2.1 Admin Authentication

#### 2.1.1 Middleware Enhancement
**File**: `src/middleware.ts`

**Changes**:
- Remove admin bypass for `/admin/aeo` routes
- Add role-based access control
- Validate admin role from database

**Implementation**:

```typescript
// Enhanced middleware with admin role check
export async function middleware(req: NextRequest) {
  // ... existing auth code ...
  
  // Admin routes protection
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute) {
    // Require authentication
    if (!session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}
```

#### 2.1.2 Admin User Setup
**Database Migration**:
```sql
-- Add role column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create admin user (manual step in Supabase Auth)
-- Then update role:
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@hisabhub.com';
```

---

## 3. Feature Designs

### 3.1 Article Management Dashboard

#### 3.1.1 Admin Dashboard Page
**Route**: `/admin/aeo`  
**File**: `src/app/admin/aeo/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Admin Dashboard - Articles                              │
├─────────────────────────────────────────────────────────┤
│  [Search Box]  [Filter: All ▼]  [+ New Article]        │
├─────────────────────────────────────────────────────────┤
│  Title              Status    Views   Created    Actions│
│  ─────────────────────────────────────────────────────  │
│  GST Changes 2026   Published  1,234  Feb 10    [Edit]  │
│                                                  [Delete]│
│  ─────────────────────────────────────────────────────  │
│  Tax Slab Update    Draft        0    Feb 12    [Edit]  │
│                                                  [Delete]│
└─────────────────────────────────────────────────────────┘
```

**Features**:
- Server-side data fetching
- Client-side search and filter
- Pagination (20 items per page)
- Sort by any column
- Quick actions (Edit, Delete, Toggle Publish)

#### 3.1.2 Edit Article Page
**Route**: `/admin/aeo/edit/[slug]`  
**File**: `src/app/admin/aeo/edit/[slug]/page.tsx`

**Implementation**:
- Reuse form component from create page
- Pre-fill with existing data
- Same validation rules
- Update API endpoint instead of create

---

### 3.2 Article CRUD APIs

#### 3.2.1 Update Article Endpoint
**Route**: `PUT /api/articles/[slug]`  
**File**: `src/app/api/articles/[slug]/route.ts`

**Request Body**:
```typescript
{
  keyword: string;
  summary: string;
  questions: Array<{
    id?: string;  // Existing question ID
    question_text: string;
    answer_text: string;
  }>;
  published?: boolean;
}
```

**Logic**:
1. Validate admin authentication
2. Validate input data
3. Update article record
4. Handle questions:
   - Update existing questions (by ID)
   - Create new questions (no ID)
   - Delete removed questions
5. Revalidate sitemap and article page
6. Return updated article

#### 3.2.2 Delete Article Endpoint
**Route**: `DELETE /api/articles/[slug]`

**Logic**:
1. Validate admin authentication
2. Soft delete (set deleted_at timestamp)
3. Cascade to questions (handled by DB)
4. Log in audit table
5. Revalidate sitemap
6. Return success response

---

### 3.3 Featured Images

#### 3.3.1 Database Schema
```sql
ALTER TABLE public.articles 
ADD COLUMN featured_image TEXT,
ADD COLUMN image_alt TEXT;
```

#### 3.3.2 Storage Setup
**Bucket**: `articles-images`  
**Structure**:
```
articles-images/
  ├── featured/
  │   └── {article-id}.webp
  └── thumbnails/
      └── {article-id}-thumb.webp
```

#### 3.3.3 Upload Component
**File**: `src/components/admin/ImageUpload.tsx`

**Features**:
- Drag and drop support
- Image preview
- Client-side validation (size, format)
- Progress indicator
- Automatic WebP conversion
- Alt text input

**Implementation**:
```typescript
const handleUpload = async (file: File) => {
  // 1. Validate file
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large');
  }

  // 2. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('articles-images')
    .upload(`featured/${articleId}.webp`, file);

  // 3. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('articles-images')
    .getPublicUrl(`featured/${articleId}.webp`);

  // 4. Update article record
  await supabase
    .from('articles')
    .update({ featured_image: publicUrl })
    .eq('id', articleId);
};
```

---

### 3.4 Categories System

#### 3.4.1 Database Schema
```sql
-- Categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table
CREATE TABLE public.article_categories (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, category_id)
);
```

#### 3.4.2 Category Selection Component
**File**: `src/components/admin/CategorySelect.tsx`

**Features**:
- Multi-select dropdown
- Create new category inline
- Search categories
- Display selected categories as tags

#### 3.4.3 Category Page
**Route**: `/aeo/category/[slug]`  
**File**: `src/app/aeo/category/[slug]/page.tsx`

**Features**:
- List articles in category
- SEO optimized (meta tags, JSON-LD)
- Pagination
- Breadcrumb navigation

---

### 3.5 Search Functionality

#### 3.5.1 Search API
**Route**: `GET /api/articles/search?q={query}`  
**File**: `src/app/api/articles/search/route.ts`

**Implementation**:
```typescript
// Use PostgreSQL full-text search
const { data } = await supabase
  .from('articles')
  .select('*, questions(*)')
  .or(`keyword.ilike.%${query}%,summary.ilike.%${query}%`)
  .eq('published', true)
  .limit(20);
```

#### 3.5.2 Search UI
**File**: `src/components/ArticleSearch.tsx`

**Features**:
- Debounced search input
- Real-time results
- Keyboard navigation
- Highlight matching text
- "No results" state

---

### 3.6 Social Sharing

#### 3.6.1 Share Buttons Component
**File**: `src/components/ShareButtons.tsx`

**Platforms**:
- Twitter/X
- LinkedIn
- WhatsApp
- Facebook
- Copy Link

**Implementation**:
```typescript
const shareUrls = {
  twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  whatsapp: `https://wa.me/?text=${title} ${url}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
};
```

#### 3.6.2 Open Graph Images
**Implementation**:
- Use featured image if available
- Generate dynamic OG image if not
- Include in meta tags

---

## 4. Database Design

### 4.1 Enhanced Schema

#### 4.1.1 Users Table
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user',  -- NEW
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.1.2 Articles Table
```sql
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    keyword TEXT NOT NULL,
    summary TEXT NOT NULL,
    featured_image TEXT,        -- NEW
    image_alt TEXT,             -- NEW
    deleted_at TIMESTAMPTZ,     -- NEW (soft delete)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0
);
```

#### 4.1.3 Audit Logs Table
```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 RLS Policies

#### 4.2.1 Admin-Only Policies
```sql
-- Only admins can update articles
CREATE POLICY "Admins can update articles"
ON public.articles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- Only admins can delete articles
CREATE POLICY "Admins can delete articles"
ON public.articles FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);
```

---

## 5. API Design

### 5.1 Article Management APIs

#### 5.1.1 List Articles (Admin)
```
GET /api/admin/articles
Query Params:
  - page: number (default: 1)
  - limit: number (default: 20)
  - status: 'published' | 'draft' | 'all'
  - search: string
  - sort: 'created_at' | 'views' | 'keyword'
  - order: 'asc' | 'desc'

Response:
{
  success: true,
  data: {
    articles: Article[],
    total: number,
    page: number,
    pages: number
  }
}
```

#### 5.1.2 Update Article
```
PUT /api/articles/[slug]
Headers:
  Authorization: Bearer {token}

Body:
{
  keyword: string,
  summary: string,
  questions: Array<{
    id?: string,
    question_text: string,
    answer_text: string
  }>,
  published: boolean,
  featured_image?: string,
  image_alt?: string
}

Response:
{
  success: true,
  data: ArticleWithQuestions
}
```

#### 5.1.3 Delete Article
```
DELETE /api/articles/[slug]
Headers:
  Authorization: Bearer {token}

Response:
{
  success: true,
  message: "Article deleted successfully"
}
```

### 5.2 Category APIs

#### 5.2.1 List Categories
```
GET /api/categories

Response:
{
  success: true,
  data: Category[]
}
```

#### 5.2.2 Create Category
```
POST /api/categories
Headers:
  Authorization: Bearer {token}

Body:
{
  name: string,
  slug: string,
  description?: string
}

Response:
{
  success: true,
  data: Category
}
```

---

## 6. Security Design

### 6.1 Authentication Flow

```
User Login → Supabase Auth → JWT Token → Stored in Cookie
                                ↓
                        Middleware Validates
                                ↓
                        Check User Role
                                ↓
                    Grant/Deny Access
```

### 6.2 Authorization Matrix

| Route                | Public | User | Admin |
|---------------------|--------|------|-------|
| /aeo                | ✅     | ✅   | ✅    |
| /aeo/[slug]         | ✅     | ✅   | ✅    |
| /admin/aeo          | ❌     | ❌   | ✅    |
| /admin/aeo/new      | ❌     | ❌   | ✅    |
| /admin/aeo/edit/*   | ❌     | ❌   | ✅    |
| POST /api/articles  | ❌     | ❌   | ✅    |
| PUT /api/articles/* | ❌     | ❌   | ✅    |
| DELETE /api/articles/* | ❌  | ❌   | ✅    |

### 6.3 Input Validation

**All user inputs must be validated**:
- Client-side: Immediate feedback
- Server-side: Security enforcement
- Database: Constraints and triggers

**Validation Rules**:
- Slug: lowercase, hyphens only, 3-100 chars
- Keyword: 3-200 chars
- Summary: 10-500 chars
- Questions: 1-20 per article
- Question text: 10-500 chars
- Answer text: 20-2000 chars
- Image: max 5MB, JPG/PNG/WebP only

---

## 7. Performance Optimization

### 7.1 Caching Strategy

**Static Pages**:
- Revalidate every 5 minutes
- On-demand revalidation on updates

**Dynamic Pages**:
- ISR with 1-hour revalidation
- On-demand revalidation on updates

**API Responses**:
- No caching for admin endpoints
- 5-minute cache for public endpoints

### 7.2 Image Optimization

**Strategy**:
1. Convert to WebP format
2. Generate multiple sizes (thumbnail, medium, large)
3. Lazy load below the fold
4. Use Next.js Image component
5. Serve from CDN

**Sizes**:
- Thumbnail: 300x200
- Medium: 800x600
- Large: 1200x800

### 7.3 Database Optimization

**Indexes**:
```sql
-- Already exist
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

-- New indexes
CREATE INDEX idx_articles_deleted_at ON articles(deleted_at) 
WHERE deleted_at IS NULL;

CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_article_categories_article 
ON article_categories(article_id);
```

**Query Optimization**:
- Use select() to fetch only needed columns
- Use pagination for large datasets
- Use database functions for complex operations

---

## 8. Error Handling

### 8.1 Error Types

**Client Errors (4xx)**:
- 400: Bad Request (validation failed)
- 401: Unauthorized (not logged in)
- 403: Forbidden (not admin)
- 404: Not Found (article doesn't exist)
- 409: Conflict (duplicate slug)

**Server Errors (5xx)**:
- 500: Internal Server Error
- 503: Service Unavailable (database down)

### 8.2 Error Response Format

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### 8.3 Error Logging

**Implementation**:
- Log all errors to console (development)
- Send to Sentry (production)
- Include context (user, request, stack trace)
- Alert on critical errors

---

## 9. Testing Strategy

### 9.1 Unit Tests

**Coverage Target**: 80%

**Test Files**:
- `src/utils/schema.test.ts` - Validation functions
- `src/lib/supabaseServer.test.ts` - Database helpers
- `src/components/admin/*.test.tsx` - Admin components

### 9.2 Integration Tests

**Scenarios**:
- Article CRUD flow
- Authentication flow
- Image upload flow
- Category assignment

### 9.3 E2E Tests

**Tools**: Playwright

**Scenarios**:
- Admin login and create article
- Edit existing article
- Delete article
- Search articles
- Share article

---

## 10. Deployment Strategy

### 10.1 Environment Setup

**Environments**:
- Development (local)
- Staging (Vercel preview)
- Production (Vercel)

**Environment Variables**:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=

# Sentry (optional)
SENTRY_DSN=
```

### 10.2 Deployment Process

**Steps**:
1. Run tests locally
2. Push to GitHub
3. Vercel auto-deploys to preview
4. QA testing on preview
5. Merge to main
6. Auto-deploy to production
7. Run smoke tests
8. Monitor for errors

### 10.3 Database Migrations

**Process**:
1. Write migration SQL
2. Test on local database
3. Apply to staging database
4. Verify staging works
5. Apply to production database
6. Verify production works

**Rollback Plan**:
- Keep backup before migration
- Have rollback SQL ready
- Test rollback on staging first

---

## 11. Monitoring & Observability

### 11.1 Metrics to Track

**Application Metrics**:
- Request rate (req/min)
- Response time (p50, p95, p99)
- Error rate (%)
- Active users

**Business Metrics**:
- Articles created per day
- Article views per day
- Search queries per day
- Most viewed articles

### 11.2 Alerts

**Critical Alerts**:
- Error rate > 5%
- Response time > 2s
- Database connection failures
- Storage quota exceeded

**Warning Alerts**:
- Error rate > 1%
- Response time > 1s
- High memory usage
- High CPU usage

---

## 12. Documentation

### 12.1 Code Documentation

**Standards**:
- JSDoc comments for all functions
- README in each major directory
- Inline comments for complex logic

### 12.2 API Documentation

**Format**: OpenAPI 3.0

**Sections**:
- Authentication
- Endpoints
- Request/Response schemas
- Error codes
- Examples

### 12.3 User Documentation

**Content**:
- Admin panel user guide
- Content creation best practices
- SEO guidelines
- Troubleshooting guide

---

## 13. Future Enhancements

### 13.1 Phase 6+ Features

**Content Features**:
- Article versioning
- Draft auto-save
- Scheduled publishing
- Content templates
- Bulk operations

**User Features**:
- Article bookmarking
- Reading history
- Personalized recommendations
- Email notifications

**Analytics Features**:
- Advanced analytics dashboard
- A/B testing
- Heatmaps
- User journey tracking

**Technical Features**:
- GraphQL API
- Webhooks
- API rate limiting per user
- Multi-language support

---

**Document Version**: 1.0.0  
**Last Updated**: February 12, 2026  
**Next Review**: After implementation of Phase 1
