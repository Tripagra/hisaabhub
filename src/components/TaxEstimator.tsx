'use client';

import { useState, useMemo } from 'react';
import { Calculator, IndianRupee, Info, TrendingDown, Zap, ChevronDown, ChevronUp } from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtIN(n: number) {
    if (!n) return '₹0';
    const [i] = n.toFixed(0).split('.');
    const last3 = i.slice(-3);
    const rest = i.slice(0, i.length - 3);
    const fmt = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
    return `₹${fmt}`;
}

function fmtL(n: number) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 2)}L`;
    return fmtIN(n);
}

// ── Tax Engines ───────────────────────────────────────────────────────────────

const NEW_SLABS = [
    { from: 0,       to: 400000,  rate: 0 },
    { from: 400000,  to: 800000,  rate: 0.05 },
    { from: 800000,  to: 1200000, rate: 0.10 },
    { from: 1200000, to: 1600000, rate: 0.15 },
    { from: 1600000, to: 2000000, rate: 0.20 },
    { from: 2000000, to: 2400000, rate: 0.25 },
    { from: 2400000, to: Infinity, rate: 0.30 },
];

const OLD_SLABS = [
    { from: 0,       to: 250000,  rate: 0 },
    { from: 250000,  to: 500000,  rate: 0.05 },
    { from: 500000,  to: 1000000, rate: 0.20 },
    { from: 1000000, to: Infinity, rate: 0.30 },
];

function calcSlabs(taxable: number, slabs: typeof NEW_SLABS) {
    let tax = 0;
    const breakdown: { label: string; amount: number; tax: number; rate: number }[] = [];
    for (const s of slabs) {
        if (taxable <= s.from) break;
        const chunk = Math.min(taxable, s.to === Infinity ? taxable : s.to) - s.from;
        const t = chunk * s.rate;
        tax += t;
        if (chunk > 0) breakdown.push({
            label: s.to === Infinity ? `Above ${fmtL(s.from)}` : `${fmtL(s.from)} – ${fmtL(s.to)}`,
            amount: chunk, tax: t, rate: s.rate * 100,
        });
    }
    return { tax, breakdown };
}

interface RegimeResult {
    grossIncome: number;
    deductions: number;
    taxableIncome: number;
    taxBeforeRebate: number;
    rebate87A: number;
    taxAfterRebate: number;
    surcharge: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
    breakdown: { label: string; amount: number; tax: number; rate: number }[];
}

function calcNew(gross: number, isSalaried: boolean): RegimeResult {
    const stdDed = isSalaried ? 75000 : 0;
    const deductions = stdDed;
    const taxableIncome = Math.max(0, gross - deductions);
    const { tax: taxBefore, breakdown } = calcSlabs(taxableIncome, NEW_SLABS);
    const rebate87A = taxableIncome <= 1200000 ? Math.min(taxBefore, 60000) : 0;
    const taxAfterRebate = Math.max(0, taxBefore - rebate87A);
    const surcharge = taxAfterRebate > 5000000 ? taxAfterRebate * (taxAfterRebate > 20000000 ? 0.25 : taxAfterRebate > 10000000 ? 0.15 : 0.10) : 0;
    const cess = Math.round((taxAfterRebate + surcharge) * 0.04);
    const totalTax = Math.round(taxAfterRebate + surcharge + cess);
    return { grossIncome: gross, deductions, taxableIncome, taxBeforeRebate: Math.round(taxBefore), rebate87A: Math.round(rebate87A), taxAfterRebate: Math.round(taxAfterRebate), surcharge: Math.round(surcharge), cess, totalTax, effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0, breakdown };
}

function calcOld(gross: number, isSalaried: boolean, ded80C: number, ded80D: number, hra: number): RegimeResult {
    const stdDed = isSalaried ? 50000 : 0;
    const deductions = stdDed + Math.min(ded80C, 150000) + Math.min(ded80D, 25000) + hra;
    const taxableIncome = Math.max(0, gross - deductions);
    const { tax: taxBefore, breakdown } = calcSlabs(taxableIncome, OLD_SLABS);
    const rebate87A = taxableIncome <= 500000 ? Math.min(taxBefore, 12500) : 0;
    const taxAfterRebate = Math.max(0, taxBefore - rebate87A);
    const surcharge = taxAfterRebate > 5000000 ? taxAfterRebate * (taxAfterRebate > 20000000 ? 0.25 : taxAfterRebate > 10000000 ? 0.15 : 0.10) : 0;
    const cess = Math.round((taxAfterRebate + surcharge) * 0.04);
    const totalTax = Math.round(taxAfterRebate + surcharge + cess);
    return { grossIncome: gross, deductions, taxableIncome, taxBeforeRebate: Math.round(taxBefore), rebate87A: Math.round(rebate87A), taxAfterRebate: Math.round(taxAfterRebate), surcharge: Math.round(surcharge), cess, totalTax, effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0, breakdown };
}

// ── Sub-components ────────────────────────────────────────────────────────────

const Row = ({ label, value, green, bold, big }: { label: string; value: string; green?: boolean; bold?: boolean; big?: boolean }) => (
    <div className={`flex justify-between items-center py-1.5 ${bold ? 'border-t border-white/10 mt-1 pt-2.5' : ''}`}>
        <span className={`text-sm ${bold ? 'text-slate-200 font-semibold' : 'text-slate-400'}`}>{label}</span>
        <span className={`tabular-nums font-bold ${big ? 'text-2xl text-primary' : green ? 'text-emerald-400 text-sm' : 'text-white text-sm'}`}>{value}</span>
    </div>
);

const NumberInput = ({ id, label, value, onChange, prefix = '₹', placeholder = '0' }: {
    id: string; label: string; value: string; onChange: (v: string) => void; prefix?: string; placeholder?: string;
}) => (
    <div>
        <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
        <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-500 text-sm font-medium">{prefix}</span>
            <input id={id} type="number" inputMode="decimal" min="0" placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-white text-sm font-semibold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all" />
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export default function TaxEstimator() {
    const [income, setIncome] = useState('');
    const [isSalaried, setIsSalaried] = useState(true);
    const [ded80C, setDed80C] = useState('');
    const [ded80D, setDed80D] = useState('');
    const [hra, setHra] = useState('');
    const [showSlabs, setShowSlabs] = useState(false);
    const [activeRegime, setActiveRegime] = useState<'new' | 'old'>('new');

    const gross = parseFloat(income) || 0;

    const newResult = useMemo(() => calcNew(gross, isSalaried), [gross, isSalaried]);
    const oldResult = useMemo(() => calcOld(gross, isSalaried, parseFloat(ded80C) || 0, parseFloat(ded80D) || 0, parseFloat(hra) || 0), [gross, isSalaried, ded80C, ded80D, hra]);

    const saving = oldResult.totalTax - newResult.totalTax;
    const betterRegime = saving >= 0 ? 'New' : 'Old';
    const shown = activeRegime === 'new' ? newResult : oldResult;

    return (
        <div className="py-12 sm:py-16 bg-dark" id="tools">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                        <Zap className="w-3.5 h-3.5" />FY 2025-26 · AY 2026-27
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">
                        Income Tax <span className="text-primary">Estimator</span>
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        Compare New vs Old regime with Budget 2025 slabs · Rebate u/s 87A · 4% Cess
                    </p>
                </div>

                <div className="bg-gradient-to-br from-dark-surface to-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3">

                        {/* ─ LEFT: Inputs ─ */}
                        <div className="lg:col-span-1 p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/5 space-y-5">
                            <div>
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-yellow-200 to-primary" />
                                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                    <IndianRupee className="w-3.5 h-3.5" />Income Details
                                </p>
                                <NumberInput id="income" label="Annual Gross Income" value={income} onChange={setIncome} placeholder="e.g. 1200000" />
                            </div>

                            {/* Salaried toggle */}
                            <button
                                onClick={() => setIsSalaried(s => !s)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all ${isSalaried ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-white/3 border-white/10 text-slate-400 hover:border-white/20'}`}
                            >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSalaried ? 'bg-primary border-primary' : 'border-slate-500'}`}>
                                    {isSalaried && <span className="text-dark text-xs font-black">✓</span>}
                                </div>
                                <span>Salaried Employee</span>
                                <span className="ml-auto text-xs opacity-70">{isSalaried ? '₹75K / ₹50K deduction' : 'No std. deduction'}</span>
                            </button>

                            {/* Old regime deductions */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <TrendingDown className="w-3 h-3" />Old Regime Deductions
                                </p>
                                <NumberInput id="ded80c" label="80C (Max ₹1.5L)" value={ded80C} onChange={setDed80C} placeholder="0" />
                                <NumberInput id="ded80d" label="80D Medical (Max ₹25K)" value={ded80D} onChange={setDed80D} placeholder="0" />
                                <NumberInput id="hra" label="HRA / Other Exemptions" value={hra} onChange={setHra} placeholder="0" />
                            </div>

                            {/* Recommendation badge */}
                            {gross > 0 && (
                                <div className={`rounded-xl p-3 border text-xs font-semibold flex items-center gap-2 ${betterRegime === 'New' ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400' : 'bg-blue-950/50 border-blue-500/30 text-blue-400'}`}>
                                    <Zap className="w-4 h-4 flex-shrink-0" />
                                    <span><strong>{betterRegime} Regime</strong> saves {fmtIN(Math.abs(saving))} for you</span>
                                </div>
                            )}
                        </div>

                        {/* ─ RIGHT: Results ─ */}
                        <div className="lg:col-span-2 p-6 sm:p-7 flex flex-col gap-6">

                            {/* Regime switcher */}
                            <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                                {(['new', 'old'] as const).map(r => (
                                    <button key={r} onClick={() => setActiveRegime(r)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeRegime === r ? 'bg-primary text-dark shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                        {r === 'new' ? '🆕 New Regime (Default)' : '📋 Old Regime'}
                                    </button>
                                ))}
                            </div>

                            {/* Key numbers */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: 'Gross Income', val: gross },
                                    { label: 'Deductions', val: shown.deductions, green: true },
                                    { label: 'Taxable Income', val: shown.taxableIncome },
                                    { label: 'Tax Payable', val: shown.totalTax, primary: true },
                                ].map(({ label, val, green, primary }) => (
                                    <div key={label} className={`rounded-xl p-3 border text-center ${primary ? 'bg-primary/10 border-primary/30' : 'bg-white/3 border-white/8'}`}>
                                        <div className={`text-lg sm:text-xl font-extrabold tabular-nums ${primary ? 'text-primary' : green ? 'text-emerald-400' : 'text-white'}`}>
                                            {fmtIN(val)}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5 font-medium">{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Breakdown */}
                            <div className="bg-black/30 rounded-xl border border-white/5 p-4 space-y-1">
                                <Row label="Tax Before Rebate" value={fmtIN(shown.taxBeforeRebate)} />
                                {shown.rebate87A > 0 && <Row label="Rebate u/s 87A" value={`− ${fmtIN(shown.rebate87A)}`} green />}
                                {shown.surcharge > 0 && <Row label="Surcharge" value={fmtIN(shown.surcharge)} />}
                                <Row label="Education Cess (4%)" value={fmtIN(shown.cess)} />
                                <Row label="Total Tax Payable" value={fmtIN(shown.totalTax)} bold big />
                                <div className="text-right text-xs text-slate-500 pt-1">
                                    Effective Rate: {shown.effectiveRate.toFixed(2)}%
                                </div>
                            </div>

                            {/* Slab breakdown toggle */}
                            {gross > 0 && shown.breakdown.length > 0 && (
                                <div>
                                    <button onClick={() => setShowSlabs(s => !s)}
                                        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-primary transition-colors mb-3">
                                        <Info className="w-3.5 h-3.5" />
                                        {showSlabs ? 'Hide' : 'Show'} Slab Breakdown
                                        {showSlabs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                    {showSlabs && (
                                        <div className="space-y-2 animate-[slideUp_0.3s_ease-out]">
                                            {shown.breakdown.map((s, i) => (
                                                <div key={i} className="flex items-center gap-3 text-xs">
                                                    <span className="text-slate-500 w-36 flex-shrink-0">{s.label}</span>
                                                    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                                                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (s.tax / (shown.taxBeforeRebate || 1)) * 100)}%` }} />
                                                    </div>
                                                    <span className="text-slate-400 w-8 text-right">{s.rate}%</span>
                                                    <span className="text-white font-semibold w-24 text-right tabular-nums">{fmtIN(s.tax)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Slab reference */}
                            <div className="rounded-xl border border-white/8 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/3 border-b border-white/8">
                                    <Calculator className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        {activeRegime === 'new' ? 'New Regime Slabs — FY 2025-26' : 'Old Regime Slabs — FY 2025-26'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x divide-y divide-white/5">
                                    {(activeRegime === 'new' ? NEW_SLABS : OLD_SLABS).map((s, i) => (
                                        <div key={i} className="px-3 py-2 flex justify-between items-center">
                                            <span className="text-xs text-slate-400">{s.to === Infinity ? `>${fmtL(s.from)}` : `${fmtL(s.from)}–${fmtL(s.to)}`}</span>
                                            <span className={`text-xs font-bold ${s.rate === 0 ? 'text-emerald-400' : s.rate >= 0.3 ? 'text-red-400' : 'text-primary'}`}>{(s.rate * 100).toFixed(0)}%</span>
                                        </div>
                                    ))}
                                    {activeRegime === 'new' && (
                                        <div className="px-3 py-2 col-span-2 sm:col-span-3 bg-emerald-950/30 border-t border-emerald-500/20">
                                            <span className="text-xs text-emerald-400 font-semibold">✓ 87A Rebate: Income ≤ ₹12L → Zero tax · Salaried: Nil up to ₹12.75L</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
