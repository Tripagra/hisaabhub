'use client';

import { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AuthModal from '../AuthModal';

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg">
              Last updated: January 22, 2026
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
              <p>
                By accessing and using HisabHub services, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Service Description</h2>
              <p>
                HisabHub provides professional tax filing, GST services, and financial 
                consulting services. Our services include:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Income Tax Return (ITR) filing</li>
                <li>GST registration and compliance</li>
                <li>Tax planning and consultation</li>
                <li>Financial advisory services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
              <p>As a user of our services, you agree to:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account</li>
                <li>Use our services in compliance with applicable laws</li>
                <li>Pay all applicable fees in a timely manner</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p>
                HisabHub shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services 
                immediately, without prior notice, for any breach of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-dark-surface rounded-lg p-4 mt-4">
                <p>Email: legal@hisabhub.com</p>
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