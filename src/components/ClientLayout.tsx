'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const openAuth = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsAuthOpen(true);
    };

    return (
        <div className="min-h-screen bg-black">
            <Navbar
                onLogin={() => openAuth('login')}
                onRegister={() => openAuth('register')}
            />
            {children}
            <Footer />

            <AuthModal
                isOpen={isAuthOpen}
                initialMode={authMode}
                onClose={() => setIsAuthOpen(false)}
            />
        </div>
    );
}
