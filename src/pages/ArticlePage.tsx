import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Clock, User } from 'lucide-react';
import { articles } from '../data/articles';

// Component to render article content with proper formatting
const ArticleContent: React.FC<{ content: string }> = ({ content }) => {
    const renderContent = () => {
        const lines = content.trim().split('\n');
        const elements: React.ReactElement[] = [];
        let currentList: string[] = [];
        let listType: 'ul' | 'ol' | null = null;

        const flushList = () => {
            if (currentList.length > 0) {
                elements.push(
                    listType === 'ul' ? (
                        <ul key={elements.length} className="list-disc list-inside space-y-2 mb-6 text-slate-300 ml-4">
                            {currentList.map((item, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ul>
                    ) : (
                        <ol key={elements.length} className="list-decimal list-inside space-y-2 mb-6 text-slate-300 ml-4">
                            {currentList.map((item, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ol>
                    )
                );
                currentList = [];
                listType = null;
            }
        };

        const formatInline = (text: string) => {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                .replace(/₹/g, '₹')
                .replace(/✅/g, '<span class="text-green-400">✅</span>')
                .replace(/❌/g, '<span class="text-red-400">❌</span>');
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
                flushList();
                return;
            }

            // H1
            if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('## ')) {
                flushList();
                elements.push(
                    <h1 key={index} className="text-3xl font-bold text-primary mb-6 mt-8">
                        {trimmedLine.substring(2)}
                    </h1>
                );
            }
            // H2
            else if (trimmedLine.startsWith('## ') && !trimmedLine.startsWith('### ')) {
                flushList();
                elements.push(
                    <h2 key={index} className="text-2xl font-bold text-primary/90 mb-4 mt-8">
                        {trimmedLine.substring(3)}
                    </h2>
                );
            }
            // H3
            else if (trimmedLine.startsWith('### ')) {
                flushList();
                elements.push(
                    <h3 key={index} className="text-xl font-semibold text-white mb-3 mt-6">
                        {trimmedLine.substring(4)}
                    </h3>
                );
            }
            // Unordered list
            else if (trimmedLine.startsWith('- ')) {
                if (listType !== 'ul') {
                    flushList();
                    listType = 'ul';
                }
                currentList.push(formatInline(trimmedLine.substring(2)));
            }
            // Ordered list
            else if (/^\d+\.\s/.test(trimmedLine)) {
                if (listType !== 'ol') {
                    flushList();
                    listType = 'ol';
                }
                currentList.push(formatInline(trimmedLine.replace(/^\d+\.\s/, '')));
            }
            // Checkbox list
            else if (trimmedLine.startsWith('- [ ]') || trimmedLine.startsWith('- [x]')) {
                if (listType !== 'ul') {
                    flushList();
                    listType = 'ul';
                }
                const checked = trimmedLine.startsWith('- [x]');
                const text = trimmedLine.substring(6);
                currentList.push(
                    `<span class="${checked ? 'text-green-400' : 'text-slate-400'}">${checked ? '✓' : '○'} ${formatInline(text)}</span>`
                );
            }
            // Regular paragraph
            else {
                flushList();
                elements.push(
                    <p
                        key={index}
                        className="text-slate-300 leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: formatInline(trimmedLine) }}
                    />
                );
            }
        });

        flushList();
        return elements;
    };

    return <div className="article-content">{renderContent()}</div>;
};

const ArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const article = articles.find(a => a.id === Number(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!article) {
        return (
            <div className="min-h-screen bg-dark pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl text-white mb-4">Article not found</h2>
                    <Link to="/" className="text-primary hover:underline">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/#learn"
                    className="mb-8 flex items-center gap-2 text-primary hover:text-white transition-colors group inline-flex"
                >
                    <ChevronRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Back to Articles</span>
                </Link>

                {/* Article Header */}
                <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 md:p-12 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            {article.icon}
                        </div>
                        <span className="px-4 py-1.5 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                            {article.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{article.readTime}</span>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 md:p-12">
                    <ArticleContent content={article.content} />
                </div>

                {/* Related Articles */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-white mb-6">More Articles</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {articles
                            .filter(a => a.id !== article.id)
                            .slice(0, 2)
                            .map((relatedArticle) => (
                                <Link
                                    key={relatedArticle.id}
                                    to={`/article/${relatedArticle.id}`}
                                    className="bg-dark-surface border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group block"
                                >
                                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full mb-3">
                                        {relatedArticle.category}
                                    </span>
                                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                        {relatedArticle.title}
                                    </h4>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                                        {relatedArticle.excerpt}
                                    </p>
                                    <div className="flex items-center text-primary font-semibold text-sm">
                                        <span>Read More</span>
                                        <ChevronRight size={16} className="ml-1" />
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;
