# Immediate Implementation - Categories & Sitemap Updates

**Priority**: 🔴 HIGH  
**Time to Implement**: 2-3 hours  
**Status**: Ready to implement

---

## What You Asked For

1. ✅ **Articles should have categories** (Finance, Business, News)
2. ✅ **Sitemap should update when articles are edited**

---

## Current Status

### ✅ Already Working
- Sitemap updates when you **create** articles (instant revalidation)
- Sitemap uses `updated_at` field (shows correct last modified date)

### ⚠️ Missing
- No category field in articles table
- No UPDATE endpoint for articles (can't edit yet)
- Sitemap doesn't revalidate when articles are edited (because no edit endpoint exists)

---

## Quick Implementation (2-3 hours)

### Step 1: Add Category to Database (10 minutes)

**Run this SQL in Supabase SQL Editor**:

```sql
-- Add category column to articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'News';

-- Add check constraint for valid categories
ALTER TABLE public.articles
ADD CONSTRAINT valid_category 
CHECK (category IN ('Finance', 'Business', 'News', 'Tax', 'GST', 'General'));

-- Create index for category queries
CREATE INDEX IF NOT EXISTS idx_articles_category 
ON public.articles(category);

-- Update existing articles to have a default category
UPDATE public.articles 
SET category = 'Finance' 
WHERE category IS NULL;

-- Verify
SELECT id, keyword, category, created_at 
FROM public.articles 
LIMIT 5;
```

---

### Step 2: Update TypeScript Types (5 minutes)

**File**: `src/types/database.ts`

Add `category` field to articles table:

```typescript
articles: {
  Row: {
    id: string;
    slug: string;
    keyword: string;
    summary: string;
    category: string;  // ← ADD THIS
    created_at: string;
    updated_at: string;
    published: boolean;
    views: number;
  };
  Insert: {
    id?: string;
    slug: string;
    keyword: string;
    summary: string;
    category?: string;  // ← ADD THIS (optional, defaults to 'News')
    created_at?: string;
    updated_at?: string;
    published?: boolean;
    views?: number;
  };
  Update: {
    id?: string;
    slug?: string;
    keyword?: string;
    summary?: string;
    category?: string;  // ← ADD THIS
    created_at?: string;
    updated_at?: string;
    published?: boolean;
    views?: number;
  };
};
```

**File**: `src/types/article.ts`

Add `category` to Article interface:

```typescript
export interface Article {
    id: string;
    slug: string;
    keyword: string;
    summary: string;
    category: string;  // ← ADD THIS
    created_at: string;
    updated_at: string;
    published: boolean;
    views: number;
}
```

---

### Step 3: Update Create Article Form (15 minutes)

**File**: `src/app/admin/aeo/new/page.tsx`

Add category selection to the form:

```typescript
// Add to state (around line 30)
const [category, setCategory] = useState<string>('Finance');

// Add category field in the form (after summary field, around line 250)
{/* Category Field */}
<div className="bg-dark-surface/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
    <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-300 mb-2"
    >
        Category *
    </label>
    <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input w-full"
        required
        disabled={isSubmitting}
    >
        <option value="Finance">Finance</option>
        <option value="Business">Business</option>
        <option value="News">News</option>
        <option value="Tax">Tax</option>
        <option value="GST">GST</option>
        <option value="General">General</option>
    </select>
    <p className="mt-2 text-xs text-gray-500">
        Select the primary category for this article
    </p>
</div>

// Update payload in handleSubmit (around line 150)
const payload: CreateArticleRequest = {
    slug: slug.trim(),
    keyword: keyword.trim(),
    summary: summary.trim(),
    category: category,  // ← ADD THIS
    questions: validQuestions,
};
```

---

### Step 4: Update Create Article API (10 minutes)

**File**: `src/app/api/articles/route.ts`

Update the POST endpoint to accept category:

```typescript
// Around line 15, update CreateArticleRequest type check
if (!body.slug || !body.keyword || !body.summary || !body.questions) {
    return NextResponse.json(
        {
            success: false,
            error: 'Missing required fields: slug, keyword, summary, questions',
        } as CreateArticleResponse,
        { status: 400 }
    );
}

// Around line 130, add category to sanitization
const sanitizedSlug = sanitizeText(body.slug.toLowerCase());
const sanitizedKeyword = sanitizeText(body.keyword);
const sanitizedSummary = sanitizeText(body.summary);
const sanitizedCategory = body.category || 'News';  // ← ADD THIS

// Around line 135, add category to insert
const { data: article, error: articleError } = await supabase
    .from('articles')
    .insert({
        slug: sanitizedSlug,
        keyword: sanitizedKeyword,
        summary: sanitizedSummary,
        category: sanitizedCategory,  // ← ADD THIS
        published: true,
    })
    .select()
    .single();
```

**File**: `src/types/article.ts`

Update CreateArticleRequest:

```typescript
export interface CreateArticleRequest {
    slug: string;
    keyword: string;
    summary: string;
    category?: string;  // ← ADD THIS
    questions: {
        question_text: string;
        answer_text: string;
    }[];
}
```

---

### Step 5: Create Update Article Endpoint (30 minutes)

**File**: `src/app/api/articles/[slug]/route.ts`

Add PUT endpoint to the existing file:

```typescript
import { revalidatePath } from 'next/cache';

// Add this after the GET endpoint

// =====================================================
// PUT /api/articles/[slug] - Update Article
// =====================================================

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();

        // Validate required fields
        if (!body.keyword || !body.summary || !body.questions) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: keyword, summary, questions',
                },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Get existing article
        const { data: existingArticle, error: fetchError } = await supabase
            .from('articles')
            .select('id')
            .eq('slug', slug)
            .single();

        if (fetchError || !existingArticle) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Article not found',
                },
                { status: 404 }
            );
        }

        // Update article
        const { data: article, error: updateError } = await supabase
            .from('articles')
            .update({
                keyword: body.keyword,
                summary: body.summary,
                category: body.category || 'News',
                published: body.published !== undefined ? body.published : true,
            })
            .eq('id', existingArticle.id)
            .select()
            .single();

        if (updateError || !article) {
            return NextResponse.json(
                {
                    success: false,
                    error: updateError?.message || 'Failed to update article',
                },
                { status: 500 }
            );
        }

        // Handle questions: delete all and recreate
        // (Simple approach - can be optimized later)
        await supabase
            .from('questions')
            .delete()
            .eq('article_id', article.id);

        // Insert new questions
        const questionsToInsert = body.questions.map((q: any, index: number) => ({
            article_id: article.id,
            question_text: q.question_text,
            answer_text: q.answer_text,
            position: index + 1,
        }));

        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .insert(questionsToInsert)
            .select();

        if (questionsError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to update questions',
                },
                { status: 500 }
            );
        }

        // ✅ REVALIDATE SITEMAP AND ARTICLE PAGE
        revalidatePath('/sitemap.xml');
        revalidatePath('/aeo');
        revalidatePath(`/aeo/${slug}`);

        return NextResponse.json(
            {
                success: true,
                data: {
                    ...article,
                    questions: questions || [],
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
```

---

### Step 6: Create Edit Article Page (45 minutes)

**File**: `src/app/admin/aeo/edit/[slug]/page.tsx`

Create new file:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateSlug, validateSlug } from '@/utils/schema';

