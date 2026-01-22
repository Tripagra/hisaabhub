import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePage from '@/components/pages/ArticlePage';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, you'd fetch article data here
  const { id: articleId } = await params;
  
  return {
    title: `Article ${articleId}`,
    description: `Read our detailed article about tax and financial topics.`,
  };
}

export default async function Article({ params }: Props) {
  // In a real app, you'd validate the article ID exists
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  return <ArticlePage />;
}