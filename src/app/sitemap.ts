import { MetadataRoute } from 'next';
import { createAdminSupabaseClient } from '@/lib/supabaseServer';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hisabhub.com';

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/aeo',
        '/about',
        '/privacy',
        '/terms',
        '/refund',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Routes (Articles)
    const supabase = createAdminSupabaseClient();
    const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at')
        .eq('published', true);

    const articleRoutes = (articles || []).map((article) => ({
        url: `${baseUrl}/aeo/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...articleRoutes];
}
