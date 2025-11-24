

const TrustSignals = () => {
    return (
        <div className="bg-dark py-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-primary">1M+</span>
                        <span className="mt-2 text-sm font-medium text-slate-400">Returns Filed</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-primary">₹500Cr+</span>
                        <span className="mt-2 text-sm font-medium text-slate-400">Tax Saved</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-primary">4.8/5</span>
                        <span className="mt-2 text-sm font-medium text-slate-400">User Rating</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-primary">24/7</span>
                        <span className="mt-2 text-sm font-medium text-slate-400">Expert Support</span>
                    </div>
                </div>

                <div className="mt-12">
                    <p className="text-center text-sm font-semibold uppercase text-slate-600 tracking-wider">
                        Trusted by employees from
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-5 lg:grid-cols-5 opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500">
                        {/* Placeholder Logos */}
                        <div className="col-span-1 flex justify-center md:col-span-1">
                            <div className="h-8 text-xl font-bold text-slate-400">Google</div>
                        </div>
                        <div className="col-span-1 flex justify-center md:col-span-1">
                            <div className="h-8 text-xl font-bold text-slate-400">Microsoft</div>
                        </div>
                        <div className="col-span-1 flex justify-center md:col-span-1">
                            <div className="h-8 text-xl font-bold text-slate-400">Amazon</div>
                        </div>
                        <div className="col-span-1 flex justify-center md:col-span-1">
                            <div className="h-8 text-xl font-bold text-slate-400">Infosys</div>
                        </div>
                        <div className="col-span-1 flex justify-center md:col-span-1">
                            <div className="h-8 text-xl font-bold text-slate-400">TCS</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustSignals;
