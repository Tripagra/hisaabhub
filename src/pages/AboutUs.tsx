import { useEffect } from 'react';
import { Shield, Users, Target, Award } from 'lucide-react';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-dark pt-20">
            {/* Hero Section */}
            <div className="relative bg-dark-surface overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            About <span className="text-primary">HisaabHub</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Simplifying finances for millions of Indians. We are on a mission to make tax filing and financial planning accessible, accurate, and stress-free.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="text-primary h-8 w-8" />
                            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                        </div>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            To empower every Indian taxpayer with the tools and knowledge they need to manage their finances confidently. We believe that tax compliance should not be a burden but a simple, transparent process.
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            By leveraging cutting-edge technology and expert knowledge, we aim to bridge the gap between complex tax laws and the common man.
                        </p>
                    </div>
                    <div className="bg-dark-surface p-8 rounded-2xl border border-white/10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center p-6 bg-dark rounded-xl">
                                <h3 className="text-4xl font-bold text-primary mb-2">1M+</h3>
                                <p className="text-slate-400">Happy Users</p>
                            </div>
                            <div className="text-center p-6 bg-dark rounded-xl">
                                <h3 className="text-4xl font-bold text-primary mb-2">₹500Cr+</h3>
                                <p className="text-slate-400">Tax Saved</p>
                            </div>
                            <div className="text-center p-6 bg-dark rounded-xl">
                                <h3 className="text-4xl font-bold text-primary mb-2">4.9/5</h3>
                                <p className="text-slate-400">User Rating</p>
                            </div>
                            <div className="text-center p-6 bg-dark rounded-xl">
                                <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
                                <p className="text-slate-400">Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-dark-surface py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us?</h2>
                        <p className="text-slate-400">We bring the best of technology and financial expertise together.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-dark p-8 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                            <Shield className="h-12 w-12 text-primary mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">100% Secure & Private</h3>
                            <p className="text-slate-400">
                                Your data security is our top priority. We use bank-grade encryption to ensure your financial information remains safe and confidential.
                            </p>
                        </div>
                        <div className="bg-dark p-8 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                            <Users className="h-12 w-12 text-primary mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Expert Assistance</h3>
                            <p className="text-slate-400">
                                Our team of Chartered Accountants and tax experts is always ready to help you with complex tax situations and notices.
                            </p>
                        </div>
                        <div className="bg-dark p-8 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                            <Award className="h-12 w-12 text-primary mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Accuracy Guaranteed</h3>
                            <p className="text-slate-400">
                                Our advanced algorithms and expert review process ensure 100% accuracy in your tax filings, minimizing the risk of errors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section Placeholder */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
                    <p className="text-slate-400">The minds behind HisaabHub</p>
                </div>
                {/* Add team members here if needed */}
                <div className="text-center text-slate-500 italic">
                    "Driven by passion, united by a goal to simplify finance."
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
