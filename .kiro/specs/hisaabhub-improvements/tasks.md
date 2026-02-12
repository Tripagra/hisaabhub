# HisaabHub Platform Improvements - Implementation Tasks

**Feature**: HisaabHub Platform Improvements  
**Version**: 1.0.0  
**Status**: Ready for Implementation

---

## Phase 1: Security & Critical Fixes (Week 1)

### 1. Admin Authentication & Authorization

- [x] 1.1 Update database schema for user roles
  - [x] 1.1.1 Add role column to users table
  - [x] 1.1.2 Create index on role column
  - [x] 1.1.3 Update TypeScript types for users table
  
- [x] 1.2 Enhance middleware for admin protection
  - [x] 1.2.1 Remove admin bypass for /admin/aeo routes
  - [x] 1.2.2 Add role-based access control logic
  - [x] 1.2.3 Add redirect to login for unauthorized access
  - [x] 1.2.4 Add role validation from database
  
- [x] 1.3 Update RLS policies for admin operations
  - [x] 1.3.1 Create admin-only update policy for articles
  - [x] 1.3.2 Create admin-only delete policy for articles
  - [x] 1.3.3 Create admin-only insert policy for questions
  - [x] 1.3.4 Test RLS policies with admin and non-admin users
  
- [x] 1.4 Create admin user
  - [x] 1.4.1 Create admin user in Supabase Auth dashboard
  - [x] 1.4.2 Update user role to 'admin' in database
  - [x] 1.4.3 Test admin login and access
  - [x] 1.4.4 Document admin credentials securely

---

## Phase 2: Article Management (Week 2-3)

### 2. Admin Dashboard

- [ ] 2.1 Create admin dashboard page
  - [ ] 2.1.1 Create /admin/aeo/page.tsx
  - [ ] 2.1.2 Implement server-side data fetching
  - [ ] 2.1.3 Create table component for article listing
  - [ ] 2.1.4 Add pagination component
  - [ ] 2.1.5 Add search functionality
  - [ ] 2.1.6 Add filter by status (published/draft)
  - [ ] 2.1.7 Add sort by column functionality
  
- [ ] 2.2 Create admin API endpoints
  - [ ] 2.2.1 Create GET /api/admin/articles endpoint
  - [ ] 2.2.2 Add pagination logic
  - [ ] 2.2.3 Add search logic
  - [ ] 2.2.4 Add filter logic
  - [ ] 2.2.5 Add sort logic
  - [ ] 2.2.6 Add authentication check
  - [ ] 2.2.7 Add admin role check

### 3. Edit Article Feature

- [ ] 3.1 Create edit article page
  - [ ] 3.1.1 Create /admin/aeo/edit/[slug]/page.tsx
  - [ ] 3.1.2 Fetch existing article data
  - [ ] 3.1.3 Pre-fill form with existing data
  - [ ] 3.1.4 Reuse form component from create page
  - [ ] 3.1.5 Handle form submission to update endpoint
  
- [ ] 3.2 Create update article API
  - [ ] 3.2.1 Create PUT /api/articles/[slug]/route.ts
  - [ ] 3.2.2 Add authentication check
  - [ ] 3.2.3 Add admin role check
  - [ ] 3.2.4 Validate input data
  - [ ] 3.2.5 Update article record
  - [ ] 3.2.6 Handle question updates (update/create/delete)
  - [ ] 3.2.7 Revalidate sitemap and article page
  - [ ] 3.2.8 Return updated article data
  
- [ ] 3.3 Add edit button to dashboard
  - [ ] 3.3.1 Add edit action button in article table
  - [ ] 3.3.2 Link to edit page with slug parameter
  - [ ] 3.3.3 Add edit icon and tooltip

### 4. Delete Article Feature

- [ ] 4.1 Update database schema for soft delete
  - [ ] 4.1.1 Add deleted_at column to articles table
  - [ ] 4.1.2 Create index on deleted_at column
  - [ ] 4.1.3 Update TypeScript types
  
- [ ] 4.2 Create delete article API
  - [ ] 4.2.1 Create DELETE /api/articles/[slug]/route.ts
  - [ ] 4.2.2 Add authentication check
  - [ ] 4.2.3 Add admin role check
  - [ ] 4.2.4 Implement soft delete (set deleted_at)
  - [ ] 4.2.5 Revalidate sitemap
  - [ ] 4.2.6 Return success response
  
