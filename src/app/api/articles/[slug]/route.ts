import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import type { GetArticleResponse } from '@/types/article';

// =====================================================
// GET /api/articles/[slug] - Get Article by Slug
// =====================================================

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Slug parameter is required',
                } as GetArticleResponse,
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Fetch article
        const { data: article, error: articleError } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (articleError || !article) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Article not found',
                } as GetArticleResponse,
                { status: 404 }
            );
        }

        // Fetch questions for this article
        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('*')
            .eq('article_id', article.id)
            .order('position', { ascending: true });

        if (questionsError) {
            console.error('Error fetching questions:', questionsError);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to fetch article questions',
                } as GetArticleResponse,
                { status: 500 }
            );
        }

        // Increment view count (fire and forget)
        supabase.rpc('increment_article_views', { article_slug: slug }).then();

        // Return article with questions
        const response: GetArticleResponse = {
            success: true,
            data: {
                ...article,
                questions: questions || [],
            },
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Unexpected error in GET /api/articles/[slug]:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            } as GetArticleResponse,
            { status: 500 }
        );
    }
}
