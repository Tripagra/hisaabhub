'use client';

import { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AuthModal from '../AuthModal';

export default function RefundPolicy() {
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
          <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg">
              Last updated: January 22, 2026
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Refund Eligibility</h2>
              <p>
                We offer refunds under the following circumstances:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Service not delivered within promised timeframe</li>
                <li>Technical issues preventing service completion</li>
                <li>Duplicate payments or billing errors</li>
                <li>Cancellation within 24 hours of service request</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Non-Refundable Services</h2>
              <p>The following services are non-refundable:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Completed tax return filings</li>
                <li>Consultation services already provided</li>
                <li>Government fees and statutory charges</li>
                <li>Services cancelled after work has commenced</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Refund Process</h2>
              <p>To request a refund:</p>
              <ol className="list-decimal list-inside mt-4 space-y-2">
                <li>Contact our support team within 7 days</li>
                <li>Provide your order/transaction details</li>
                <li>Explain the reason for refund request</li>
                <li>Allow 5-10 business days for processing</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Refund Timeline</h2>
              <p>
                Approved refunds will be processed within 5-10 business days and 
                credited back to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Partial Refunds</h2>
              <p>
                In some cases, we may offer partial refunds based on the extent 
                of services provided or work completed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact for Refunds</h2>
              <p>
                For refund requests or questions about this policy:
              </p>
              <div className="bg-dark-surface rounded-lg p-4 mt-4">
                <p>Email: refunds@hisabhub.com</p>
                <p>Phone: +91 XXXXX XXXXX</p>
                <p>Support Hours: Mon-Fri, 9 AM - 6 PM IST</p>
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