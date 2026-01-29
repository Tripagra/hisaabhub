'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateArticleRequest } from '@/types/article';
import { generateSlug, validateSlug } from '@/utils/schema';

// =====================================================
// Admin Panel - Create New Article
// =====================================================

interface QuestionInput {
    question_text: string;
    answer_text: string;
}

export default function AdminNewArticlePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [slug, setSlug] = useState('');
    const [keyword, setKeyword] = useState('');
    const [summary, setSummary] = useState('');
    const [questions, setQuestions] = useState<QuestionInput[]>([
        { question_text: '', answer_text: '' },
        { question_text: '', answer_text: '' },
        { question_text: '', answer_text: '' },
        { question_text: '', answer_text: '' },
        { question_text: '', answer_text: '' },
    ]);

    // Auto-generate slug from keyword
    const handleKeywordChange = (value: string) => {
        setKeyword(value);
        if (!slug || slug === generateSlug(keyword)) {
            setSlug(generateSlug(value));
        }
    };

    // Update question
    const handleQuestionChange = (
        index: number,
        field: 'question_text' | 'answer_text',
        value: string
    ) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    // Add new question
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

    // Validate form
    const validateForm = (): string | null => {
        if (!slug.trim()) return 'Slug is required';
        if (!validateSlug(slug)) return 'Invalid slug format';
        if (!keyword.trim()) return 'Keyword is required';
        if (keyword.length < 3) return 'Keyword must be at least 3 characters';
        if (!summary.trim()) return 'Summary is required';
        if (summary.length < 10) return 'Summary must be at least 10 characters';

        const validQuestions = questions.filter(
            (q) => q.question_text.trim() && q.answer_text.trim()
        );

        if (validQuestions.length === 0) {
            return 'At least one question with answer is required';
        }

        for (let i = 0; i < validQuestions.length; i++) {
            const q = validQuestions[i];
            if (q.question_text.length < 10) {
                return `Question ${i + 1}: Question text must be at least 10 characters`;
            }
            if (q.answer_text.length < 20) {
                return `Question ${i + 1}: Answer text must be at least 20 characters`;
            }
        }

        return null;
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validate
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        // Filter out empty questions
        const validQuestions = questions.filter(
            (q) => q.question_text.trim() && q.answer_text.trim()
        );

        const payload: CreateArticleRequest = {
            slug: slug.trim(),
            keyword: keyword.trim(),
            summary: summary.trim(),
            questions: validQuestions,
        };

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to create article');
            }

            setSuccess(true);
            setError(null);

            // Redirect to the article page after 2 seconds
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

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center mb-4">
                        <div className="h-8 w-1 bg-primary mr-4"></div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Create New Tax Article
                        </h1>
                    </div>
                    <p className="text-gray-400 ml-5">
                        Add a new tax news article with frequently asked questions for better SEO visibility
                    </p>
                </header>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-green-400">
                            Article created successfully! Redirecting...
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start">
                        <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-red-400 font-medium">Error</p>
                            <p className="text-red-300 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Keyword Field */}
                    <div className="bg-dark-surface/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <label
                            htmlFor="keyword"
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Trending Keyword / Article Title *
                        </label>
                        <input
                            type="text"
                            id="keyword"
                            value={keyword}
                            onChange={(e) => handleKeywordChange(e.target.value)}
                            className="input w-full"
                            placeholder="e.g., GST Rate Changes 2026"
                            required
                            disabled={isSubmitting}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            This will be the main heading (H1) of your article
                        </p>
                    </div>

                    {/* Slug Field */}
                    <div className="bg-dark-surface/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <label
                            htmlFor="slug"
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            URL Slug *
                        </label>
                        <div className="flex items-center">
                            <span className="text-gray-500 text-sm mr-2">
                                /aeo/
                            </span>
                            <input
                                type="text"
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="input flex-1"
                                placeholder="gst-rate-changes-2026"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Auto-generated from keyword. Use lowercase letters, numbers, and hyphens only.
                        </p>
                    </div>

                    {/* Summary Field */}
                    <div className="bg-dark-surface/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <label
                            htmlFor="summary"
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            News Summary (2-3 lines) *
                        </label>
                        <textarea
                            id="summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="input w-full min-h-[100px] resize-y"
                            placeholder="Brief summary of the tax news or update..."
                            required
                            disabled={isSubmitting}
                            maxLength={500}
                        />
                        <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                                This appears in search results and social media previews
                            </span>
                            <span className={`${summary.length > 450 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                {summary.length}/500
                            </span>
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="bg-dark-surface/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Questions & Answers
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Add 1-20 questions for better SEO (FAQ schema)
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addQuestion}
                                disabled={questions.length >= 20 || isSubmitting}
                                className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                + Add Question
                            </button>
                        </div>

                        <div className="space-y-6">
                            {questions.map((q, index) => (
                                <div
                                    key={index}
                                    className="bg-dark-highlight border border-gray-700 rounded-lg p-5"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-primary">
                                            Question {index + 1}
                                        </h3>
                                        {questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(index)}
                                                disabled={isSubmitting}
                                                className="text-red-400 hover:text-red-300 transition-colors text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor={`question-${index}`}
                                                className="block text-sm font-medium text-gray-300 mb-2"
                                            >
                                                Question Text *
                                            </label>
                                            <input
                                                type="text"
                                                id={`question-${index}`}
                                                value={q.question_text}
                                                onChange={(e) =>
                                                    handleQuestionChange(
                                                        index,
                                                        'question_text',
                                                        e.target.value
                                                    )
                                                }
                                                className="input w-full"
                                                placeholder="e.g., What are the new GST rates for 2026?"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor={`answer-${index}`}
                                                className="block text-sm font-medium text-gray-300 mb-2"
                                            >
                                                Answer Text *
                                            </label>
                                            <textarea
                                                id={`answer-${index}`}
                                                value={q.answer_text}
                                                onChange={(e) =>
                                                    handleQuestionChange(
                                                        index,
                                                        'answer_text',
                                                        e.target.value
                                                    )
                                                }
                                                className="input w-full min-h-[120px] resize-y"
                                                placeholder="Provide a detailed answer..."
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Create Article
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
