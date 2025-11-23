import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'register') {
                // Register user with Supabase Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });

                if (authError) throw authError;

                // Store additional user info in users table
                if (authData.user) {
                    const { error: dbError } = await supabase
                        .from('users')
                        .insert([
                            {
                                id: authData.user.id,
                                email: formData.email,
                                name: formData.name,
                                phone: formData.phone,
                                created_at: new Date().toISOString(),
                            }
                        ]);

                    if (dbError) throw dbError;
                }

                alert('Registration successful! Please check your email to verify your account.');
            } else {
                // Login user
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (loginError) throw loginError;

                alert('Successfully Logged In!');
            }

            // Reset form and close modal
            setFormData({ name: '', email: '', phone: '', password: '' });
            onClose();
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-dark-surface border border-primary/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Tabs */}
                    <div className="flex mb-6 bg-black/50 rounded-lg p-1">
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'login' ? 'bg-primary text-dark shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                            onClick={() => setMode('login')}
                        >
                            Login
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'register' ? 'bg-primary text-dark shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                            onClick={() => setMode('register')}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                onChange={handleChange}
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
                            className="w-full mt-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-dark font-bold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner />
                                    <span className="ml-2">Processing...</span>
                                </>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Login' : 'Register'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
