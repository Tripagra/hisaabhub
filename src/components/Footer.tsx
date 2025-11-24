
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-4">HisabHub</h3>
                        <p className="text-slate-400 mb-6">
                            India's most trusted tax filing and financial planning platform. Making taxes simple, accurate, and stress-free for everyone.
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
                            <li><a href="#" className="hover:text-primary transition-colors">E-Filing Income Tax</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">GST Registration</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">GST Filing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Tax Planning</a></li>

                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 mt-1 text-primary" />
                                <span>123, Financial District, Gachibowli, Hyderabad, Telangana 500032</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 mr-3 text-primary" />
                                <span>+91 1800-123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 text-primary" />
                                <span>support@hisabhub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} HisabHub Financial Services Pvt Ltd. All rights reserved.</p>
                    <p className="mt-2">
                        Disclaimer: HisabHub is an authorized E-Return Intermediary. Tax estimates are indicative.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