interface QuestionInput {
    question_text: string;
    answer_text: string;
}

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [slug, setSlug] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [keyword, setKeyword] = useState('');
    const [summary, setSummary] = useState('');
    const [category, setCategory] = useState('Finance');
    const [questions, setQuestions] = useState<QuestionInput[]>([]);

    // Load article data
    useEffect(() => {
        async function loadArticle() {
            const { slug: articleSlug } = await params;
            setSlug(articleSlug);

            try {
                const response = await fetch(`/api/articles/${articleSlug}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setKeyword(data.data.keyword);
                    setSummary(data.data.summary);
                    setCategory(data.data.category || 'Finance');
                    setQuestions(
                        data.data.questions.map((q: any) => ({
                            question_text: q.question_text,
                            answer_text: q.answer_text,
                        }))
                    );
                } else {
                    setError('Failed to load article');
                }
            } catch (err) {
                setError('Failed to load article');
            } finally {
                setIsLoading(false);
            }
        }

        loadArticle();
    }, [params]);

    // Handle question changes
    const handleQuestionChange = (
        index: number,
        field: 'question_text' | 'answer_text',
        value: string
    ) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    // Add question
    const addQuestion = () => {
        if (questions.length < 20) {
            setQuestions([...questions, { question_text: '', answer_text: '' }]);
        }
    };

    // Remove question
    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const validQuestions = questions.filter(
            (q) => q.question_text.trim() && q.answer_text.trim()
        );

        if (validQuestions.length === 0) {
            setError('At least one question is required');
            return;
        }

        const payload = {
            keyword: keyword.trim(),
            summary: summary.trim(),
            category: category,
            questions: validQuestions,
        };

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/articles/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to update article');
            }

            setSuccess(true);
            setError(null);

            setTimeout(() => {
                router.push(`/aeo/${slug}`);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading article...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Edit Article
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Update article details and questions
                    </p>
                </header>

                {success && (
                    <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                        <p className="text-green-400">
                            Article updated successfully! Redirecting...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Keyword */}
                    <div className="bg-dark-surface/50 border border-gray-800 rounded-lg p-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Article Title *
                        </label>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="input w-full"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Category */}
                    <div className="bg-dark-surface/50 border border-gray-800 rounded-lg p-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category *
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input w-full"
                            required
                            disabled={isSubmitting}
                        >
                            <option value="Finance">Finance</option>
                            <option value="Business">Business</option>
                            <option value="News">News</option>
                            <option value="Tax">Tax</option>
                            <option value="GST">GST</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    {/* Summary */}
                    <div className="bg-dark-surface/50 border border-gray-800 rounded-lg p-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Summary *
                        </label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="input w-full min-h-[100px]"
                            required
                            disabled={isSubmitting}
                            maxLength={500}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            {summary.length}/500
                        </p>
                    </div>

                    {/* Questions */}
                    <div className="bg-dark-surface/50 border border-gray-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">
                                Questions & Answers
                            </h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                disabled={questions.length >= 20 || isSubmitting}
                                className="btn-primary text-sm"
                            >
                                + Add Question
                            </button>
                        </div>

                        <div className="space-y-6">
                            {questions.map((q, index) => (
                                <div key={index} className="bg-dark-highlight border border-gray-700 rounded-lg p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-primary">
                                            Question {index + 1}
                                        </h3>
                                        {questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(index)}
                                                disabled={isSubmitting}
                                                className="text-red-400 hover:text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Question Text *
                                            </label>
                                            <input
                                                type="text"
                                                value={q.question_text}
                                                onChange={(e) =>
                                                    handleQuestionChange(index, 'question_text', e.target.value)
                                                }
                                                className="input w-full"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Answer Text *
                                            </label>
                                            <textarea
                                                value={q.answer_text}
                                                onChange={(e) =>
                                                    handleQuestionChange(index, 'answer_text', e.target.value)
                                                }
                                                className="input w-full min-h-[120px]"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Article'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
```

---

### Step 7: Display Category on Article Pages (10 minutes)

**File**: `src/app/aeo/[slug]/page.tsx`

Add category display (around line 120, in the header section):

```typescript
<header className="mb-8 border-b border-gray-800 pb-8">
    {/* Add category badge */}
    <div className="mb-4">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {article.category || 'News'}
        </span>
    </div>
    
    <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-tight mb-4">
        {article.keyword}
    </h1>
    {/* ... rest of header ... */}
</header>
```

**File**: `src/app/aeo/page.tsx`

Add category to article cards (around line 80):

```typescript
<div className="flex items-center justify-between mb-4">
    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
        {article.category || 'Tax Update'}
    </span>
    {/* ... rest of badge section ... */}
</div>
```

---

## Testing (15 minutes)

### Test 1: Create Article with Category
1. Go to `/admin/aeo/new`
2. Fill in all fields
3. Select "Finance" category
4. Create article
5. ✅ Verify article shows "Finance" badge

### Test 2: Edit Article
1. Go to `/admin/aeo/edit/[your-article-slug]`
2. Change category to "Business"
3. Update some questions
4. Save
5. ✅ Verify changes saved
6. ✅ Check sitemap updated: `/sitemap.xml`

### Test 3: Sitemap Updates
1. Check sitemap before edit: `/sitemap.xml`
2. Note the `lastModified` date for your article
3. Edit the article
4. Check sitemap again
5. ✅ Verify `lastModified` date updated

---

## Summary

After implementing these steps, you'll have:

✅ **Category field** in articles (Finance, Business, News, Tax, GST, General)  
✅ **Category selection** in create form  
✅ **Category display** on article pages  
✅ **Edit article endpoint** (PUT /api/articles/[slug])  
✅ **Edit article page** (/admin/aeo/edit/[slug])  
✅ **Sitemap revalidation** on article updates  

**Total Time**: 2-3 hours  
**Files Modified**: 7 files  
**Files Created**: 2 files  

---

## Next Steps

After this quick implementation:

1. **Test thoroughly** - Create, edit, check sitemap
2. **Deploy to production** - Push changes to GitHub
3. **Continue with full plan** - Implement remaining phases from the spec

---

**Ready to implement?** Follow the steps above in order!
