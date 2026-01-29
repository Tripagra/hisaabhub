import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import type { CreateArticleRequest, CreateArticleResponse } from '@/types/article';
import { articleValidation, sanitizeText } from '@/utils/schema';

// =====================================================
// POST /api/articles - Create Article with Questions
// =====================================================

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body: CreateArticleRequest = await request.json();

        // Validate required fields
        if (!body.slug || !body.keyword || !body.summary || !body.questions) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: slug, keyword, summary, questions',
                } as CreateArticleResponse,
                { status: 400 }
            );
        }

        // Validate slug format
        if (!articleValidation.slug.pattern.test(body.slug)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.',
                } as CreateArticleResponse,
                { status: 400 }
            );
        }

        // Validate slug length
        if (
            body.slug.length < articleValidation.slug.minLength ||
            body.slug.length > articleValidation.slug.maxLength
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Slug must be between ${articleValidation.slug.minLength} and ${articleValidation.slug.maxLength} characters`,
                } as CreateArticleResponse,
                { status: 400 }
            );
        }

        // Validate keyword length
        if (
            body.keyword.length < articleValidation.keyword.minLength ||
            body.keyword.length > articleValidation.keyword.maxLength
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Keyword must be between ${articleValidation.keyword.minLength} and ${articleValidation.keyword.maxLength} characters`,
                } as CreateArticleResponse,
                { status: 400 }
            );
        }

        // Validate summary length
        if (
            body.summary.length < articleValidation.summary.minLength ||
            body.summary.length > articleValidation.summary.maxLength
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Summary must be between ${articleValidation.summary.minLength} and ${articleValidation.summary.maxLength} characters`,
                } as CreateArticleResponse,
                { status: 400 }
            );
        }

        // Validate questions array
        if (!Array.isArray(body.questions) || body.questions.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'At least one question is required',
                } as CreateArticleResponse,
                { status: 400 }
            );
        }

        if (body.questions.length > articleValidation.questions.maxCount) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Maximum ${articleValidation.questions.maxCount} questions allowed`,
                } as CreateArticleResponse,
                { status: 400 }
            );
        }

        // Validate each question
        for (let i = 0; i < body.questions.length; i++) {
            const q = body.questions[i];

            if (!q.question_text || !q.answer_text) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Question ${i + 1}: Both question_text and answer_text are required`,
                    } as CreateArticleResponse,
                    { status: 400 }
                );
            }

            if (
                q.question_text.length < articleValidation.questionText.minLength ||
                q.question_text.length > articleValidation.questionText.maxLength
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Question ${i + 1}: Question text must be between ${articleValidation.questionText.minLength} and ${articleValidation.questionText.maxLength} characters`,
                    } as CreateArticleResponse,
                    { status: 400 }
                );
            }

            if (
                q.answer_text.length < articleValidation.answerText.minLength ||
                q.answer_text.length > articleValidation.answerText.maxLength
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Question ${i + 1}: Answer text must be between ${articleValidation.answerText.minLength} and ${articleValidation.answerText.maxLength} characters`,
                    } as CreateArticleResponse,
                    { status: 400 }
                );
            }
        }

        // Create Supabase client
        const supabase = await createServerSupabaseClient();

        // Check if slug already exists
        const { data: existingArticle } = await supabase
            .from('articles')
            .select('id')
            .eq('slug', body.slug)
            .single();

        if (existingArticle) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'An article with this slug already exists',
                } as CreateArticleResponse,
                { status: 409 }
            );
        }

        // Sanitize inputs
        const sanitizedSlug = sanitizeText(body.slug.toLowerCase());
        const sanitizedKeyword = sanitizeText(body.keyword);
        const sanitizedSummary = sanitizeText(body.summary);

        // Insert article
        const { data: article, error: articleError } = await supabase
            .from('articles')
            .insert({
                slug: sanitizedSlug,
                keyword: sanitizedKeyword,
                summary: sanitizedSummary,
                published: true,
            })
            .select()
            .single();

        if (articleError || !article) {
            console.error('Article creation error:', articleError);
            return NextResponse.json(
                {
                    success: false,
                    error: articleError?.message || 'Failed to create article',
                } as CreateArticleResponse,
                { status: 500 }
            );
        }

        // Insert questions
        const questionsToInsert = body.questions.map((q, index) => ({
            article_id: article.id,
            question_text: sanitizeText(q.question_text),
            answer_text: sanitizeText(q.answer_text),
            position: index + 1,
        }));

        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .insert(questionsToInsert)
            .select();

        if (questionsError || !questions) {
            console.error('Questions creation error:', questionsError);

            // Rollback: Delete the article if questions failed
            await supabase.from('articles').delete().eq('id', article.id);

            return NextResponse.json(
                {
                    success: false,
                    error: questionsError?.message || 'Failed to create questions',
                } as CreateArticleResponse,
                { status: 500 }
            );
        }

        // Return success response
        const response: CreateArticleResponse = {
            success: true,
            data: {
                ...article,
                questions: questions.sort((a, b) => a.position - b.position),
            },
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('Unexpected error in POST /api/articles:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            } as CreateArticleResponse,
            { status: 500 }
        );
    }
}

// =====================================================
// GET /api/articles - List All Articles
// =====================================================

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        const { data: articles, error } = await supabase
            .from('articles')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: articles || [],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Unexpected error in GET /api/articles:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
