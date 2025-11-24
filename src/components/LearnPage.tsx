import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, User } from 'lucide-react';
import { articles } from '../data/articles';

const LearnPage: React.FC = () => {
    return (
        <section id="learn" className="py-20 bg-gradient-to-b from-dark via-dark-surface to-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Learn About <span className="text-primary">Taxes</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                        Comprehensive guides and articles to help you understand Indian taxation, save money legally, and stay compliant.
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/article/${article.id}`}
                            className="group bg-dark-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 block"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-dark transition-all">
                                {article.icon}
                            </div>

                            {/* Category Badge */}
                            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full mb-3">
                                {article.category}
                            </span>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                {article.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                                {article.excerpt}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{article.readTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User size={14} />
                                    <span>{article.author}</span>
                                </div>
                            </div>

                            {/* Read More */}
                            <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>Read Article</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LearnPage;
