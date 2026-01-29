import { Metadata } from 'next';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import type { Article } from '@/types/article';

// =====================================================
// Metadata for SEO
// =====================================================

export const metadata: Metadata = {
    title: 'Latest Tax & GST News | HisaabHub AEO',
    description:
        'Stay updated with the latest GST, Income Tax, and business news in India. Expert insights and answers to your tax questions.',
    keywords: [
        'GST News',
        'Income Tax Updates',
        'Tax News India',
        'Business News',
        'HisaabHub',
    ],
    openGraph: {
        title: 'Latest Tax & GST News | HisaabHub',
        description:
            'Stay updated with the latest GST, Income Tax, and business news in India.',
        url: 'https://hisaabhub.com/aeo',
        siteName: 'HisaabHub',
        locale: 'en_IN',
        type: 'website',
    },
    alternates: {
        canonical: 'https://hisaabhub.com/aeo',
    },
};

// =====================================================
// Fetch Articles
// =====================================================

async function getArticles(): Promise<Article[]> {
    const supabase = await createServerSupabaseClient();

    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    return articles || [];
}

// =====================================================
// AEO Index Page
// =====================================================

export default async function AEOIndexPage() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-dark-surface to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <header className="text-center max-w-3xl mx-auto">
                        <div className="inline-block mb-4">
                            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                                Tax News & Updates
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Latest <span className="gradient-text">Tax & GST</span> News
                        </h1>
                        <p className="text-xl text-gray-400">
                            Stay informed with the latest updates on GST, Income Tax, and business regulations in India
                        </p>
                    </header>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {articles.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <p className="text-gray-500 text-lg">
                            No articles available yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/aeo/${article.slug}`}
                                className="group bg-dark-surface/50 backdrop-blur-sm border border-gray-800 rounded-lg hover:border-primary/50 transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Article Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                                            Tax Update
                                        </span>
                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>

                                    {/* Article Title */}
                                    <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {article.keyword}
                                    </h2>

                                    {/* Article Summary */}
                                    <p className="text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                                        {article.summary}
                                    </p>

                                    {/* Meta Information */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-800">
                                        <time dateTime={article.created_at} className="flex items-center">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(article.created_at).toLocaleDateString(
                                                'en-IN',
                                                {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                }
                                            )}
                                        </time>
                                        <span className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            {article.views}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <section className="mt-16 bg-gradient-to-r from-dark-surface to-dark-highlight border border-gray-800 rounded-lg p-8 md:p-12 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Need Expert Tax Assistance?
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Our team of certified tax professionals can help you with GST
                            registration, ITR filing, and tax compliance.
                        </p>
                        <Link
                            href="/"
                            className="btn-primary inline-flex items-center"
                        >
                            Get Started
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

// =====================================================
// Revalidate every 30 minutes
// =====================================================

export const revalidate = 1800;
