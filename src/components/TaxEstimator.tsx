
import { useState, useEffect } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';

const TaxEstimator = () => {
    const [income, setIncome] = useState<number | ''>('');
    const [isSalaried, setIsSalaried] = useState(true);
    const [taxDetails, setTaxDetails] = useState({
        grossIncome: 0,
        standardDeduction: 0,
        taxableIncome: 0,
        taxPayable: 0,
        cess: 0,
        totalTax: 0,
    });

    const calculateTax = (incomeAmount: number, salaried: boolean) => {
        // FY 2024-25 (AY 2025-26) New Regime
        const STANDARD_DEDUCTION = salaried ? 75000 : 0;

        let grossIncome = incomeAmount;
        let taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION);
        let tax = 0;

        // Slabs
        // 0-3L: Nil
        // 3-7L: 5%
        // 7-10L: 10%
        // 10-12L: 15%
        // 12-15L: 20%
        // >15L: 30%

        if (taxableIncome <= 300000) {
            tax = 0;
        } else {
            // Rebate u/s 87A: If Taxable Income <= 7L, Tax is 0 (Rebate up to 25k)
            // Note: Marginal relief applies if income slightly exceeds 7L, but for "Quick Estimate" we stick to the basic rule or simple slab application.
            // However, for accuracy in 2025, if taxable income <= 7L, tax is 0.

            if (taxableIncome <= 700000) {
                tax = 0;
            } else {
                let remainingIncome = taxableIncome;

                // Slab 1: 0-3L (0%)
                remainingIncome -= 300000;

                // Slab 2: 3-7L (5%) -> 4L @ 5% = 20,000
                if (remainingIncome > 0) {
                    const slabAmount = Math.min(remainingIncome, 400000);
                    tax += slabAmount * 0.05;
                    remainingIncome -= slabAmount;
                }

                // Slab 3: 7-10L (10%) -> 3L @ 10% = 30,000
                if (remainingIncome > 0) {
                    const slabAmount = Math.min(remainingIncome, 300000);
                    tax += slabAmount * 0.10;
                    remainingIncome -= slabAmount;
                }

                // Slab 4: 10-12L (15%) -> 2L @ 15% = 30,000
                if (remainingIncome > 0) {
                    const slabAmount = Math.min(remainingIncome, 200000);
                    tax += slabAmount * 0.15;
                    remainingIncome -= slabAmount;
                }

                // Slab 5: 12-15L (20%) -> 3L @ 20% = 60,000
                if (remainingIncome > 0) {
                    const slabAmount = Math.min(remainingIncome, 300000);
                    tax += slabAmount * 0.20;
                    remainingIncome -= slabAmount;
                }

                // Slab 6: >15L (30%)
                if (remainingIncome > 0) {
                    tax += remainingIncome * 0.30;
                }
            }
        }

        // Cess 4%
        const cess = Math.round(tax * 0.04);
        const totalTax = Math.round(tax + cess);

        return {
            grossIncome,
            standardDeduction: STANDARD_DEDUCTION,
            taxableIncome,
            taxPayable: Math.round(tax),
            cess,
            totalTax,
        };
    };

    useEffect(() => {
        if (income && typeof income === 'number') {
            setTaxDetails(calculateTax(income, isSalaried));
        } else {
            setTaxDetails({
                grossIncome: 0,
                standardDeduction: isSalaried ? 75000 : 0,
                taxableIncome: 0,
                taxPayable: 0,
                cess: 0,
                totalTax: 0,
            });
        }
    }, [income, isSalaried]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setIncome('');
        } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setIncome(numValue);
            }
        }
    };

    return (
        <div className="py-16 bg-dark" id="tools">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-dark-surface to-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-10 text-white flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
                            <h2 className="text-3xl font-bold mb-4 text-primary">Quick Income Tax Estimator</h2>
                            <p className="text-slate-300 text-lg mb-8">
                                Calculate your estimated tax liability under the New Regime (FY 2024-25) in seconds.
                            </p>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-center">
                                    <div className="bg-primary/20 p-2 rounded-full mr-3 text-primary">
                                        <Calculator className="h-5 w-5" />
                                    </div>
                                    <span>Updated for FY 2024-25</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="bg-primary/20 p-2 rounded-full mr-3 text-primary">
                                        <RefreshCw className="h-5 w-5" />
                                    </div>
                                    <span>Includes Standard Deduction</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-10 bg-dark-surface border-l border-white/5">
                            <div className="space-y-6">
                                {/* Income Input */}
                                <div>
                                    <label htmlFor="income" className="block text-sm font-medium text-slate-400 mb-2">
                                        Annual Gross Income (₹)
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500 sm:text-sm">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="income"
                                            id="income"
                                            className="bg-black/50 border border-white/10 focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-lg text-white rounded-md py-3 placeholder-slate-600"
                                            placeholder="e.g. 1200000"
                                            value={income}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                {/* Salaried Toggle */}
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="isSalaried"
                                        checked={isSalaried}
                                        onChange={(e) => setIsSalaried(e.target.checked)}
                                        className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded bg-black/50"
                                    />
                                    <label htmlFor="isSalaried" className="text-slate-300 text-sm">
                                        I am a Salaried Employee (Standard Deduction ₹75,000)
                                    </label>
                                </div>

                                {/* Breakdown */}
                                <div className="bg-black/30 p-6 rounded-xl border border-white/5 space-y-3">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Gross Income</span>
                                        <span>₹ {taxDetails.grossIncome.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-success">
                                        <span>Standard Deduction</span>
                                        <span>- ₹ {taxDetails.standardDeduction.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-white font-medium pt-2 border-t border-white/10">
                                        <span>Taxable Income</span>
                                        <span>₹ {taxDetails.taxableIncome.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="pt-4 mt-2 border-t border-white/10">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-slate-400 font-medium">Total Tax Payable</span>
                                            <span className="text-xs text-slate-500">(Incl. 4% Cess)</span>
                                        </div>
                                        <div className="text-4xl font-bold text-primary">
                                            ₹ {taxDetails.totalTax.toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-primary text-dark font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                                    File Now & Save Tax
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxEstimator;
