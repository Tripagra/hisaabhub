import { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-dark pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                    <p className="text-slate-400 mb-8">Last Updated: November 24, 2025</p>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
                            <p>
                                Welcome to HisaabHub ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal and financial information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">2. Information We Collect</h2>
                            <p className="mb-4">We collect information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, PAN card details, Aadhaar number, date of birth, and address.</li>
                                <li><strong>Financial Information:</strong> Bank account details, income details, investment proofs, Form 16, and other tax-related documents.</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage data.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                            <p className="mb-4">We use the information we collect or receive:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>To facilitate account creation and logon process.</li>
                                <li>To provide tax filing and financial planning services.</li>
                                <li>To communicate with you about your account, updates, and offers.</li>
                                <li>To maintain the security and integrity of our platform.</li>
                                <li>To comply with legal obligations and regulatory requirements.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
                            <p>
                                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. We use bank-grade encryption (SSL/TLS) for data transmission and secure servers for data storage. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">5. Sharing Your Information</h2>
                            <p>
                                We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above. We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">6. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You can update your account settings or contact us directly to exercise these rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">7. Contact Us</h2>
                            <p>
                                If you have questions or comments about this policy, you may email us at support@hisaabhub.com or by post to:
                            </p>
                            <address className="mt-4 not-italic text-slate-400">
                                HisaabHub Financial Services<br />
                                4/225, Blauganj<br />
                                Agra, Uttar Pradesh, India
                            </address>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
