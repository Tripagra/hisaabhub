// =====================================================
// AEO Article Types
// =====================================================

export interface Article {
    id: string;
    slug: string;
    keyword: string;
    summary: string;
    created_at: string;
    updated_at: string;
    published: boolean;
    views: number;
}

export interface Question {
    id: string;
    article_id: string;
    question_text: string;
    answer_text: string;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface ArticleWithQuestions extends Article {
    questions: Question[];
}

// =====================================================
// API Request/Response Types
// =====================================================

export interface CreateArticleRequest {
    slug: string;
    keyword: string;
    summary: string;
    questions: {
        question_text: string;
        answer_text: string;
    }[];
}

export interface CreateArticleResponse {
    success: boolean;
    data?: ArticleWithQuestions;
    error?: string;
}

export interface GetArticleResponse {
    success: boolean;
    data?: ArticleWithQuestions;
    error?: string;
}

// =====================================================
// Validation Schemas (for runtime validation)
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
