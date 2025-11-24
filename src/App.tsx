import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import GSTPage from './components/GSTPage';
import TaxEstimator from './components/TaxEstimator';
import LearnPage from './components/LearnPage';
import TrustSignals from './components/TrustSignals';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import FileITRModal from './components/FileITRModal';
import ServiceModal from './components/ServiceModal';

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFileITROpen, setIsFileITROpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');

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

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
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
}

export default App;