- [ ] 4.3 Add delete functionality to dashboard
  - [ ] 4.3.1 Create delete confirmation modal component
  - [ ] 4.3.2 Add delete button in article table
  - [ ] 4.3.3 Handle delete API call
  - [ ] 4.3.4 Refresh table after deletion
  - [ ] 4.3.5 Show success/error toast notification
  
- [ ] 4.4 Update queries to exclude deleted articles
  - [ ] 4.4.1 Add deleted_at IS NULL filter to public queries
  - [ ] 4.4.2 Update sitemap query
  - [ ] 4.4.3 Update article listing query
  - [ ] 4.4.4 Update article detail query

### 5. Audit Logging

- [ ] 5.1 Create audit logs table
  - [ ] 5.1.1 Create audit_logs table schema
  - [ ] 5.1.2 Add indexes for queries
  - [ ] 5.1.3 Create RLS policies
  - [ ] 5.1.4 Update TypeScript types
  
- [ ] 5.2 Implement audit logging
  - [ ] 5.2.1 Create audit log utility function
  - [ ] 5.2.2 Add logging to create article endpoint
  - [ ] 5.2.3 Add logging to update article endpoint
  - [ ] 5.2.4 Add logging to delete article endpoint
  - [ ] 5.2.5 Store old and new values in JSONB

---

## Phase 3: Content Enhancement (Week 4-5)

### 6. Featured Images

- [ ] 6.1 Update database schema
  - [ ] 6.1.1 Add featured_image column to articles table
  - [ ] 6.1.2 Add image_alt column to articles table
  - [ ] 6.1.3 Update TypeScript types
  
- [ ] 6.2 Setup Supabase Storage
  - [ ] 6.2.1 Create articles-images bucket
  - [ ] 6.2.2 Configure storage policies (public read, admin write)
  - [ ] 6.2.3 Create folder structure (featured/, thumbnails/)
  
- [ ] 6.3 Create image upload component
  - [ ] 6.3.1 Create ImageUpload.tsx component
  - [ ] 6.3.2 Add drag and drop functionality
  - [ ] 6.3.3 Add image preview
  - [ ] 6.3.4 Add client-side validation (size, format)
  - [ ] 6.3.5 Add progress indicator
  - [ ] 6.3.6 Add alt text input field
  
- [ ] 6.4 Integrate image upload in forms
  - [ ] 6.4.1 Add image upload to create article form
  - [ ] 6.4.2 Add image upload to edit article form
  - [ ] 6.4.3 Handle image upload to Supabase Storage
  - [ ] 6.4.4 Save image URL to database
  
- [ ] 6.5 Display images on article pages
  - [ ] 6.5.1 Add featured image to article detail page
  - [ ] 6.5.2 Use Next.js Image component for optimization
  - [ ] 6.5.3 Add lazy loading
  - [ ] 6.5.4 Add image to Open Graph meta tags
  - [ ] 6.5.5 Add image to Twitter Card meta tags
  
- [ ] 6.6 Display images on article listing
  - [ ] 6.6.1 Add thumbnail to article cards
  - [ ] 6.6.2 Add fallback image for articles without images
  - [ ] 6.6.3 Optimize image loading with blur placeholder

### 7. Categories System

- [ ] 7.1 Create database schema
  - [ ] 7.1.1 Create categories table
  - [ ] 7.1.2 Create article_categories junction table
  - [ ] 7.1.3 Add indexes
  - [ ] 7.1.4 Create RLS policies
  - [ ] 7.1.5 Update TypeScript types
  
- [ ] 7.2 Create category management APIs
  - [ ] 7.2.1 Create GET /api/categories endpoint
  - [ ] 7.2.2 Create POST /api/categories endpoint
  - [ ] 7.2.3 Create PUT /api/categories/[id] endpoint
  - [ ] 7.2.4 Create DELETE /api/categories/[id] endpoint
  - [ ] 7.2.5 Add authentication and authorization checks
  
- [ ] 7.3 Create category selection component
  - [ ] 7.3.1 Create CategorySelect.tsx component
  - [ ] 7.3.2 Add multi-select dropdown
  - [ ] 7.3.3 Add search functionality
  - [ ] 7.3.4 Add create new category inline
  - [ ] 7.3.5 Display selected categories as tags
  
