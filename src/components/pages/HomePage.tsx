'use client';

import { useState, useEffect } from 'react';
import Hero from '../Hero';
import Features from '../Features';
import GSTPage from '../GSTPage';
import TaxEstimator from '../TaxEstimator';
import LearnPage from '../LearnPage';
import TrustSignals from '../TrustSignals';
import FileITRModal from '../FileITRModal';
import ServiceModal from '../ServiceModal';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AuthModal from '../AuthModal';

export const HomePage = () => {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isFileITROpen, setIsFileITROpen] = useState(false);
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [serviceName, setServiceName] = useState('');

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    const openAuth = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsAuthOpen(true);
    };

    const openService = (name: string) => {
        setServiceName(name);
        setIsServiceOpen(true);
    };

    const handleFeatureAction = (action: string, name?: string) => {
        if (action === 'fileITR') {
            setIsFileITROpen(true);
        } else if (action === 'service' && name) {
            openService(name);
        }
    };

    return (
        <div className="min-h-screen bg-dark">
            <Navbar
                onLogin={() => openAuth('login')}
                onRegister={() => openAuth('register')}
            />

            <Hero
                onFileITR={() => setIsFileITROpen(true)}
                onExpert={() => openService('Expert Assisted Filing')}
            />
            <Features onAction={handleFeatureAction} />
            <GSTPage onGetStarted={() => openService('GST Services')} />
            <TaxEstimator />
            <LearnPage />
            <TrustSignals />

            <Footer />

            {/* Global Auth Modal */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                initialMode={authMode}
            />

            {/* Modals specific to Home Page actions */}
            <FileITRModal
                isOpen={isFileITROpen}
                onClose={() => setIsFileITROpen(false)}
            />
            <ServiceModal
                isOpen={isServiceOpen}
                onClose={() => setIsServiceOpen(false)}
                serviceName={serviceName}
            />
        </div>
    );
};