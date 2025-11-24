import { useEffect } from 'react';

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-dark pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Refund Policy</h1>
                    <p className="text-slate-400 mb-8">Last Updated: November 24, 2025</p>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">1. General Policy</h2>
                            <p>
                                At HisabHub, we strive to ensure 100% customer satisfaction. However, if you are not satisfied with our services, we are here to help. This Refund Policy outlines the circumstances under which you may be eligible for a refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">2. Eligibility for Refund</h2>
                            <p className="mb-4">You may be eligible for a refund if:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>You have made a duplicate payment for the same service.</li>
                                <li>The service was not delivered within the promised timeframe due to an error on our part.</li>
                                <li>We are unable to process your application due to technical issues on our platform.</li>
                                <li>You cancel your request before our team has started processing your application or assigned an expert to your case.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">3. Non-Refundable Scenarios</h2>
                            <p className="mb-4">Refunds will NOT be processed in the following cases:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>If the tax return has already been filed with the government portal.</li>
                                <li>If the delay or rejection is due to incorrect or incomplete information provided by you.</li>
                                <li>If the government portal is down or facing technical issues (we will file as soon as it is back up).</li>
                                <li>If you change your mind after the service has been substantially performed.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">4. Refund Process</h2>
                            <p>
                                To request a refund, please email us at support@hisabhub.com with your order details and the reason for the refund. Our team will review your request within 3-5 business days. If approved, the refund will be processed to your original method of payment within 7-10 business days.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions about our Refund Policy, please contact us:
                            </p>
                            <address className="mt-4 not-italic text-slate-400">
                                HisabHub Financial Services<br />
                                4/225, Blauganj<br />
                                Agra, Uttar Pradesh, India<br />
                                Email: support@hisabhub.com
                            </address>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
