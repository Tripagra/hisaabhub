'use client';

import { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AuthModal from '../AuthModal';

export default function AboutUs() {
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              About <span className="gradient-text">HisabHub</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your trusted partner for professional tax services and financial consulting
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 mb-4">
                At HisabHub, we simplify tax compliance and financial management for individuals and businesses across India. Our mission is to make professional tax services accessible, affordable, and reliable.
              </p>
              <p className="text-gray-300">
                With years of expertise in tax law and financial consulting, we ensure maximum refunds, complete compliance, and peace of mind for our clients.
              </p>
            </div>
            <div className="bg-dark-surface rounded-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">Why Choose Us?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Expert CA-assisted filing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  100% accuracy guarantee
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Maximum refund optimization
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Secure & confidential
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <h3 className="text-xl font-bold text-primary mb-3">ITR Filing</h3>
                <p className="text-gray-300">
                  Professional income tax return filing with expert guidance and maximum refund optimization.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-primary mb-3">GST Services</h3>
                <p className="text-gray-300">
                  Complete GST registration, filing, and compliance management for your business.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-primary mb-3">Tax Planning</h3>
                <p className="text-gray-300">
                  Strategic tax planning and consultation to minimize your tax liability legally.
                </p>
              </div>
            </div>
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