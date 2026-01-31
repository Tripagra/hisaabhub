import { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'HisaabHub - Professional Tax Services & ITR Filing | India\'s Most Trusted Tax Platform',
  description: 'Get expert tax filing services, GST registration, and financial consulting. File your ITR with guaranteed accuracy and maximum refunds. Join over 1 million Indians who trust HisaabHub.',
  keywords: ['tax filing', 'ITR filing', 'GST registration', 'income tax', 'tax services India', 'HisaabHub', 'tax consultant', 'financial planning'],
  authors: [{ name: 'HisaabHub Team' }],
  openGraph: {
    title: 'HisaabHub - Professional Tax Services & ITR Filing',
    description: 'Get expert tax filing services, GST registration, and financial consulting. File your ITR with guaranteed accuracy and maximum refunds.',
    type: 'website',
    url: 'https://hisaabhub.vercel.app',
    siteName: 'HisaabHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HisaabHub - Professional Tax Services & ITR Filing',
    description: 'Get expert tax filing services, GST registration, and financial consulting.',
  },
  alternates: {
    canonical: 'https://hisaabhub.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return <HomePage />;
}