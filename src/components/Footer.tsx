import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-4">HisaabHub</h3>
                        <p className="text-slate-400 mb-6">
                            India&apos;s most trusted tax filing and financial planning platform. Making taxes simple, accurate, and stress-free for everyone.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li><Link href="/#file-itr" className="hover:text-primary transition-colors">E-Filing Income Tax</Link></li>
                            <li><Link href="/#gst" className="hover:text-primary transition-colors">GST Registration</Link></li>
                            <li><Link href="/#gst" className="hover:text-primary transition-colors">GST Filing</Link></li>
                            <li><Link href="/#tools" className="hover:text-primary transition-colors">Tax Planning</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <span>4/225, Blauganj, Agra, Uttar Pradesh</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                                <span>+91 95573 52327</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                                <span>support@hisaabhub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} HisaabHub Financial Services Pvt Ltd. All rights reserved.</p>
                    <p className="mt-2">
                        Disclaimer: HisaabHub is an authorized E-Return Intermediary. Tax estimates are indicative.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
