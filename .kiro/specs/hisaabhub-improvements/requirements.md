# HisaabHub Platform Improvements - Requirements

**Feature Name**: HisaabHub Platform Improvements  
**Version**: 1.0.0  
**Status**: Draft  
**Created**: February 12, 2026  
**Owner**: Development Team

---

## 1. Executive Summary

This specification outlines critical improvements to the HisaabHub tax services platform, focusing on security, content management, and user experience enhancements. The improvements are based on a comprehensive site audit and prioritized by business impact and security requirements.

### Business Goals
- Secure the admin panel to prevent unauthorized content creation
- Enable efficient content management for tax news articles
- Improve SEO and user engagement through enhanced features
- Establish a scalable foundation for future growth

### Success Metrics
- Zero unauthorized access to admin panel
- 50% reduction in content management time
- 30% increase in article engagement (views, time on page)
- 100% sitemap accuracy for search engine indexing

---

## 2. User Stories

### 2.1 Admin Security & Authentication

**US-1.1**: As a site administrator, I need secure access to the admin panel so that only authorized users can create/manage content.

**Acceptance Criteria**:
- Admin routes require authentication
- Only users with 'admin' role can access admin panel
- Unauthorized access attempts redirect to login page
- Session validation on every admin request
- Admin role stored securely in database

**Priority**: 🔴 Critical  
**Estimated Effort**: 2 days

---

**US-1.2**: As a site administrator, I need to manage my admin credentials so that I can maintain secure access.

**Acceptance Criteria**:
- Admin user created in Supabase Auth
- Admin role assigned in users table
- Password reset functionality available
- Email verification required
- Multi-factor authentication support (future)

**Priority**: 🔴 Critical  
**Estimated Effort**: 1 day

---

### 2.2 Article Management

**US-2.1**: As a content manager, I need to edit existing articles so that I can correct errors and update information.

**Acceptance Criteria**:
- Edit page accessible at `/admin/aeo/edit/[slug]`
- Pre-populated form with existing article data
- All fields editable (keyword, summary, questions)
- Validation matches create form
- Success/error feedback provided
- Redirects to article page after save
- Sitemap updates automatically after edit

**Priority**: 🟡 High  
**Estimated Effort**: 3 days

---

**US-2.2**: As a content manager, I need to delete articles so that I can remove outdated or incorrect content.

**Acceptance Criteria**:
- Delete button available in admin dashboard
- Confirmation modal before deletion
- Cascade delete removes associated questions
- Soft delete option (unpublish) available
- Audit log of deletions maintained
- Sitemap updates automatically after deletion

**Priority**: 🟡 High  
**Estimated Effort**: 2 days

---

**US-2.3**: As a content manager, I need an admin dashboard to view and manage all articles efficiently.

**Acceptance Criteria**:
- Dashboard accessible at `/admin/aeo`
- Table view of all articles (published + unpublished)
- Columns: Title, Status, Views, Created Date, Actions
- Sort by any column
- Filter by status (published/unpublished)
- Search by keyword
- Quick actions: Edit, Delete, View, Toggle Publish
- Pagination for large datasets

**Priority**: 🟡 High  
**Estimated Effort**: 4 days

---

### 2.3 Article Enhancement

**US-3.1**: As a content manager, I need to add featured images to articles so that they are more visually appealing.

**Acceptance Criteria**:
- Image upload field in create/edit forms
- Supabase Storage integration
- Image preview before upload
- Automatic image optimization
- Alt text field for accessibility
- Image displayed on article page
- Image included in Open Graph tags
- Maximum file size: 5MB
- Supported formats: JPG, PNG, WebP

**Priority**: 🟡 High  
**Estimated Effort**: 3 days

---

**US-3.2**: As a content manager, I need to categorize articles so that users can find related content easily.

**Acceptance Criteria**:
- Categories table in database
- Category selection in create/edit forms
- Multiple categories per article (tags)
- Category pages at `/aeo/category/[slug]`
- Category filter on article listing page
- Category breadcrumb in article page
- Sitemap includes category pages

**Priority**: 🟢 Medium  
**Estimated Effort**: 4 days

---

**US-3.3**: As a reader, I need to search for articles so that I can find specific tax information quickly.

**Acceptance Criteria**:
- Search bar on `/aeo` page
- Full-text search across keyword, summary, questions
- Search results page with highlighting
- Filter by category
- Sort by relevance, date, views
- "No results" state with suggestions
- Search analytics tracked

**Priority**: 🟢 Medium  
**Estimated Effort**: 3 days

---

### 2.4 SEO & Social Features

**US-4.1**: As a reader, I need to share articles on social media so that I can inform others about tax updates.

**Acceptance Criteria**:
- Share buttons for Twitter, LinkedIn, WhatsApp, Facebook
- Copy link button
- Share count displayed (optional)
- Open Graph images generated
- Twitter Card images generated
- Share tracking in analytics

**Priority**: 🟢 Medium  
**Estimated Effort**: 2 days

