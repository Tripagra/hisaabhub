import { useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import GSTPage from '../components/GSTPage';
import TaxEstimator from '../components/TaxEstimator';
import LearnPage from '../components/LearnPage';
import TrustSignals from '../components/TrustSignals';
import FileITRModal from '../components/FileITRModal';
import ServiceModal from '../components/ServiceModal';

const HomePage = () => {
    const [isFileITROpen, setIsFileITROpen] = useState(false);
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [serviceName, setServiceName] = useState('');

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
        <>
            <Hero
                onFileITR={() => setIsFileITROpen(true)}
                onExpert={() => openService('Expert Assisted Filing')}
            />
            <Features onAction={handleFeatureAction} />
            <GSTPage onGetStarted={() => openService('GST Services')} />
            <TaxEstimator />
            <LearnPage />
            <TrustSignals />

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
        </>
    );
};

export default HomePage;
