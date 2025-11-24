import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface HeroProps {
    onFileITR: () => void;
    onExpert: () => void;
}

const Hero: React.FC<HeroProps> = ({ onFileITR, onExpert }) => {
    return (
        <div className="relative bg-dark overflow-hidden" id="file-itr">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-dark sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary">HisaabHub</span>
                                <span className="block xl:inline">India's Most Trusted Tax Platform</span>
                            </h1>
                            <p className="mt-3 text-base text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Maximize your refunds and file your ITR in minutes. Join over 1 million Indians who trust HisaabHub for their financial planning and tax filing.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <button
                                        onClick={onFileITR}
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-dark bg-primary hover:bg-primary-hover md:py-4 md:text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20"
                                    >
                                        File for Free
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </button>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <button
                                        onClick={onExpert}
                                        className="w-full flex items-center justify-center px-8 py-3 border border-primary/30 text-base font-medium rounded-md text-primary bg-primary/5 hover:bg-primary/10 md:py-4 md:text-lg transition-colors"
                                    >
                                        Talk to an Expert
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-center lg:justify-start space-x-4 text-sm text-slate-500">
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-success mr-1" />
                                    <span>Authorized E-Return Intermediary</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-success mr-1" />
                                    <span>ISO 27001 Certified</span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="hidden lg:flex lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-dark items-center justify-center">
                <img
                    className="w-full h-full object-contain p-16"
                    src="/assets/hero-illustration.png"
                    alt="Financial planning and tax services"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent"></div>
            </div>
        </div>
    );
};

export default Hero;
