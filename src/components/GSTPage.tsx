'use client';

import React, { useState } from 'react';
import { FileText, Calculator, Clock, Shield, CheckCircle, ArrowRight, TrendingUp, Users, Building2, Package, AlertTriangle, CalendarClock, Repeat2, FileCheck2, BadgeAlert, Fingerprint, ScanLine, Lock, ReceiptText } from 'lucide-react';
import GSTCalculator from './GSTCalculator';

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
        {
            returnName: 'GSTR-1',
            description: 'Statement of outward supplies (B2B & B2C invoices)',
            monthly: '11th of following month',
            quarterly: '13th of month after quarter (QRMP)',
            tag: 'Monthly / QRMP',
            icon: ReceiptText,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10 border-blue-400/20',
        },
        {
            returnName: 'IFF',
            description: 'Invoice Furnishing Facility — optional B2B upload for QRMP filers (months 1 & 2 of quarter)',
            monthly: 'N/A (monthly filers)',
            quarterly: '13th of the following month',
            tag: 'QRMP Only',
            icon: FileCheck2,
            color: 'text-violet-400',
            bg: 'bg-violet-400/10 border-violet-400/20',
        },
        {
            returnName: 'PMT-06',
            description: 'Monthly tax payment challan for QRMP scheme taxpayers',
            monthly: 'N/A (monthly filers pay via GSTR-3B)',
            quarterly: '25th of following month',
            tag: 'QRMP Only',
            icon: CalendarClock,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10 border-orange-400/20',
        },
        {
            returnName: 'GSTR-3B',
            description: 'Summary return of outward/inward supplies & tax payment. Non-editable after submission (since Jul 2025)',
            monthly: '20th of following month',
            quarterly: '22nd / 24th (Cat A / Cat B states)',
            tag: 'Monthly / QRMP',
            icon: Repeat2,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10 border-yellow-400/20',
        },
        {
            returnName: 'GSTR-9',
            description: 'Annual consolidated return for FY 2025-26',
            monthly: '—',
            quarterly: '31st December 2026',
            tag: 'Annually',
            icon: Clock,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10 border-emerald-400/20',
        },
        {
            returnName: 'GSTR-9C',
            description: 'Self-certified reconciliation statement (turnover > ₹5 Cr)',
            monthly: '—',
            quarterly: '31st December 2026',
            tag: 'If turnover > ₹5 Cr',
            icon: FileText,
            color: 'text-red-400',
            bg: 'bg-red-400/10 border-red-400/20',
        },
    ];

    const gst2026Updates = [
        {
            icon: Lock,
            title: '3-Year Hard Block',
            desc: 'Portal permanently blocks returns filed more than 3 years past their due date (effective Dec 1, 2025). Clear backlogs from FY 2021-22 immediately.',
            urgent: true,
        },
        {
            icon: ScanLine,
            title: 'Invoice Management System (IMS)',
            desc: 'Fully active in 2026. Recipients must accept/reject/pending invoices on IMS dashboard. Inaction = deemed acceptance, directly impacting GSTR-2B & ITC claims.',
            urgent: false,
        },
        {
            icon: BadgeAlert,
            title: 'E-Invoicing Threshold: ₹5 Crore',
            desc: 'Mandatory e-invoicing for all businesses with aggregate annual turnover above ₹5 crore. Also requires 6-digit HSN codes on all invoices.',
            urgent: false,
        },
        {
            icon: Fingerprint,
            title: 'MFA Mandatory (All Taxpayers)',
            desc: 'Multi-Factor Authentication is compulsory for all GST portal logins since April 2025. Ensure your registered mobile number is active.',
            urgent: false,
        },
        {
            icon: FileCheck2,
            title: 'GSTR-3B Non-Editable',
            desc: 'Since July 2025, GSTR-3B cannot be amended after submission. Double-check all figures — especially ITC claims — before filing.',
            urgent: true,
        },
    ];

    return (
        <div className="bg-dark min-h-screen" id="gst">
            {/* ── GST Calculator Section ── */}
            <div className="relative bg-gradient-to-b from-[#060d1a] to-dark py-10">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#1e40af] rounded-full blur-[120px]" />
                </div>
                <GSTCalculator />
            </div>

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



            {/* Compliance Timeline Section — 2026 Updated */}
            <div className="bg-dark-surface py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                            <CalendarClock className="w-3.5 h-3.5" />
                            Updated for FY 2025-26
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
                            GST Return Filing Calendar <span className="text-primary">2026</span>
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg px-4 max-w-2xl mx-auto">
                            All due dates for monthly and QRMP quarterly filers — updated as per CBIC notifications for FY 2025-26
                        </p>
                    </div>

                    {/* Timeline cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
                        {complianceTimeline.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-dark border border-white/10 rounded-2xl p-5 hover:border-primary/40 transition-all group"
                                >
                                    {/* Top row */}
                                    <div className="flex items-start justify-between mb-3 gap-2">
                                        <div className={`p-2 rounded-xl border ${item.bg} flex-shrink-0`}>
                                            <Icon className={`w-5 h-5 ${item.color}`} />
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.bg} ${item.color} ml-auto`}>
                                            {item.tag}
                                        </span>
                                    </div>

                                    {/* Return name */}
                                    <h3 className={`text-xl font-extrabold mb-1 ${item.color}`}>{item.returnName}</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed mb-4">{item.description}</p>

                                    {/* Due dates */}
                                    <div className="space-y-2 border-t border-white/5 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 font-medium">Monthly filer</span>
                                            <span className="text-xs text-white font-semibold bg-white/5 px-2.5 py-1 rounded-lg">{item.monthly}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 font-medium">QRMP / Annual</span>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${item.bg} ${item.color}`}>{item.quarterly}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Key 2026 Changes Alert Strip */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-5">
                            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            <h3 className="text-lg sm:text-xl font-bold text-white">Key Compliance Changes in 2026</h3>
                            <span className="ml-auto text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
                                Action Required
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {gst2026Updates.map((update, i) => {
                                const Icon = update.icon;
                                return (
                                    <div
                                        key={i}
                                        className={`rounded-xl p-4 border transition-all ${
                                            update.urgent
                                                ? 'bg-red-950/30 border-red-500/30 hover:border-red-500/60'
                                                : 'bg-dark border-white/8 hover:border-primary/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                                                update.urgent ? 'bg-red-500/15 text-red-400' : 'bg-primary/10 text-primary'
                                            }`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={`text-sm font-bold ${
                                                update.urgent ? 'text-red-300' : 'text-white'
                                            }`}>
                                                {update.title}
                                            </span>
                                            {update.urgent && (
                                                <span className="ml-auto text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-400/30 px-2 py-0.5 rounded-full">URGENT</span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-xs leading-relaxed">{update.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center px-4">
                        <p className="text-slate-400 text-sm mb-4">Deadlines subject to CBIC notifications — let our experts track them for you.</p>
                        <button
                            onClick={onGetStarted}
                            className="bg-primary hover:bg-primary-hover active:bg-primary-hover text-dark font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 inline-flex items-center justify-center w-full sm:w-auto"
                        >
                            <span className="text-sm sm:text-base">Never Miss a Deadline — Get Started</span>
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
