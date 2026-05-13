'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, User, BookOpen, Search, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { articles } from '../data/articles';

const CATEGORIES = ['All', 'Income Tax', 'GST', 'Tax Planning', 'Business Tax', 'Compliance'];

const DIFFICULTY: Record<string, { label: string; color: string }> = {
    'Income Tax': { label: 'Beginner', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    'GST': { label: 'Intermediate', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    'Tax Planning': { label: 'Intermediate', color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
    'Business Tax': { label: 'Advanced', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
    'Compliance': { label: 'Advanced', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

const LearnPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() =>
        articles.filter(a => {
            const matchesCat = activeCategory === 'All' || a.category === activeCategory;
            const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch;
        }),
        [activeCategory, search]
    );

    const featured = articles[0];
    const diff = (cat: string) => DIFFICULTY[cat] ?? { label: 'Beginner', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };

    return (
        <section id="learn" className="py-16 sm:py-20 bg-gradient-to-b from-dark via-dark-surface to-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                        <BookOpen className="w-3.5 h-3.5" />
                        FY 2025-26 Updated
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3">
                        Learn About <span className="text-primary">Taxes</span>
                    </h2>
                    <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                        Guides written by CAs — covering New Regime slabs, GST 2026 updates, and smart tax-saving strategies.
                    </p>
                </div>

                {/* ── Featured Article ── */}
                <Link
                    href={`/article/${featured.id}`}
                    className="group relative flex flex-col sm:flex-row gap-6 bg-gradient-to-br from-primary/10 via-dark-surface to-dark border border-primary/30 rounded-2xl p-6 sm:p-8 mb-8 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 bg-primary text-dark text-xs font-extrabold px-3 py-1 rounded-full">
                                <Sparkles className="w-3 h-3" /> Featured
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diff(featured.category).color}`}>
                                {diff(featured.category).label}
                            </span>
                            <span className="text-xs text-primary font-semibold px-2.5 py-1 bg-primary/10 rounded-full border border-primary/20">
                                {featured.category}
                            </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                            {featured.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{featured.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{featured.author}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:self-center text-primary font-bold text-sm group-hover:gap-3 transition-all flex-shrink-0">
                        Read Article <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                {/* ── Search + Filter bar ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search articles…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-dark-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                        />
                    </div>
                    {/* Category pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-shrink-0">
                        <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${activeCategory === cat
                                    ? 'bg-primary text-dark border-primary shadow-md shadow-primary/20'
                                    : 'bg-dark-surface border-white/10 text-slate-400 hover:border-primary/40 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Articles Grid ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No articles found for &quot;{search}&quot;</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((article) => {
                            const d = diff(article.category);
                            return (
                                <Link
                                    key={article.id}
                                    href={`/article/${article.id}`}
                                    className="group bg-dark-surface border border-white/8 rounded-2xl p-5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 flex flex-col"
                                >
                                    {/* Icon + difficulty */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-dark transition-all flex-shrink-0">
                                            {article.icon}
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${d.color}`}>
                                            {d.label}
                                        </span>
                                    </div>

                                    {/* Category */}
                                    <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2 w-fit">
                                        {article.category}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors leading-snug">
                                        {article.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                                        {article.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author}</span>
                                        </div>
                                        <span className="flex items-center gap-0.5 text-primary font-semibold text-xs group-hover:gap-1.5 transition-all">
                                            Read <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* ── Bottom CTA ── */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-dark-surface border border-white/10 rounded-2xl px-6 py-4">
                        <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
                        <p className="text-slate-300 text-sm">
                            Want personalised tax advice?{' '}
                            <a href="#gst" className="text-primary font-bold hover:underline">Talk to a CA expert →</a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LearnPage;
