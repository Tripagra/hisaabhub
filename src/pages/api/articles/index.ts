import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { CreateArticleRequest, CreateArticleResponse } from '@/types/article';
import { articleValidation, sanitizeText } from '@/utils/schema';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// =====================================================
// Pages Router API Handler
// =====================================================

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Handle POST - Create Article
    if (req.method === 'POST') {
        try {
            const body: CreateArticleRequest = req.body;

            // Validate required fields
            if (!body.slug || !body.keyword || !body.summary || !body.questions) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: slug, keyword, summary, questions',
                } as CreateArticleResponse);
            }

            // Validate slug format
            if (!articleValidation.slug.pattern.test(body.slug)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.',
                } as CreateArticleResponse);
            }

            // Validate questions array
            if (!Array.isArray(body.questions) || body.questions.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'At least one question is required',
                } as CreateArticleResponse);
            }

            // Check if slug already exists
            const { data: existingArticle } = await supabase
                .from('articles')
                .select('id')
                .eq('slug', body.slug)
                .single();

            if (existingArticle) {
                return res.status(409).json({
                    success: false,
                    error: 'An article with this slug already exists',
                } as CreateArticleResponse);
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
                return res.status(500).json({
                    success: false,
                    error: articleError?.message || 'Failed to create article',
                } as CreateArticleResponse);
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

                return res.status(500).json({
                    success: false,
                    error: questionsError?.message || 'Failed to create questions',
                } as CreateArticleResponse);
            }

            // Return success response
            return res.status(201).json({
                success: true,
                data: {
                    ...article,
                    questions: questions.sort((a, b) => a.position - b.position),
                },
            } as CreateArticleResponse);
        } catch (error) {
            console.error('Unexpected error in POST /api/articles:', error);

            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            } as CreateArticleResponse);
        }
    }

    // Handle GET - List All Articles
    else if (req.method === 'GET') {
        try {
            const { data: articles, error } = await supabase
                .from('articles')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching articles:', error);
                return res.status(500).json({
                    success: false,
                    error: error.message,
                });
            }

            return res.status(200).json({
                success: true,
                data: articles || [],
            });
        } catch (error) {
            console.error('Unexpected error in GET /api/articles:', error);

            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            });
        }
    }

    // Method not allowed
    else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
            success: false,
            error: `Method ${req.method} Not Allowed`,
        });
    }
}