- [ ] 7.4 Integrate categories in article forms
  - [ ] 7.4.1 Add category selection to create form
  - [ ] 7.4.2 Add category selection to edit form
  - [ ] 7.4.3 Save category associations to database
  - [ ] 7.4.4 Load existing categories on edit
  
- [ ] 7.5 Create category pages
  - [ ] 7.5.1 Create /aeo/category/[slug]/page.tsx
  - [ ] 7.5.2 Fetch articles by category
  - [ ] 7.5.3 Add SEO meta tags
  - [ ] 7.5.4 Add JSON-LD schema
  - [ ] 7.5.5 Add breadcrumb navigation
  - [ ] 7.5.6 Add pagination
  
- [ ] 7.6 Add category filter to article listing
  - [ ] 7.6.1 Add category filter dropdown
  - [ ] 7.6.2 Filter articles by selected category
  - [ ] 7.6.3 Update URL with category parameter
  - [ ] 7.6.4 Show active category in UI
  
- [ ] 7.7 Update sitemap with category pages
  - [ ] 7.7.1 Add category pages to sitemap
  - [ ] 7.7.2 Set appropriate priority and change frequency

### 8. Search Functionality

- [ ] 8.1 Create search API
  - [ ] 8.1.1 Create GET /api/articles/search endpoint
  - [ ] 8.1.2 Implement full-text search query
  - [ ] 8.1.3 Search across keyword, summary, questions
  - [ ] 8.1.4 Add pagination
  - [ ] 8.1.5 Add relevance sorting
  
- [ ] 8.2 Create search UI component
  - [ ] 8.2.1 Create ArticleSearch.tsx component
  - [ ] 8.2.2 Add search input with debouncing
  - [ ] 8.2.3 Display search results
  - [ ] 8.2.4 Add keyboard navigation
  - [ ] 8.2.5 Highlight matching text
  - [ ] 8.2.6 Add "No results" state
  - [ ] 8.2.7 Add loading state
  
- [ ] 8.3 Integrate search in article listing page
  - [ ] 8.3.1 Add search bar to /aeo page
  - [ ] 8.3.2 Handle search query parameter
  - [ ] 8.3.3 Display search results
  - [ ] 8.3.4 Add clear search button
  
- [ ] 8.4 Add search analytics
  - [ ] 8.4.1 Track search queries
  - [ ] 8.4.2 Track search result clicks
  - [ ] 8.4.3 Store in database or analytics service

---

## Phase 4: SEO & Social (Week 6)

### 9. Social Sharing

- [ ] 9.1 Create share buttons component
  - [ ] 9.1.1 Create ShareButtons.tsx component
  - [ ] 9.1.2 Add Twitter/X share button
  - [ ] 9.1.3 Add LinkedIn share button
  - [ ] 9.1.4 Add WhatsApp share button
  - [ ] 9.1.5 Add Facebook share button
  - [ ] 9.1.6 Add copy link button
  - [ ] 9.1.7 Add share icons
  
- [ ] 9.2 Integrate share buttons in article page
  - [ ] 9.2.1 Add share buttons to article detail page
  - [ ] 9.2.2 Position buttons appropriately
  - [ ] 9.2.3 Make buttons sticky on scroll (optional)
  - [ ] 9.2.4 Add mobile-friendly layout
  
- [ ] 9.3 Enhance Open Graph tags
  - [ ] 9.3.1 Add OG image (featured image or generated)
  - [ ] 9.3.2 Add OG title
  - [ ] 9.3.3 Add OG description
  - [ ] 9.3.4 Add OG type (article)
  - [ ] 9.3.5 Add OG site name
  
- [ ] 9.4 Enhance Twitter Card tags
  - [ ] 9.4.1 Add Twitter Card type (summary_large_image)
  - [ ] 9.4.2 Add Twitter image
  - [ ] 9.4.3 Add Twitter title
  - [ ] 9.4.4 Add Twitter description

### 10. Related Articles

- [ ] 10.1 Create related articles algorithm
  - [ ] 10.1.1 Create utility function to find related articles
  - [ ] 10.1.2 Match by category
  - [ ] 10.1.3 Match by keywords
  - [ ] 10.1.4 Exclude current article
  - [ ] 10.1.5 Limit to 3-5 results
  
- [ ] 10.2 Create related articles component
  - [ ] 10.2.1 Create RelatedArticles.tsx component
  - [ ] 10.2.2 Display article cards
  - [ ] 10.2.3 Show thumbnail, title, summary
  - [ ] 10.2.4 Add responsive grid layout
  