---

**US-4.2**: As a reader, I need to see related articles so that I can explore similar tax topics.

**Acceptance Criteria**:
- "Related Articles" section at bottom of article
- Algorithm based on category and keywords
- Display 3-5 related articles
- Thumbnail, title, summary shown
- Click tracking for recommendations

**Priority**: 🟢 Medium  
**Estimated Effort**: 2 days

---

**US-4.3**: As a site owner, I need an RSS feed so that readers can subscribe to new articles.

**Acceptance Criteria**:
- RSS feed at `/aeo/feed.xml`
- Includes last 20 articles
- Full content in feed
- Valid RSS 2.0 format
- Auto-discovery meta tag in HTML
- Updates automatically with new articles

**Priority**: 🟢 Low  
**Estimated Effort**: 1 day

---

### 2.5 Analytics & Monitoring

**US-5.1**: As a site owner, I need to track article performance so that I can understand what content resonates with readers.

**Acceptance Criteria**:
- View count tracking (already implemented)
- Time on page tracking
- Scroll depth tracking
- Click tracking on CTAs
- Analytics dashboard in admin panel
- Export data to CSV
- Integration with Google Analytics 4

**Priority**: 🟢 Medium  
**Estimated Effort**: 3 days

---

**US-5.2**: As a developer, I need error monitoring so that I can quickly identify and fix issues.

**Acceptance Criteria**:
- Sentry integration for error tracking
- Error boundaries in React components
- API error logging
- Database error logging
- Performance monitoring
- Alert notifications for critical errors

**Priority**: 🟢 Medium  
**Estimated Effort**: 2 days

---

## 3. Technical Requirements

### 3.1 Database Schema Changes

#### 3.1.1 Users Table Enhancement
```sql
-- Add role column if not exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add index for role queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
```

#### 3.1.2 Articles Table Enhancement
```sql
-- Add featured image column
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Add soft delete column
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add index for deleted_at
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at 
ON public.articles(deleted_at) 
WHERE deleted_at IS NULL;
```

#### 3.1.3 Categories Table
```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create article_categories junction table
CREATE TABLE IF NOT EXISTS public.article_categories (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, category_id)
);

-- Add indexes
CREATE INDEX idx_article_categories_article 
ON public.article_categories(article_id);

CREATE INDEX idx_article_categories_category 
ON public.article_categories(category_id);
```

#### 3.1.4 Audit Log Table
```sql
-- Create audit log for tracking changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- 'create', 'update', 'delete'
    entity_type TEXT NOT NULL, -- 'article', 'question', etc.
    entity_id UUID NOT NULL,
    changes JSONB, -- Store old and new values
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for queries
CREATE INDEX idx_audit_logs_entity 
ON public.audit_logs(entity_type, entity_id);

CREATE INDEX idx_audit_logs_user 
ON public.audit_logs(user_id);
```

### 3.2 API Endpoints

#### 3.2.1 Article Management APIs
```
PUT    /api/articles/[slug]     - Update article
DELETE /api/articles/[slug]     - Delete article (soft delete)
PATCH  /api/articles/[slug]     - Toggle publish status
GET    /api/articles/[slug]/analytics - Get article analytics
```

#### 3.2.2 Category APIs
```
GET    /api/categories          - List all categories
POST   /api/categories          - Create category
PUT    /api/categories/[id]     - Update category
DELETE /api/categories/[id]     - Delete category
```

#### 3.2.3 Admin APIs
```
GET    /api/admin/articles      - List all articles (admin view)
GET    /api/admin/analytics     - Get dashboard analytics
GET    /api/admin/audit-logs    - Get audit logs
```

### 3.3 Authentication & Authorization

#### 3.3.1 Middleware Enhancement
- Remove admin bypass for `/admin/aeo` routes
- Add role-based access control (RBAC)
- Validate admin role on every admin request
- Add rate limiting for admin endpoints

#### 3.3.2 RLS Policies
```sql
-- Admin-only policies for sensitive operations
CREATE POLICY "Admins can update articles"
ON public.articles FOR UPDATE
USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM public.users WHERE role = 'admin'
    )
);

CREATE POLICY "Admins can delete articles"
ON public.articles FOR DELETE
USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM public.users WHERE role = 'admin'
    )
);
```

### 3.4 File Storage

#### 3.4.1 Supabase Storage Buckets
```
articles-images/
  ├── featured/          - Featured images
  ├── content/           - Inline content images
  └── thumbnails/        - Auto-generated thumbnails
```

#### 3.4.2 Storage Policies
```sql
-- Allow public read access
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'articles-images');

-- Allow admin upload
CREATE POLICY "Admins can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'articles-images' AND
    auth.jwt() ->> 'email' IN (
        SELECT email FROM public.users WHERE role = 'admin'
    )
);
```

### 3.5 Performance Requirements

- Page load time: < 2 seconds (LCP)
- API response time: < 500ms (p95)
- Database query time: < 100ms (p95)
- Image optimization: WebP format, lazy loading
- Bundle size: < 300KB (gzipped)

