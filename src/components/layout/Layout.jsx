import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './Header';
import Logo from '../ui/Logo';
import { Toaster } from 'react-hot-toast';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Layout = () => {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    toast.success('Successfully subscribed to our newsletter!');
    setEmail('');
  };
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans text-txt-body">
      <Header />
      <main className="flex-grow pt-12 lg:pt-14"> {/* Further reduced vertical gap */}
        <Outlet />
      </main>

      <footer className="relative bg-txt-primary text-white mt-24 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-secondary/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 relative z-10">

          {/* Top Section: Newsletter & Brand */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
            <div className="lg:pr-12">
              <Link to="/" className="inline-block mb-6">
                <Logo variant="white" className="w-14 h-14" />
              </Link>
              <h2 className="text-4xl font-black tracking-tight leading-tight text-white mb-6">
                Empowering Healthcare <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-blue-400">
                  One Order at a Time.
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Join over <span className="text-white font-bold">5,000+</span> clinics and pharmacies <br />
                streamlining their supply chain with O2Clinic.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10 relative group hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Mail className="w-24 h-24 text-white rotate-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Subscribe to our Newsletter</h3>
              <p className="text-slate-400 mb-6">Get weekly wholesale price alerts & medical news.</p>
              <form className="flex flex-col sm:flex-row gap-3 relative z-10" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
                />
                <button className="bg-white text-brand-primary font-bold px-8 py-4 rounded-xl hover:bg-brand-secondary hover:text-white transition-all shadow-lg hover:shadow-brand-secondary/20 whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 my-12"></div>

          {/* Middle Section: Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

            {/* Column 1 */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-white">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Home</Link></li>
                <li><Link to="/products" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Browse Catalog</Link></li>
                <li><Link to="/products?filter=deals" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Daily Deals</Link></li>
                <li><Link to="/cart" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Bulk Cart</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-white">Account</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Login / Register</Link></li>
                <li><Link to="/dashboard" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">My Dashboard</Link></li>
                <li><Link to="/orders" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Track Orders</Link></li>
                <li><Link to="/wishlist" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">My Wishlist</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-white">Support</h4>
              <ul className="space-y-4">
                <li><Link to="/support" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Help Center</Link></li>
                <li><Link to="/legal?tab=privacy" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Privacy Policy</Link></li>
                <li><Link to="/legal?tab=terms" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">Terms of Service</Link></li>
                <li><Link to="/support#faq" className="text-slate-400 hover:text-brand-secondary transition-colors inline-block hover:translate-x-1 duration-200">FAQs</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-white">Contact Us</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="text-sm text-slate-400 group-hover:text-white transition-colors">
                    <p className="font-semibold text-white mb-1">Headquarters</p>
                    123 Medical Plaza, Health District,<br />Mumbai, MH 400001
                  </div>
                </li>
                <li className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="text-sm text-slate-400 group-hover:text-white transition-colors">
                    <p className="font-semibold text-white mb-1">Phone Support</p>
                    <a href="tel:+9118001234567">+91 1800-123-4567</a>
                  </div>
                </li>
                <li className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="text-sm text-slate-400 group-hover:text-white transition-colors">
                    <p className="font-semibold text-white mb-1">Email Us</p>
                    <a href="mailto:support@o2clinic.com">support@o2clinic.com</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 my-12"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-slate-500">
              <span className="font-medium text-slate-400">© 2026 O2Clinic</span>
              <span className="hidden md:inline w-1 h-1 bg-slate-700 rounded-full"></span>
              <span>Built by <strong className="text-white">Antigravity AI</strong></span>
              <span className="hidden md:inline w-1 h-1 bg-slate-700 rounded-full"></span>
              <span>Medical Director: <strong className="text-white">Dr. Ashish Maurya</strong></span>
            </div>

            <div className="flex items-center gap-6">
              {/* Social Icons */}
              <div className="flex gap-2">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white hover:text-brand-primary hover:-translate-y-1 transition-all duration-300">
                    <Icon size={18} />
                  </a>
                ))}
              </div>

              {/* Back to Top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-brand-primary text-white font-semibold transition-all group"
              >
                <span>Top</span>
                <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
