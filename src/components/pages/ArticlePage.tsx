'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AuthModal from '../AuthModal';

export default function ArticlePage() {
  const params = useParams();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // In a real app, you'd fetch article data based on params.id
  const articleId = params?.id as string;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar
        onLogin={() => openAuth('login')}
        onRegister={() => openAuth('register')}
      />

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-invert max-w-none">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Tax Article {articleId || 'Sample'}
              </h1>
              <div className="flex items-center text-gray-400 text-sm">
                <span>Published on January 22, 2026</span>
                <span className="mx-2">•</span>
                <span>5 min read</span>
              </div>
            </header>

            <div className="text-gray-300 space-y-6">
              <p>
                This is a sample article about tax-related topics. In a real application, 
                this content would be fetched from your CMS or database based on the article ID.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Understanding Tax Implications
              </h2>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris.
              </p>

              <h3 className="text-xl font-bold text-white mt-6 mb-3">
                Key Points to Remember
              </h3>

              <ul className="list-disc list-inside space-y-2">
                <li>Always maintain proper documentation</li>
                <li>File your returns on time to avoid penalties</li>
                <li>Consult with tax professionals for complex situations</li>
                <li>Keep track of all eligible deductions</li>
              </ul>

              <div className="bg-dark-surface rounded-lg p-6 mt-8">
                <h4 className="text-lg font-bold text-primary mb-3">
                  Need Professional Help?
                </h4>
                <p className="mb-4">
                  Our expert team is here to help you with all your tax-related queries 
                  and filing requirements.
                </p>
                <button className="btn-primary">
                  Contact Our Experts
                </button>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}