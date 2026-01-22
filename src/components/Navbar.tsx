'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';

interface NavbarProps {
    onLogin: () => void;
    onRegister: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, onRegister }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleEnquiry = () => {
        window.location.href = 'tel:+919557352327';
    };

    const handleLogoClick = () => {
        if (pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            router.push('/');
            // Scroll happens automatically on navigation usually, but we can ensure it
            window.scrollTo(0, 0);
        }
    };

    const handleNavClick = (hash: string) => {
        setIsOpen(false);
        if (pathname !== '/') {
            router.push('/' + hash);
        } else {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex justify-between h-20 items-center">
                        {/* Logo */}
                        <div onClick={handleLogoClick} className="flex-shrink-0 flex items-center cursor-pointer">
                            <img
                                src="/assets/Group 26 (1).svg"
                                alt="HisaabHub - Accountancy Firm"
                                className="h-16 w-auto object-contain"
                            />
                        </div>

                        {/* Desktop Menu */}
                        <div className="flex space-x-8 items-center">
                            <button onClick={() => handleNavClick('#file-itr')} className="text-slate-300 hover:text-primary font-medium transition-colors">File ITR</button>
                            <button onClick={() => handleNavClick('#gst')} className="text-slate-300 hover:text-primary font-medium transition-colors">GST</button>
                            <button onClick={() => handleNavClick('#tools')} className="text-slate-300 hover:text-primary font-medium transition-colors">Tools</button>
                            <button onClick={() => handleNavClick('#learn')} className="text-slate-300 hover:text-primary font-medium transition-colors">Learn</button>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onLogin}
                                className="text-primary font-semibold hover:text-white px-4 py-2 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={onRegister}
                                className="bg-primary hover:bg-primary-hover text-dark font-bold px-5 py-2 rounded-full shadow-md hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5"
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex justify-between items-center h-16">
                        {/* Left: Hamburger Menu */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-300 hover:text-primary focus:outline-none p-2"
                            aria-label="Toggle menu"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Center: Logo */}
                        <div onClick={handleLogoClick} className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer">
                            <img
                                src="/assets/Group 26 (1).svg"
                                alt="HisaabHub"
                                className="h-12 w-auto object-contain"
                            />
                        </div>

                        {/* Right: Enquiry Button */}
                        <button
                            onClick={handleEnquiry}
                            className="bg-primary hover:bg-primary-hover text-dark font-bold px-3 py-1.5 rounded-full text-sm shadow-md transition-all flex items-center gap-1"
                        >
                            <Phone size={14} />
                            <span>Enquiry</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-dark-surface border-r border-primary/30 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <img
                        src="/assets/Group 26 (1).svg"
                        alt="HisaabHub"
                        className="h-12 w-auto object-contain"
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-white transition-colors p-2"
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="p-4 space-y-2">
                    {/* Navigation Links */}
                    <button
                        onClick={() => handleNavClick('#file-itr')}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-slate-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                        File ITR
                    </button>
                    <button
                        onClick={() => handleNavClick('#gst')}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-slate-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                        GST
                    </button>
                    <button
                        onClick={() => handleNavClick('#tools')}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-slate-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                        Tools
                    </button>
                    <button
                        onClick={() => handleNavClick('#learn')}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-slate-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                        Learn
                    </button>

                    {/* Divider */}
                    <div className="border-t border-white/10 my-4"></div>

                    {/* Auth Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                onLogin();
                                setIsOpen(false);
                            }}
                            className="w-full text-center text-primary font-semibold border border-primary/30 rounded-lg py-3 hover:bg-primary/10 transition-all"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                onRegister();
                                setIsOpen(false);
                            }}
                            className="w-full text-center bg-primary text-dark font-bold rounded-lg py-3 hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
