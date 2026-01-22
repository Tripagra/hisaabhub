'use client';

import { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AuthModal from '../AuthModal';

export default function PrivacyPolicy() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar
        onLogin={() => openAuth('login')}
        onRegister={() => openAuth('register')}
      />

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg">
              Last updated: January 22, 2026
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support.
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Tax-related documents and financial information</li>
                <li>Usage data and analytics</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Provide and improve our tax services</li>
                <li>Process your tax returns and related documents</li>
                <li>Communicate with you about our services</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Protect against fraud and unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your personal information</li>
                <li>Object to processing of your information</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-dark-surface rounded-lg p-4 mt-4">
                <p>Email: privacy@hisabhub.com</p>
                <p>Phone: +91 XXXXX XXXXX</p>
              </div>
            </section>
          </div>
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