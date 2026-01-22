'use client';

import React, { useState } from 'react';
import { FileText, Calculator, Clock, Shield, CheckCircle, ArrowRight, TrendingUp, Users, Building2, Package } from 'lucide-react';

interface GSTPageProps {
    onGetStarted: () => void;
}

const GSTPage: React.FC<GSTPageProps> = ({ onGetStarted }) => {
    const [selectedGSTType, setSelectedGSTType] = useState<string>('regular');

    const gstServices = [
        {
            icon: FileText,
            title: 'GST Registration',
            description: 'Quick and hassle-free GST registration for your business',
            features: ['GSTIN in 3-5 days', 'Expert assistance', 'Document preparation', 'End-to-end support'],
            price: '₹2,999',
            popular: false
        },
        {
            icon: Calculator,
            title: 'GST Return Filing',
            description: 'Timely and accurate GST return filing services',
            features: ['GSTR-1, 3B filing', 'Monthly/Quarterly', 'Auto-calculations', 'Compliance alerts'],
            price: '₹999/month',
            popular: true
        },
        {
            icon: TrendingUp,
            title: 'GST Advisory',
            description: 'Expert consultation for GST compliance and optimization',
            features: ['Tax planning', 'ITC optimization', 'Audit support', 'Compliance review'],
            price: '₹4,999',
            popular: false
        },
        {
            icon: Shield,
            title: 'GST Audit Support',
            description: 'Comprehensive support for GST audits and assessments',
            features: ['Documentation', 'Notice handling', 'Representation', 'Appeal filing'],
            price: '₹9,999',
            popular: false
        }
    ];

    const gstRates = [
        { rate: '0%', items: 'Essential items like milk, eggs, fresh vegetables, bread, etc.', color: 'from-green-400 to-green-600' },
        { rate: '5%', items: 'Common use items like sugar, tea, coffee, edible oils, coal, etc.', color: 'from-blue-400 to-blue-600' },
        { rate: '12%', items: 'Processed food, computers, mobile phones (below ₹25,000), etc.', color: 'from-yellow-400 to-yellow-600' },
        { rate: '18%', items: 'Most goods and services, IT services, telecom services, etc.', color: 'from-orange-400 to-orange-600' },
        { rate: '28%', items: 'Luxury items, automobiles, tobacco products, aerated drinks, etc.', color: 'from-red-400 to-red-600' }
    ];

    const gstTypes = [
        {
            id: 'regular',
            name: 'Regular Taxpayer',
            icon: Building2,
            description: 'For businesses with turnover above ₹40 lakhs (₹20 lakhs for services)',
            features: ['Monthly/Quarterly returns', 'Input tax credit available', 'Interstate supply allowed']
        },
        {
            id: 'composition',
            name: 'Composition Scheme',
            icon: Package,
            description: 'For small businesses with turnover up to ₹1.5 crores',
            features: ['Quarterly returns', 'Lower tax rates', 'Simplified compliance']
        },
        {
            id: 'casual',
            name: 'Casual Taxpayer',
            icon: Users,
            description: 'For occasional business transactions in a state',
            features: ['Temporary registration', 'Advance tax deposit', 'No ITC benefit']
        }
    ];

    const complianceTimeline = [
        { return: 'GSTR-1', description: 'Outward supplies', due: '11th of next month', frequency: 'Monthly/Quarterly' },
        { return: 'GSTR-3B', description: 'Summary return', due: '20th of next month', frequency: 'Monthly/Quarterly' },
        { return: 'GSTR-9', description: 'Annual return', due: '31st December', frequency: 'Annually' },
        { return: 'GSTR-9C', description: 'Reconciliation statement', due: '31st December', frequency: 'Annually (if turnover > ₹5 Cr)' }
    ];

    return (
        <div className="bg-dark min-h-screen" id="gst">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-dark via-dark-surface to-dark overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 px-2">
                            GST Services & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary">Solutions</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
                            Comprehensive GST registration, filing, and compliance services for businesses across India
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4">
                            <button
                                onClick={onGetStarted}
                                className="bg-primary hover:bg-primary-hover text-dark font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 flex items-center justify-center w-full sm:w-auto"
                            >
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                            <button className="border-2 border-primary/30 text-primary hover:bg-primary/10 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all w-full sm:w-auto">
                                Talk to Expert
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* GST Types Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">Types of GST Registration</h2>
                    <p className="text-slate-400 text-base sm:text-lg px-4">Choose the right GST registration type for your business</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {gstTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <div
                                key={type.id}
                                onClick={() => setSelectedGSTType(type.id)}
                                className={`bg-dark-surface border-2 rounded-xl p-5 sm:p-6 cursor-pointer transition-all active:scale-95 sm:hover:-translate-y-2 ${selectedGSTType === type.id
                                    ? 'border-primary shadow-lg shadow-primary/20'
                                    : 'border-white/10 hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg">
                                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{type.name}</h3>
                                <p className="text-slate-400 mb-4 text-sm leading-relaxed">{type.description}</p>
                                <ul className="space-y-2">
                                    {type.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-sm text-slate-300">
                                            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* GST Services Section */}
            <div className="bg-dark-surface py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">Our GST Services</h2>
                        <p className="text-slate-400 text-base sm:text-lg px-4">End-to-end GST solutions for your business</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {gstServices.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-dark border border-white/10 rounded-xl p-5 sm:p-6 hover:border-primary/50 transition-all active:scale-95 sm:hover:-translate-y-2 relative overflow-hidden group"
                                >
                                    {service.popular && (
                                        <div className="absolute top-0 right-0 bg-primary text-dark text-xs font-bold px-3 py-1 rounded-bl-lg">
                                            POPULAR
                                        </div>
                                    )}
                                    <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{service.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                                    <div className="mb-4">
                                        <span className="text-2xl sm:text-3xl font-bold text-primary">{service.price}</span>
                                    </div>
                                    <ul className="space-y-2 mb-6">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-slate-300">
                                                <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={onGetStarted}
                                        className="w-full bg-primary/10 hover:bg-primary active:bg-primary text-primary hover:text-dark active:text-dark font-semibold py-2.5 sm:py-3 rounded-lg transition-all"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* GST Rates Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">GST Tax Slabs in India</h2>
                    <p className="text-slate-400 text-base sm:text-lg px-4">Understanding the different GST rates applicable to goods and services</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {gstRates.map((slab, index) => (
                        <div
                            key={index}
                            className="bg-dark-surface border border-white/10 rounded-xl p-4 sm:p-6 hover:border-primary/50 transition-all active:scale-95 sm:hover:-translate-y-2"
                        >
                            <div className={`bg-gradient-to-br ${slab.color} text-white text-3xl sm:text-4xl font-bold rounded-lg p-3 sm:p-4 text-center mb-3 sm:mb-4 shadow-lg`}>
                                {slab.rate}
                            </div>
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{slab.items}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 sm:mt-8 bg-dark-surface border border-primary/20 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start">
                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-white mb-2">Important Note</h3>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                GST rates may vary based on specific product categories and HSN codes. Some items may also attract additional cess.
                                Always consult with our GST experts for accurate tax rate determination for your specific products or services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance Timeline Section */}
            <div className="bg-dark-surface py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">GST Compliance Timeline</h2>
                        <p className="text-slate-400 text-base sm:text-lg px-4">Stay compliant with timely GST return filing</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {complianceTimeline.map((item, index) => (
                            <div
                                key={index}
                                className="bg-dark border border-white/10 rounded-xl p-5 sm:p-6 hover:border-primary/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4 gap-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1">{item.return}</h3>
                                        <p className="text-slate-300 text-sm sm:text-base">{item.description}</p>
                                    </div>
                                    <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm">
                                    <div>
                                        <span className="text-slate-500">Due Date:</span>
                                        <span className="text-white font-semibold ml-2">{item.due}</span>
                                    </div>
                                    <div>
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold inline-block">
                                            {item.frequency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 sm:mt-8 text-center px-4">
                        <button
                            onClick={onGetStarted}
                            className="bg-primary hover:bg-primary-hover active:bg-primary-hover text-dark font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 inline-flex items-center justify-center w-full sm:w-auto"
                        >
                            <span className="text-sm sm:text-base">Never Miss a Deadline - Get Started</span>
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">Why Choose HisaabHub for GST?</h2>
                    <p className="text-slate-400 text-base sm:text-lg px-4">Your trusted partner for GST compliance</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    <div className="text-center px-4">
                        <div className="bg-primary/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">100% Secure</h3>
                        <p className="text-slate-400 text-sm sm:text-base">Bank-grade security for all your financial data</p>
                    </div>
                    <div className="text-center px-4">
                        <div className="bg-primary/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Expert Support</h3>
                        <p className="text-slate-400 text-sm sm:text-base">Dedicated CA and tax experts at your service</p>
                    </div>
                    <div className="text-center px-4">
                        <div className="bg-primary/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Timely Filing</h3>
                        <p className="text-slate-400 text-sm sm:text-base">Never miss a deadline with automated reminders</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GSTPage;
