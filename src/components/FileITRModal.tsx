'use client';

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { createSupabaseClient } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface FileITRModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FileITRModal: React.FC<FileITRModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        pan: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createSupabaseClient();
            const { error: dbError } = await supabase
                .from('itr_requests')
                .insert({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    pan: formData.pan || null,
                });

            if (dbError) throw dbError;

            alert('Thank you! Our experts will contact you shortly.');
            setFormData({ name: '', email: '', phone: '', pan: '' });
            onClose();
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-dark-surface border border-primary/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <h3 className="text-xl font-bold text-white">File ITR with Us</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors focus:outline-none"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-400 mb-6 text-sm">
                        Fill in your details and our tax experts will get in touch with you to file your Income Tax Return accurately.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div>
                            <label htmlFor="pan" className="block text-sm font-medium text-slate-300 mb-1">
                                PAN Number (Optional)
                            </label>
                            <input
                                type="text"
                                id="pan"
                                name="pan"
                                value={formData.pan}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all uppercase"
                                placeholder="ABCDE1234F"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-dark font-bold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner />
                                    <span className="ml-2">Submitting...</span>
                                </>
                            ) : (
                                <>
                                    Submit Request
                                    <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FileITRModal;
