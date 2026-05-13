'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Calculator, Copy, CheckCircle2, PhoneCall, Sparkles,
    TrendingUp, TrendingDown, IndianRupee, Info, ClipboardCheck,
    ShieldCheck, Zap, AlertTriangle, Clock, Bell, ExternalLink,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtIN(n: number): string {
    if (isNaN(n) || n === 0) return '₹0.00';
    const fixed = n.toFixed(2);
    const [int, dec] = fixed.split('.');
    const last3 = int.slice(-3);
    const rest = int.slice(0, int.length - 3);
    const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
    return `₹${grouped}.${dec}`;
}

interface CalcResult {
    mode: 'add' | 'remove';
    baseAmount: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
    cgst: number;
    sgst: number;
}

function getDeadlineState() {
    const now = new Date();
    const day = now.getDate();
    if (day <= 20) {
        const deadline = new Date(now.getFullYear(), now.getMonth(), 20, 23, 59, 59);
        const secs = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));
        return {
            phase: 'safe' as const,
            d: Math.floor(secs / 86400),
            h: Math.floor((secs % 86400) / 3600),
            m: Math.floor((secs % 3600) / 60),
            s: secs % 60,
            penalty: 0,
            daysPassed: 0,
        };
    }
    const daysPassed = day - 20;
    return { phase: 'overdue' as const, d: 0, h: 0, m: 0, s: 0, penalty: daysPassed * 50, daysPassed };
}

// ── Sub-components ────────────────────────────────────────────────────────────

