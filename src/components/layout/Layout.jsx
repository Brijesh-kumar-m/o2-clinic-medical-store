import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './Header';
import Logo from '../ui/Logo';
import { Toaster } from 'react-hot-toast';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, CreditCard } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans text-txt-body">
      <Header />
      <main className="flex-grow pt-24"> {/* Added padding-top for fixed header */}
        <Outlet />
      </main>

      <footer className="bg-txt-primary text-white pt-16 pb-8 mt-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">

          {/* Brand Column */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Link to="/" className="block">
              <Logo variant="white" className="w-12 h-12" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Premium wholesale pharmaceutical platform for verified healthcare professionals.
            </p>

            {/* Owner / Founder Info */}
            <div className="pt-2 border-t border-white/10 mt-4 w-full">
              <p className="text-xs text-brand-primary uppercase tracking-widest font-bold mb-1">Medical Director</p>
              <p className="text-sm font-semibold text-white">Dr. Ashish Maurya</p>
            </div>

            <div className="flex gap-4 pt-2 justify-center md:justify-start">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand-primary">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Home</Link></li>
              <li><Link to="/products" className="hover:text-white hover:translate-x-1 transition-all inline-block">Browse Catalog</Link></li>
              <li><Link to="/products?filter=deals" className="hover:text-white hover:translate-x-1 transition-all inline-block">Daily Deals</Link></li>
              <li><Link to="/cart" className="hover:text-white hover:translate-x-1 transition-all inline-block">Bulk Order Cart</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand-primary">Account</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-white hover:translate-x-1 transition-all inline-block">Pharmacist Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-white hover:translate-x-1 transition-all inline-block">Clinic Dashboard</Link></li>
              <li><Link to="/orders" className="hover:text-white hover:translate-x-1 transition-all inline-block">Track Orders</Link></li>
              <li><Link to="/support" className="hover:text-white hover:translate-x-1 transition-all inline-block">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand-primary">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400 flex flex-col items-center md:items-start">
              <li className="flex items-start gap-3 text-left">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                <span>123 Medical Plaza, Health District,<br />Mumbai, MH 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                <span>support@o2clinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-slate-500">© 2026 O2Clinic. Licensed for pharmaceutical distribution.</p>
          <div className="flex gap-3 opacity-70 grayscale hover:grayscale-0 transition-all">
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-white">VISA</div>
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-white">MC</div>
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-white">UPI</div>
          </div>
        </div>
      </footer>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'bg-white text-txt-primary shadow-lg rounded-lg border border-surface-border',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0F172A',
          },
        }}
      />
    </div>
  );
};

export default Layout;