- [ ] 10.3 Integrate in article page
  - [ ] 10.3.1 Add related articles section at bottom
  - [ ] 10.3.2 Fetch related articles server-side
  - [ ] 10.3.3 Add section heading
  - [ ] 10.3.4 Track clicks on related articles

### 11. RSS Feed

- [ ] 11.1 Create RSS feed endpoint
  - [ ] 11.1.1 Create /aeo/feed.xml/route.ts
  - [ ] 11.1.2 Fetch last 20 published articles
  - [ ] 11.1.3 Generate RSS 2.0 XML
  - [ ] 11.1.4 Include full content
  - [ ] 11.1.5 Set proper content type header
  
- [ ] 11.2 Add RSS auto-discovery
  - [ ] 11.2.1 Add RSS link tag in HTML head
  - [ ] 11.2.2 Add RSS icon in footer
  - [ ] 11.2.3 Link to feed URL

---

## Phase 5: Analytics & Monitoring (Week 7)

### 12. Analytics Dashboard

- [ ] 12.1 Create analytics API
  - [ ] 12.1.1 Create GET /api/admin/analytics endpoint
  - [ ] 12.1.2 Calculate total articles
  - [ ] 12.1.3 Calculate total views
  - [ ] 12.1.4 Calculate articles created this month
  - [ ] 12.1.5 Get top 10 articles by views
  - [ ] 12.1.6 Get recent articles
  - [ ] 12.1.7 Add authentication check
  
- [ ] 12.2 Create analytics dashboard page
  - [ ] 12.2.1 Create /admin/aeo/analytics/page.tsx
  - [ ] 12.2.2 Display key metrics cards
  - [ ] 12.2.3 Display top articles table
  - [ ] 12.2.4 Display recent articles list
  - [ ] 12.2.5 Add date range filter
  - [ ] 12.2.6 Add export to CSV button
  
- [ ] 12.3 Enhance article view tracking
  - [ ] 12.3.1 Track time on page
  - [ ] 12.3.2 Track scroll depth
  - [ ] 12.3.3 Track CTA clicks
  - [ ] 12.3.4 Send to Google Analytics 4

### 13. Error Monitoring

- [ ] 13.1 Setup Sentry
  - [ ] 13.1.1 Install @sentry/nextjs package
  - [ ] 13.1.2 Create Sentry account and project
  - [ ] 13.1.3 Configure sentry.client.config.ts
  - [ ] 13.1.4 Configure sentry.server.config.ts
  - [ ] 13.1.5 Add SENTRY_DSN to environment variables
  
- [ ] 13.2 Add error boundaries
  - [ ] 13.2.1 Enhance existing ErrorBoundary component
  - [ ] 13.2.2 Add error boundaries to admin pages
  - [ ] 13.2.3 Add error boundaries to public pages
  - [ ] 13.2.4 Add fallback UI for errors
  
- [ ] 13.3 Add API error logging
  - [ ] 13.3.1 Log errors in API routes
  - [ ] 13.3.2 Include request context
  - [ ] 13.3.3 Include user context
  - [ ] 13.3.4 Set up error alerts
  
- [ ] 13.4 Add database error logging
  - [ ] 13.4.1 Log Supabase errors
  - [ ] 13.4.2 Include query context
  - [ ] 13.4.3 Set up critical error alerts

---

## Testing Tasks

### 14. Unit Tests

- [ ] 14.1 Write tests for utility functions
  - [ ] 14.1.1 Test slug validation
  - [ ] 14.1.2 Test slug generation
  - [ ] 14.1.3 Test text sanitization
  - [ ] 14.1.4 Test meta tag generation
  
- [ ] 14.2 Write tests for API endpoints
  - [ ] 14.2.1 Test article creation
  - [ ] 14.2.2 Test article update
  - [ ] 14.2.3 Test article deletion
  - [ ] 14.2.4 Test authentication checks
  - [ ] 14.2.5 Test authorization checks

### 15. Integration Tests

- [ ] 15.1 Test article CRUD flow
  - [ ] 15.1.1 Test create article end-to-end
  - [ ] 15.1.2 Test edit article end-to-end
  - [ ] 15.1.3 Test delete article end-to-end
  
