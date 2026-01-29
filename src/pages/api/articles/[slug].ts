import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { GetArticleResponse } from '@/types/article';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// =====================================================
// Pages Router API Handler - Get Article by Slug
// =====================================================

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            success: false,
            error: `Method ${req.method} Not Allowed`,
        });
    }

    try {
        const { slug } = req.query;

        if (!slug || typeof slug !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Slug parameter is required',
            } as GetArticleResponse);
        }

        // Fetch article
        const { data: article, error: articleError } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (articleError || !article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found',
            } as GetArticleResponse);
        }

        // Fetch questions for this article
        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('*')
            .eq('article_id', article.id)
            .order('position', { ascending: true });

        if (questionsError) {
            console.error('Error fetching questions:', questionsError);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch article questions',
            } as GetArticleResponse);
        }

        // Increment view count (fire and forget)
        supabase.rpc('increment_article_views', { article_slug: slug }).then();

        // Return article with questions
        return res.status(200).json({
            success: true,
            data: {
                ...article,
                questions: questions || [],
            },
        } as GetArticleResponse);
    } catch (error) {
        console.error('Unexpected error in GET /api/articles/[slug]:', error);

        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        } as GetArticleResponse);
    }
}
