'use client';

import React, { useState } from 'react';
import { X, MessageCircle, ShieldCheck } from 'lucide-react';

interface EWayBillModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EWayBillModal: React.FC<EWayBillModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        mobile: '',
        supplierGstin: '',
        buyerGstin: '',
        invoiceNo: '',
        invoiceDate: '',
        vehicleNo: '',
        dispatchPin: '',
        deliveryPin: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your backend or trigger a WhatsApp API
        const text = `E-Way Bill Request:%0A- Mobile: ${formData.mobile}%0A- Supplier: ${formData.supplierGstin}%0A- Buyer: ${formData.buyerGstin}%0A- Inv No: ${formData.invoiceNo}%0A- Date: ${formData.invoiceDate}%0A- Vehicle: ${formData.vehicleNo}%0A- Dispatch PIN: ${formData.dispatchPin}%0A- Delivery PIN: ${formData.deliveryPin}`;
        window.open(`https://wa.me/919557352327?text=${text}`, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                
                {/* Header */}
                <div className="flex justify-between items-start p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">Express E-Way Bill Generator</h3>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed max-w-md">
                            Enter details below. Our team will generate your E-Way Bill PDF and WhatsApp it to you in 5 minutes.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0">
                        <X size={20} />
                    </button>
                </div>

                {/* Body / Form */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                    <div className="space-y-4 sm:space-y-5">
                        
                        {/* Mobile */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">WhatsApp Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile"
                                required
                                maxLength={10}
                                placeholder="10-digit mobile number"
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                onChange={handleChange}
                                value={formData.mobile}
                            />
                        </div>

                        {/* GSTINs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Supplier GSTIN</label>
                                <input
                                    type="text"
                                    name="supplierGstin"
                                    required
                                    maxLength={15}
                                    placeholder="15-char GSTIN"
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 uppercase font-medium"
                                    onChange={(e) => setFormData({...formData, supplierGstin: e.target.value.toUpperCase()})}
                                    value={formData.supplierGstin}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Buyer GSTIN</label>
                                <input
                                    type="text"
                                    name="buyerGstin"
                                    required
                                    maxLength={15}
                                    placeholder="15-char GSTIN"
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 uppercase font-medium"
                                    onChange={(e) => setFormData({...formData, buyerGstin: e.target.value.toUpperCase()})}
                                    value={formData.buyerGstin}
                                />
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Invoice Number</label>
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    required
                                    placeholder="e.g. INV-2026-01"
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                    onChange={handleChange}
                                    value={formData.invoiceNo}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Invoice Date</label>
                                <input
                                    type="date"
                                    name="invoiceDate"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                                    onChange={handleChange}
                                    value={formData.invoiceDate}
                                />
                            </div>
                        </div>

                        {/* Transport */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Vehicle Number / Transporter ID</label>
                            <input
                                type="text"
                                name="vehicleNo"
                                required
                                placeholder="e.g. MH 12 AB 1234"
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 uppercase font-medium"
                                onChange={(e) => setFormData({...formData, vehicleNo: e.target.value.toUpperCase()})}
                                value={formData.vehicleNo}
                            />
                        </div>

                        {/* Distance (PINs) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Dispatch PIN Code</label>
                                <input
                                    type="text"
                                    name="dispatchPin"
                                    required
                                    maxLength={6}
                                    placeholder="6-digit PIN"
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                    onChange={(e) => setFormData({...formData, dispatchPin: e.target.value.replace(/\D/g, '')})}
                                    value={formData.dispatchPin}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Delivery PIN Code</label>
                                <input
                                    type="text"
                                    name="deliveryPin"
                                    required
                                    maxLength={6}
                                    placeholder="6-digit PIN"
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                    onChange={(e) => setFormData({...formData, deliveryPin: e.target.value.replace(/\D/g, '')})}
                                    value={formData.deliveryPin}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer / CTA */}
                    <div className="mt-8 pt-5 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold text-gray-600 bg-gray-50 py-2 rounded-lg">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span>⚡ Govt approved. ₹99 per bill. Pay only AFTER you receive the PDF.</span>
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-[#25D366] hover:bg-[#1ebd5c] text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-base"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Send Request via WhatsApp
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EWayBillModal;
