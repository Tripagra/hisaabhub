import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'HisabHub - Professional Tax Services',
    template: '%s | HisabHub',
  },
  description: 'Professional tax filing, GST services, and financial consulting. Expert-assisted ITR filing with guaranteed accuracy.',
  keywords: ['tax filing', 'ITR', 'GST', 'financial services', 'tax consultant', 'India'],
  authors: [{ name: 'HisabHub Team' }],
  creator: 'HisabHub',
  publisher: 'HisabHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hisabhub.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'HisabHub - Professional Tax Services',
    description: 'Professional tax filing, GST services, and financial consulting.',
    siteName: 'HisabHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HisabHub - Professional Tax Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HisabHub - Professional Tax Services',
    description: 'Professional tax filing, GST services, and financial consulting.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}