- [ ] 15.2 Test authentication flow
  - [ ] 15.2.1 Test admin login
  - [ ] 15.2.2 Test unauthorized access
  - [ ] 15.2.3 Test role-based access
  
- [ ] 15.3 Test image upload flow
  - [ ] 15.3.1 Test image upload to storage
  - [ ] 15.3.2 Test image URL save to database
  - [ ] 15.3.3 Test image display on page

### 16. E2E Tests

- [ ] 16.1 Setup Playwright
  - [ ] 16.1.1 Install Playwright
  - [ ] 16.1.2 Configure playwright.config.ts
  - [ ] 16.1.3 Create test fixtures
  
- [ ] 16.2 Write E2E tests
  - [ ] 16.2.1 Test admin login and create article
  - [ ] 16.2.2 Test edit existing article
  - [ ] 16.2.3 Test delete article
  - [ ] 16.2.4 Test search articles
  - [ ] 16.2.5 Test share article

---

## Documentation Tasks

### 17. Technical Documentation

- [ ] 17.1 Update README
  - [ ] 17.1.1 Add new features section
  - [ ] 17.1.2 Update installation instructions
  - [ ] 17.1.3 Add admin setup instructions
  - [ ] 17.1.4 Add troubleshooting section
  
- [ ] 17.2 Create API documentation
  - [ ] 17.2.1 Document all API endpoints
  - [ ] 17.2.2 Add request/response examples
  - [ ] 17.2.3 Document authentication
  - [ ] 17.2.4 Document error codes
  
- [ ] 17.3 Create deployment guide
  - [ ] 17.3.1 Document environment setup
  - [ ] 17.3.2 Document database migrations
  - [ ] 17.3.3 Document Vercel deployment
  - [ ] 17.3.4 Document rollback procedures

### 18. User Documentation

- [ ] 18.1 Create admin user guide
  - [ ] 18.1.1 Document how to create articles
  - [ ] 18.1.2 Document how to edit articles
  - [ ] 18.1.3 Document how to delete articles
  - [ ] 18.1.4 Document how to manage categories
  - [ ] 18.1.5 Document how to upload images
  
- [ ] 18.2 Create content guidelines
  - [ ] 18.2.1 SEO best practices
  - [ ] 18.2.2 Writing style guide
  - [ ] 18.2.3 Image guidelines
  - [ ] 18.2.4 Category usage guide

---

## Deployment Tasks

### 19. Database Migrations

- [ ] 19.1 Prepare migration scripts
  - [ ] 19.1.1 Create migration for user roles
  - [ ] 19.1.2 Create migration for article images
  - [ ] 19.1.3 Create migration for soft delete
  - [ ] 19.1.4 Create migration for categories
  - [ ] 19.1.5 Create migration for audit logs
  
- [ ] 19.2 Test migrations
  - [ ] 19.2.1 Test on local database
  - [ ] 19.2.2 Test on staging database
  - [ ] 19.2.3 Prepare rollback scripts
  
- [ ] 19.3 Apply to production
  - [ ] 19.3.1 Backup production database
  - [ ] 19.3.2 Apply migrations
  - [ ] 19.3.3 Verify data integrity
  - [ ] 19.3.4 Update application code

### 20. Production Deployment

- [ ] 20.1 Pre-deployment checklist
  - [ ] 20.1.1 All tests passing
  - [ ] 20.1.2 Code review completed
  - [ ] 20.1.3 Documentation updated
  - [ ] 20.1.4 Environment variables set
  
- [ ] 20.2 Deploy to production
  - [ ] 20.2.1 Merge to main branch
  - [ ] 20.2.2 Verify Vercel deployment
  - [ ] 20.2.3 Run smoke tests
  - [ ] 20.2.4 Monitor for errors
  
- [ ] 20.3 Post-deployment tasks
  - [ ] 20.3.1 Create admin user
  - [ ] 20.3.2 Test admin access
  - [ ] 20.3.3 Verify sitemap updating
  - [ ] 20.3.4 Submit sitemap to Google

---

**Total Tasks**: 200+  
**Estimated Duration**: 7 weeks  
**Priority**: Phase 1 (Critical) → Phase 2 (High) → Phase 3-5 (Medium)

**Next Steps**:
1. Review and approve requirements and design
2. Start with Phase 1 (Security & Critical Fixes)
3. Complete each phase before moving to next
4. Test thoroughly at each phase
5. Deploy incrementally to production
