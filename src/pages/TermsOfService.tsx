import { useEffect } from 'react';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-dark pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Terms of Service</h1>
                    <p className="text-slate-400 mb-8">Last Updated: November 24, 2025</p>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and HisaabHub ("we," "us" or "our"), concerning your access to and use of the HisaabHub website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">2. Services Provided</h2>
                            <p>
                                HisaabHub provides an online platform for income tax filing, GST registration and filing, and other financial services. We act as an intermediary to facilitate the filing of your tax returns with the Income Tax Department of India. We do not guarantee the acceptance of your return by the tax authorities, which is subject to their verification and processing.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">3. User Representations</h2>
                            <p className="mb-4">By using the Site, you represent and warrant that:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                <li>You are not a minor in the jurisdiction in which you reside.</li>
                                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">4. Payment and Fees</h2>
                            <p>
                                You agree to pay all fees and charges associated with your use of the Services in accordance with the pricing schedule available on the Site. All payments are non-refundable unless otherwise stated in our Refund Policy. We reserve the right to change our prices at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">5. Intellectual Property Rights</h2>
                            <p>
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                            <p>
                                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">7. Governing Law</h2>
                            <p>
                                These Terms shall be governed by and defined following the laws of India. HisaabHub and yourself irrevocably consent that the courts of Agra, Uttar Pradesh shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">8. Contact Us</h2>
                            <p>
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                            </p>
                            <address className="mt-4 not-italic text-slate-400">
                                HisaabHub Financial Services<br />
                                4/225, Blauganj<br />
                                Agra, Uttar Pradesh, India<br />
                                Email: support@hisaabhub.com
                            </address>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
