import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabaseServer';
import type { ArticleWithQuestions } from '@/types/article';
import {
    generateFAQSchema,
    generateArticleSchema,
    generateBreadcrumbSchema,
    generateMetaTitle,
    generateMetaDescription,
} from '@/utils/schema';

// =====================================================
// Generate Metadata for SEO
// =====================================================

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: article } = await supabase
        .from('articles')
        .select('*, questions(*)')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (!article) {
        return {
            title: 'Article Not Found | HisaabHub',
            description: 'The requested article could not be found.',
        };
    }

    const articleWithQuestions: ArticleWithQuestions = {
        ...article,
        questions: article.questions || [],
    };

    return {
        title: generateMetaTitle(articleWithQuestions),
        description: generateMetaDescription(articleWithQuestions),
        keywords: [
            article.keyword,
            'GST',
            'Income Tax',
            'India',
            'Tax News',
            'HisaabHub',
        ],
        openGraph: {
            title: generateMetaTitle(articleWithQuestions),
            description: generateMetaDescription(articleWithQuestions),
            url: `https://hisaabhub.com/aeo/${slug}`,
            siteName: 'HisaabHub',
            locale: 'en_IN',
            type: 'article',
            publishedTime: article.created_at,
            modifiedTime: article.updated_at,
        },
        twitter: {
            card: 'summary_large_image',
            title: generateMetaTitle(articleWithQuestions),
            description: generateMetaDescription(articleWithQuestions),
        },
        alternates: {
            canonical: `https://hisaabhub.com/aeo/${slug}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

// =====================================================
// Fetch Article Data (Server-Side)
// =====================================================

async function getArticle(slug: string): Promise<ArticleWithQuestions | null> {
    const supabase = await createServerSupabaseClient();

    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error || !article) {
        return null;
    }

    const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('article_id', article.id)
        .order('position', { ascending: true });

    // Increment views
    await supabase.rpc('increment_article_views', { article_slug: slug });

    return {
        ...article,
        questions: questions || [],
    };
}

// =====================================================
// AEO Article Page Component
// =====================================================

export default async function AEOArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    const schemas = {
        faq: generateFAQSchema(article),
        article: generateArticleSchema(article),
        breadcrumb: generateBreadcrumbSchema(article),
    };



    return (
        <>
            {/* JSON-LD Schemas */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemas.faq }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemas.article }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemas.breadcrumb }}
            />

            <div className="min-h-screen bg-black text-gray-300 font-sans">
                {/* Navbar Placeholder (Assuming global navbar exists) */}

                {/* Main Container */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Breadcrumb - Top */}
                    <nav className="mb-6 text-sm flex items-center space-x-2 text-gray-500">
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                        <span>&gt;</span>
                        <a href="/aeo" className="hover:text-primary transition-colors">Tax News</a>
                        <span>&gt;</span>
                        <span className="text-gray-300 truncate max-w-[300px]">{article.keyword}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

                        {/* LEFT COLUMN: Table of Contents (Sticky) */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-24 pr-4 border-r border-gray-800">
                                <h3 className="text-lg font-bold text-white mb-4 pl-3 border-l-4 border-primary">
                                    Index
                                </h3>
                                <ul className="space-y-1 text-sm">
                                    <li>
                                        <a href="#summary" className="block py-2 px-3 text-gray-400 hover:text-primary hover:bg-dark-surface rounded transition-all truncate border-l border-transparent hover:border-gray-700">
                                            Overview
                                        </a>
                                    </li>
                                    {article.questions.map((q, i) => (
                                        <li key={i}>
                                            <a
                                                href={`#question-${i}`}
                                                className="block py-2 px-3 text-gray-400 hover:text-primary hover:bg-dark-surface rounded transition-all line-clamp-2 border-l border-transparent hover:border-gray-700"
                                            >
                                                {q.question_text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* CENTER COLUMN: Main Content */}
                        <main className="lg:col-span-6 min-w-0">
                            <article>
                                <header className="mb-8 border-b border-gray-800 pb-8">
                                    <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-tight mb-4">
                                        {article.keyword}
                                    </h1>

                                    <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                                        <span>By <strong className="text-gray-300">HisaabHub Team</strong></span>
                                        <span className="hidden sm:inline">|</span>
                                        <time dateTime={article.updated_at}>
                                            Updated on: {new Date(article.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </time>
                                        <span className="hidden sm:inline">|</span>
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            4 min read
                                        </span>
                                    </div>
                                </header>

                                {/* Summary Section */}
                                <section id="summary" className="mb-10">
                                    <p className="text-lg leading-relaxed text-gray-300 mb-6 font-medium">
                                        {article.summary}
                                    </p>

                                    {/* Action Box */}
                                    <div className="my-8 bg-dark-surface border border-gray-800 rounded-lg p-6">
                                        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                                            <div>
                                                <h4 className="text-white font-bold mb-1">Need help filing taxes?</h4>
                                                <p className="text-sm text-gray-400">Get expert assistance from CA professionals today.</p>
                                            </div>
                                            <a href="/" className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm font-bold">
                                                File Now
                                            </a>
                                        </div>
                                    </div>
                                </section>

                                {/* Questions Loop */}
                                <div className="space-y-12">
                                    {article.questions.map((q, i) => (
                                        <section key={q.id} id={`question-${i}`} className="scroll-mt-24">
                                            <h2 className="text-2xl font-bold text-white mb-4 flex items-baseline">
                                                <span className="text-primary mr-3 text-lg font-mono">
                                                    {i + 1}.
                                                </span>
                                                {q.question_text}
                                            </h2>
                                            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                                                <div className="whitespace-pre-line">
                                                    {q.answer_text}
                                                </div>
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            </article>

                            {/* Mobile only: Related Topics (bottom) */}
                            <div className="lg:hidden mt-12 pt-8 border-t border-gray-800">
                                <h3 className="text-lg font-bold text-white mb-4">Related Topics</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="block py-2 text-primary hover:underline">Income Tax Calculator</a></li>
                                    <li><a href="#" className="block py-2 text-primary hover:underline">GST Registration Guide</a></li>
                                    <li><a href="#" className="block py-2 text-primary hover:underline">ITR Filing 2026</a></li>
                                </ul>
                            </div>
                        </main>

                        {/* RIGHT COLUMN: Browse Topics (Sticky) */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-24 pl-4 border-l border-gray-800">
                                <h3 className="text-lg font-bold text-white mb-6">
                                    Browse by topics
                                </h3>
                                <nav>
                                    <ul className="space-y-4">
                                        {[
                                            "Income Tax e-Filing",
                                            "Income Tax Calculator",
                                            "Income Tax Slabs FY 2025-26",
                                            "Old vs New Tax Regime",
                                            "How To File ITR",
                                            "New Tax Regime",
                                            "Which ITR Should I File",
                                            "Last Date To File ITR For 2025-26",
                                            "Income Tax Sections & Deductions",
                                            "Income Tax Refund",
                                            "Capital Gains Income",
                                            "TDS",
                                            "PF Balance Check",
                                            "Form 26AS",
                                            "Advance Tax",
                                            "Budget 2026 Highlights"
                                        ].map((topic) => (
                                            <li key={topic}>
                                                <a
                                                    href="#"
                                                    className="text-sm text-gray-400 hover:text-primary transition-colors block py-0.5"
                                                >
                                                    {topic}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                                {/* Promo Card */}
                                <div className="mt-10 p-5 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl">
                                    <h4 className="font-bold text-primary mb-2">HisaabHub Pro</h4>
                                    <p className="text-xs text-gray-400 mb-4">Get unlimited GST filings and priority support.</p>
                                    <button className="text-xs font-bold text-white bg-dark-surface px-4 py-2 rounded hover:bg-black transition-colors border border-gray-700">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
        </>
    );
}

// =====================================================
// Generate Static Params (for Static Generation)
// =====================================================

export async function generateStaticParams() {
    // Use admin client for static generation as cookies are not available
    const supabase = createAdminSupabaseClient();

    const { data: articles } = await supabase
        .from('articles')
        .select('slug')
        .eq('published', true);

    return (
        articles?.map((article) => ({
            slug: article.slug,
        })) || []
    );
}

// =====================================================
// Revalidate every 1 hour
// =====================================================

export const revalidate = 3600;