const ResultRow = ({ label, value, highlight, muted }: { label: string; value: string; highlight?: boolean; muted?: boolean }) => (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${highlight ? 'bg-primary/10 border border-primary/30' : muted ? '' : 'border-b border-white/5'}`}>
        <span className={`text-sm font-medium ${muted ? 'text-slate-500' : highlight ? 'text-white font-semibold' : 'text-slate-300'}`}>{label}</span>
        <span className={`font-bold tabular-nums ${highlight ? 'text-primary text-base' : muted ? 'text-slate-500 text-sm' : 'text-white text-sm'}`}>{value}</span>
    </div>
);

const Pad = ({ val, label }: { val: number; label: string }) => (
    <div className="flex-1 bg-black/40 rounded-xl py-2 text-center border border-white/5">
        <div className="text-xl font-extrabold text-primary tabular-nums">{String(val).padStart(2, '0')}</div>
        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const GSTCalculator: React.FC = () => {
    const GST_SLABS = [3, 5, 12, 18, 28];
    const [amount, setAmount] = useState('');
    const [selectedRate, setSelectedRate] = useState(18);
    const [result, setResult] = useState<CalcResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [mobile, setMobile] = useState('');
    const [callbackSent, setCallbackSent] = useState(false);
    const [mobileError, setMobileError] = useState('');
    const [dl, setDl] = useState(getDeadlineState());
    const leadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const id = setInterval(() => setDl(getDeadlineState()), 1000);
        return () => clearInterval(id);
    }, []);

    const calculate = useCallback((mode: 'add' | 'remove') => {
        const base = parseFloat(amount);
        if (isNaN(base) || base <= 0) return;
        const gstAmount = mode === 'add'
            ? base * (selectedRate / 100)
            : base - base * (100 / (100 + selectedRate));
        const baseAmount = mode === 'add' ? base : base - gstAmount;
        const totalAmount = mode === 'add' ? base + gstAmount : base;
        setResult({ mode, baseAmount, gstRate: selectedRate, gstAmount, totalAmount, cgst: gstAmount / 2, sgst: gstAmount / 2 });
    }, [amount, selectedRate]);

    const handleCopy = async () => {
        if (!result) return;
        const text = [
            'HisaabHub GST Calculation',
            `Mode: ${result.mode === 'add' ? 'Add GST (Exclusive)' : 'Remove GST (Inclusive)'}`,
            `Rate: ${result.gstRate}%`,
            `Base Amount : ${fmtIN(result.baseAmount)}`,
            `Total GST   : ${fmtIN(result.gstAmount)}`,
            `  CGST (${result.gstRate / 2}%): ${fmtIN(result.cgst)}`,
            `  SGST (${result.gstRate / 2}%): ${fmtIN(result.sgst)}`,
            `Net Amount  : ${fmtIN(result.totalAmount)}`,
        ].join('\n');
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleCallback = () => {
        if (!/^[6-9]\d{9}$/.test(mobile)) { setMobileError('Enter a valid 10-digit Indian mobile number.'); return; }
        setMobileError('');
        setCallbackSent(true);
    };

    const isReady = !!amount && parseFloat(amount) > 0;
    const netAmount = result?.totalAmount ?? 0;
    const showEWay = netAmount > 50000;

    return (
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-6" id="gst-calculator">

            {/* Section header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                    <Calculator className="w-3.5 h-3.5" /> Free GST Calculator · FY 2025-26
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                    Instant <span className="text-primary">GST Calculator</span>
                </h2>
                <p className="text-slate-400 text-sm mt-2">Add or remove GST · Indian format · CGST & SGST split · E-Way Bill alerts</p>
            </div>

            {/* GSTR-3B Deadline Banner */}
            {dl.phase === 'safe' ? (
                <div className="bg-dark-surface border border-primary/20 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 border border-primary/30 rounded-xl p-2 flex-shrink-0">
                            <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">⏳ GSTR-3B Deadline Tracker</p>
                            <p className="text-white font-semibold text-sm mb-2">File before the 20th to avoid late fees:</p>
                            <div className="flex gap-2">
                                <Pad val={dl.d} label="Days" />
                                <Pad val={dl.h} label="Hrs" />
                                <Pad val={dl.m} label="Min" />
                                <Pad val={dl.s} label="Sec" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-2 flex-shrink-0">
                            <Bell className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">🚨 Deadline Missed!</p>
                            <p className="text-white text-sm font-semibold">
                                Govt late fee: <span className="text-primary text-lg font-extrabold">₹{dl.penalty.toLocaleString('en-IN')}</span>
                                {' '}(₹50/day × {dl.daysPassed} days)
                            </p>
                            <button onClick={() => leadRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-2 text-xs font-bold text-primary underline underline-offset-2">
                                Get expert help to file now →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main 2-col grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ── LEFT: Calculator ── */}
                <div className="bg-dark-surface border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-primary via-yellow-200 to-primary" />
                    <div className="p-5 sm:p-6 space-y-5">

                        {/* Amount */}
                        <div>
                            <label htmlFor="gst-amount-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Base Amount</label>
                            <div className="relative flex items-center">
                                <IndianRupee className="absolute left-3.5 w-5 h-5 text-primary pointer-events-none" />
                                <input
                                    id="gst-amount-input"
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={e => { setAmount(e.target.value); setResult(null); }}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-4 text-white text-2xl font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        {/* Slabs */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GST Rate</label>
                            <div className="flex flex-wrap gap-2">
                                {GST_SLABS.map(rate => (
                                    <button key={rate} id={`gst-slab-${rate}`}
                                        onClick={() => { setSelectedRate(rate); setResult(null); }}
                                        className={`flex-1 min-w-[52px] py-2.5 rounded-full text-sm font-bold border transition-all duration-200 active:scale-95 ${selectedRate === rate
                                            ? 'bg-primary text-dark border-primary shadow-lg shadow-primary/20'
                                            : 'bg-black/40 border-white/10 text-slate-300 hover:border-primary/40 hover:text-white'
                                        }`}>
                                        {rate}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button id="btn-add-gst" onClick={() => calculate('add')} disabled={!isReady}
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-dark font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 text-sm">
                                <TrendingUp className="w-4 h-4" />
                                <span className="hidden sm:inline">Add GST</span>
                            </button>
                            <button id="btn-remove-gst" onClick={() => calculate('remove')} disabled={!isReady}
                                className="flex items-center justify-center gap-2 bg-dark-highlight hover:bg-white/10 border border-white/10 hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition-all active:scale-95 text-sm">
                                <TrendingDown className="w-4 h-4" />
                                <span className="hidden sm:inline">Remove GST</span>
                            </button>
                        </div>

                        {/* Results */}
                        {result && (
                            <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden" style={{ animation: 'slideUp 0.3s ease-out' }}>
                                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-white/3">
                                    <div className="flex items-center gap-1.5">
                                        <Info className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                            {result.mode === 'add' ? 'Exclusive' : 'Inclusive'} · {result.gstRate}% GST
                                        </span>
                                    </div>
                                    <button id="btn-copy-details" title="Copy breakdown" onClick={handleCopy}
                                        className={`p-1.5 rounded-lg border transition-all active:scale-95 ${copied ? 'bg-primary/20 text-primary border-primary/40' : 'bg-white/5 text-slate-400 hover:text-white border-white/10'}`}>
                                        {copied ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="p-2 space-y-0.5">
                                    <ResultRow label="Base Amount" value={fmtIN(result.baseAmount)} />
                                    <ResultRow label={`GST (${result.gstRate}%)`} value={fmtIN(result.gstAmount)} />
                                    <div className="pl-3 space-y-0.5">
                                        <ResultRow label={`CGST (${result.gstRate / 2}%)`} value={fmtIN(result.cgst)} muted />
                                        <ResultRow label={`SGST (${result.gstRate / 2}%)`} value={fmtIN(result.sgst)} muted />
                                    </div>
                                    <div className="pt-1">
                                        <ResultRow label={result.mode === 'add' ? 'Total (with GST)' : 'Original (incl. GST)'} value={fmtIN(result.totalAmount)} highlight />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {!result && (
                            <div className="flex items-center gap-2 bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-slate-500 text-xs">
                                <Info className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
                                Enter an amount and tap <TrendingUp className="w-3 h-3 inline mx-0.5 text-primary" /> or <TrendingDown className="w-3 h-3 inline mx-0.5" /> to see the breakdown.
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: E-Way warning + Lead gen ── */}
                <div className="space-y-5">

                    {/* E-Way Bill Warning */}
                    {showEWay && (
                        <div className="bg-dark-surface border border-primary/40 rounded-2xl p-4" style={{ animation: 'slideUp 0.3s ease-out' }}>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 border border-primary/30 rounded-xl p-2 flex-shrink-0 mt-0.5">
                                    <AlertTriangle className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-primary font-extrabold text-sm mb-1">⚠️ E-Way Bill Required</p>
                                    <p className="text-slate-300 text-xs leading-relaxed mb-3">
                                        Invoice exceeds <strong className="text-white">₹50,000</strong>. An <strong className="text-white">E-Way Bill</strong> is legally mandatory to transport these goods (GST Rule 138).
                                    </p>
                                    <button onClick={() => leadRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                        className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-xs px-4 py-2 rounded-lg transition-all active:scale-95">
                                        <ExternalLink className="w-3.5 h-3.5" /> Need an E-Way Bill? Get it in 5 mins.
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lead Gen Card */}
                    <div ref={leadRef} className="bg-dark-surface border border-primary/20 rounded-2xl overflow-hidden shadow-xl">
                        <div className="h-0.5 bg-gradient-to-r from-primary via-yellow-200 to-primary" />
                        <div className="p-5 sm:p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 border border-primary/30 rounded-xl p-2.5 flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <span className="inline-block text-xs font-extrabold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                                        Expert Offer · ₹499/month
                                    </span>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                                        Let Experts Handle Your GST.
                                    </h3>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed">
                                Certified CAs file your monthly GST returns starting at{' '}
                                <strong className="text-white">₹499/month</strong>. 100% accurate, on time — or we pay the penalty. <strong className="text-primary">We call back in 15 minutes.</strong>
                            </p>

                            <ul className="space-y-2.5">
                                {[
                                    { icon: ShieldCheck, text: 'CA-verified & 100% compliant filings' },
                                    { icon: Zap, text: 'On-time filing with automated reminders' },
                                    { icon: ClipboardCheck, text: 'GSTR-1, GSTR-3B, annual returns covered' },
                                ].map(({ icon: Icon, text }) => (
                                    <li key={text} className="flex items-center gap-2.5 text-sm text-slate-200">
                                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-1 flex-shrink-0">
                                            <Icon className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        {text}
                                    </li>
                                ))}
                            </ul>

                            {!callbackSent ? (
                                <div className="space-y-3 pt-1">
                                    <div>
                                        <div className="relative flex items-center">
                                            <PhoneCall className="absolute left-3.5 w-4 h-4 text-primary pointer-events-none" />
                                            <input
                                                id="callback-mobile-input"
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={10}
                                                placeholder="10-digit Mobile Number"
                                                value={mobile}
                                                onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setMobileError(''); }}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all text-sm font-medium"
                                                style={{ fontSize: 16 }}
                                            />
                                        </div>
                                        {mobileError && <p className="text-red-400 text-xs mt-1.5 ml-1">{mobileError}</p>}
                                    </div>
                                    <button
                                        id="btn-get-callback"
                                        onClick={handleCallback}
                                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-dark font-extrabold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] text-sm tracking-wide">
                                        <PhoneCall className="w-4 h-4" /> Get Free Callback
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-4 py-4">
                                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-bold text-sm">Request Received! 🎉</p>
                                        <p className="text-primary text-xs mt-0.5">Our expert will call you within 15 minutes.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GSTCalculator;
