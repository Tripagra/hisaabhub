'use client';

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { createSupabaseClient } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, serviceName }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createSupabaseClient();
            const { error: dbError } = await supabase
                .from('service_inquiries')
                .insert({
                    service_name: serviceName,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message || null,
                });

            if (dbError) throw dbError;

            alert(`Thank you! We have received your inquiry for ${serviceName}.`);
            setFormData({ name: '', email: '', phone: '', message: '' });
            onClose();
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-dark-surface border border-primary/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <h3 className="text-xl font-bold text-white">{serviceName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-400 mb-6 text-sm">
                        Interested in {serviceName}? Fill out the form below and our team will get back to you.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                onChange={handleChange}
                                value={formData.name}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                onChange={handleChange}
                                value={formData.email}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                onChange={handleChange}
                                value={formData.phone}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Message (Optional)</label>
                            <textarea
                                name="message"
                                rows={3}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                onChange={handleChange}
                                value={formData.message}
                            ></textarea>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-dark font-bold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner />
                                    <span className="ml-2">Submitting...</span>
                                </>
                            ) : (
                                <>
                                    Submit Inquiry
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

export default ServiceModal;
