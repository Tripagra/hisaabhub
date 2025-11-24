import React from 'react';
import { FileText, Users, Briefcase, ArrowRight } from 'lucide-react';

interface FeaturesProps {
    onAction: (action: string, serviceName?: string) => void;
}

const features = [
    {
        name: 'File ITR with Us',
        description: 'Let our experts handle your taxes. Accurate, secure, and hassle-free filing.',
        icon: FileText,
        color: 'bg-blue-500/10 text-blue-400',
        cta: 'File Now',
        free: false,
        action: 'fileITR',
    },
    {
        name: 'Expert Assisted',
        description: 'Get a personal CA to file your taxes. Perfect for freelancers, capital gains, and complex incomes.',
        icon: Users,
        color: 'bg-purple-500/10 text-purple-400',
        cta: 'Book an Expert',
        action: 'service',
    },
    {
        name: 'GST Filing',
        description: 'Complete GST solution for businesses. Invoicing, filing, and reconciliation made easy.',
        icon: Briefcase,
        color: 'bg-orange-500/10 text-orange-400',
        cta: 'Explore GST',
        action: 'service',
    },
];

const Features: React.FC<FeaturesProps> = ({ onAction }) => {
    return (
        <div className="py-16 bg-dark" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Our Services</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                        Everything you need for your finances
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">
                        From tax filing to GST compliance, HisabHub offers a comprehensive suite of financial tools.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.name} className="flex flex-col bg-dark-surface rounded-2xl shadow-lg border border-white/5 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                            <div className="p-6 flex-1">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${feature.color} mb-4`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white">{feature.name}</h3>
                                    {feature.free && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success border border-success/20">
                                            Free
                                        </span>
                                    )}
                                </div>
                                <p className="mt-3 text-base text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                            <div className="px-6 py-4 bg-black/20 border-t border-white/5">
                                <button
                                    onClick={() => onAction(feature.action, feature.name)}
                                    className="flex items-center text-base font-medium text-primary hover:text-primary-hover group-hover:translate-x-1 transition-transform duration-300 focus:outline-none"
                                >
                                    {feature.cta}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
