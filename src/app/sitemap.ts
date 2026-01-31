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
    let articleRoutes: MetadataRoute.Sitemap = [];

    try {
        const supabase = createAdminSupabaseClient();
        const { data: articles, error } = await supabase
            .from('articles')
            .select('slug, updated_at')
            .eq('published', true);

        if (error) {
            console.error('Sitemap: Error fetching articles:', error);
        } else if (articles && articles.length > 0) {
            articleRoutes = articles.map((article) => ({
                url: `${baseUrl}/aeo/${article.slug}`,
                lastModified: new Date(article.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
        }
    } catch (error) {
        console.error('Sitemap: Unexpected error fetching articles:', error);
        // Continue with static routes only
    }

    return [...staticRoutes, ...articleRoutes];
}