### 3.6 Security Requirements

- HTTPS only (enforced)
- CSRF protection (enabled)
- XSS prevention (sanitization)
- SQL injection prevention (parameterized queries)
- Rate limiting (100 req/min per IP)
- Input validation (all forms)
- Output encoding (all user content)
- Secure headers (CSP, HSTS, etc.)

---

## 4. Non-Functional Requirements

### 4.1 Scalability
- Support 10,000+ articles
- Handle 100,000+ monthly visitors
- Database connection pooling
- CDN for static assets

### 4.2 Reliability
- 99.9% uptime SLA
- Automated backups (daily)
- Disaster recovery plan
- Error monitoring and alerting

### 4.3 Maintainability
- Code documentation
- API documentation
- Deployment documentation
- Monitoring dashboards

### 4.4 Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Alt text for all images

### 4.5 Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 5. Dependencies

### 5.1 External Services
- Supabase (database, auth, storage)
- Vercel (hosting, edge functions)
- Google Analytics (analytics)
- Sentry (error monitoring) - to be added

### 5.2 NPM Packages
- @supabase/supabase-js (existing)
- @supabase/ssr (existing)
- sharp (image optimization) - existing
- sentry/nextjs (error monitoring) - to be added

---

## 6. Risks & Mitigation

### 6.1 Security Risks
**Risk**: Unauthorized access to admin panel  
**Impact**: High  
**Mitigation**: Implement RBAC, add audit logging, regular security audits

### 6.2 Data Loss Risks
**Risk**: Accidental article deletion  
**Impact**: Medium  
**Mitigation**: Soft delete, audit logs, automated backups

### 6.3 Performance Risks
**Risk**: Slow page loads with many images  
**Impact**: Medium  
**Mitigation**: Image optimization, lazy loading, CDN

### 6.4 SEO Risks
**Risk**: Sitemap not updating correctly  
**Impact**: High  
**Mitigation**: Already mitigated with instant revalidation

---

## 7. Implementation Phases

### Phase 1: Security & Critical Fixes (Week 1)
- US-1.1: Admin authentication
- US-1.2: Admin user management
- Database schema updates (users.role)

### Phase 2: Article Management (Week 2-3)
- US-2.1: Edit articles
- US-2.2: Delete articles
- US-2.3: Admin dashboard
- API endpoints for CRUD operations

### Phase 3: Content Enhancement (Week 4-5)
- US-3.1: Featured images
- US-3.2: Categories
- US-3.3: Search functionality

### Phase 4: SEO & Social (Week 6)
- US-4.1: Social sharing
- US-4.2: Related articles
- US-4.3: RSS feed

### Phase 5: Analytics & Monitoring (Week 7)
- US-5.1: Analytics dashboard
- US-5.2: Error monitoring

---

## 8. Testing Requirements

### 8.1 Unit Tests
- API endpoint tests
- Utility function tests
- Component tests

### 8.2 Integration Tests
- Authentication flow
- Article CRUD operations
- Image upload flow

### 8.3 E2E Tests
- Admin login and article creation
- Article editing and deletion
- Search functionality

### 8.4 Security Tests
- Unauthorized access attempts
- SQL injection attempts
- XSS attempts
- CSRF protection

---

## 9. Documentation Requirements

### 9.1 User Documentation
- Admin panel user guide
- Content creation best practices
- SEO guidelines for articles

### 9.2 Technical Documentation
- API documentation (OpenAPI spec)
- Database schema documentation
- Deployment guide
- Troubleshooting guide

### 9.3 Code Documentation
- JSDoc comments for functions
- README files for modules
- Architecture decision records (ADRs)

---

## 10. Acceptance Criteria (Overall)

### 10.1 Security
- [ ] Admin panel requires authentication
- [ ] Only admin role can access admin features
- [ ] All admin actions logged in audit table
- [ ] No security vulnerabilities in penetration test

### 10.2 Functionality
- [ ] All CRUD operations work correctly
- [ ] Image upload and display working
- [ ] Search returns accurate results
- [ ] Categories filter articles correctly
- [ ] Social sharing works on all platforms

### 10.3 Performance
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] No console errors in production
- [ ] Lighthouse score > 90

### 10.4 SEO
- [ ] Sitemap updates automatically
- [ ] All pages have proper meta tags
- [ ] JSON-LD schemas valid
- [ ] No broken links

### 10.5 User Experience
- [ ] Forms have proper validation
- [ ] Error messages are clear
- [ ] Success feedback provided
- [ ] Mobile responsive
- [ ] Accessible (WCAG AA)

---

## 11. Sign-off

### 11.1 Stakeholders
- [ ] Product Owner
- [ ] Development Team Lead
- [ ] Security Team
- [ ] QA Team

### 11.2 Approval Date
_To be filled after review_

---

**Document Version**: 1.0.0  
**Last Updated**: February 12, 2026  
**Next Review**: After Phase 1 completion
