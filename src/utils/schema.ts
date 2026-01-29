import type { ArticleWithQuestions } from '@/types/article';

// =====================================================
// Validation Schemas
// =====================================================

export const articleValidation = {
    slug: {
        minLength: 3,
        maxLength: 100,
        pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    keyword: {
        minLength: 3,
        maxLength: 200,
    },
    summary: {
        minLength: 10,
        maxLength: 500,
    },
    questions: {
        minCount: 1,
        maxCount: 20,
    },
    questionText: {
        minLength: 10,
        maxLength: 500,
    },
    answerText: {
        minLength: 20,
        maxLength: 2000,
    },
};

// =====================================================
// FAQ Schema JSON-LD Generator
// =====================================================

export function generateFAQSchema(article: ArticleWithQuestions): string {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.questions.map((q) => ({
            '@type': 'Question',
            name: q.question_text,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer_text,
            },
        })),
    };

    return JSON.stringify(schema);
}

// =====================================================
// Article Schema JSON-LD Generator
// =====================================================

export function generateArticleSchema(article: ArticleWithQuestions): string {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.keyword,
        description: article.summary,
        datePublished: article.created_at,
        dateModified: article.updated_at,
        author: {
            '@type': 'Organization',
            name: 'HisaabHub',
            url: 'https://hisaabhub.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'HisaabHub',
            url: 'https://hisaabhub.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://hisaabhub.com/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://hisaabhub.com/aeo/${article.slug}`,
        },
    };

    return JSON.stringify(schema);
}

// =====================================================
// Breadcrumb Schema JSON-LD Generator
// =====================================================

export function generateBreadcrumbSchema(article: ArticleWithQuestions): string {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://hisaabhub.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'AEO News',
                item: 'https://hisaabhub.com/aeo',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: article.keyword,
                item: `https://hisaabhub.com/aeo/${article.slug}`,
            },
        ],
    };

    return JSON.stringify(schema);
}

// =====================================================
// Combined Schema Generator
// =====================================================

export function generateAllSchemas(article: ArticleWithQuestions): {
    faq: string;
    article: string;
    breadcrumb: string;
} {
    return {
        faq: generateFAQSchema(article),
        article: generateArticleSchema(article),
        breadcrumb: generateBreadcrumbSchema(article),
    };
}

// =====================================================
// Slug Validation & Generation
// =====================================================

export function validateSlug(slug: string): boolean {
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug) && slug.length >= 3 && slug.length <= 100;
}

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// =====================================================
// Text Sanitization
// =====================================================

export function sanitizeText(text: string): string {
    return text
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/[<>]/g, ''); // Remove potential HTML tags
}

// =====================================================
// Meta Description Generator
// =====================================================

export function generateMetaDescription(article: ArticleWithQuestions): string {
    const maxLength = 160;
    let description = article.summary;

    if (description.length > maxLength) {
        description = description.substring(0, maxLength - 3) + '...';
    }

    return description;
}

// =====================================================
// Meta Title Generator
// =====================================================

export function generateMetaTitle(article: ArticleWithQuestions): string {
    const maxLength = 60;
    let title = `${article.keyword} | HisaabHub`;

    if (title.length > maxLength) {
        const keywordMaxLength = maxLength - ' | HisaabHub'.length - 3;
        title = `${article.keyword.substring(0, keywordMaxLength)}... | HisaabHub`;
    }

    return title;
}
