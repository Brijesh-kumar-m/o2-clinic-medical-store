import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, FileText, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';

const Legal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'privacy';

  const setActiveTab = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-txt-dark mb-2">Legal & Privacy</h1>
        <p className="text-txt-secondary">Transparency and security are at the core of our operations.</p>
      </div>

      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${tab === 'privacy' ? 'bg-brand-primary text-white shadow-lg' : 'bg-surface-light text-txt-secondary hover:bg-white hover:text-brand-primary'
            }`}
        >
          <Lock className="w-4 h-4" /> Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${tab === 'terms' ? 'bg-brand-primary text-white shadow-lg' : 'bg-surface-light text-txt-secondary hover:bg-white hover:text-brand-primary'
            }`}
        >
          <FileText className="w-4 h-4" /> Terms of Service
        </button>
      </div>

      <Card className="p-8 sm:p-12">
        {tab === 'privacy' ? (
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-txt-dark mb-6 flex items-center gap-2">
              <ShieldCheck className="text-brand-primary" /> Privacy Policy
            </h2>
            <p className="text-sm text-txt-secondary mb-4">Last Updated: February 18, 2026</p>

            <h3 className="text-lg font-bold text-txt-dark mt-6 mb-3">1. Information We Collect</h3>
            <p className="text-txt-secondary mb-4 leading-relaxed">
              We collect information that you provide directly to us, such as when you create an account, update your profile, place an order, or communicate with us. This includes:
            </p>
            <ul className="list-disc pl-5 text-txt-secondary mb-4 space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Professional credentials (Medical License Number, Drug License Number)</li>
              <li>Clinic/Pharmacy address and details</li>
              <li>Payment information (processed securely through third-party gateways)</li>
            </ul>

            <h3 className="text-lg font-bold text-txt-dark mt-6 mb-3">2. How We Use Your Information</h3>
            <p className="text-txt-secondary mb-4 leading-relaxed">
              We use the information we collect to operate, maintain, and improve our services, such as:
            </p>
            <ul className="list-disc pl-5 text-txt-secondary mb-4 space-y-1">
              <li>Processing and delivering your orders</li>
              <li>Verifying your professional credentials for B2B compliance</li>
              <li>Sending you order updates, security alerts, and support messages</li>
              <li>Personalizing your shopping experience</li>
            </ul>

            <h3 className="text-lg font-bold text-txt-dark mt-6 mb-3">3. Data Security</h3>
            <p className="text-txt-secondary mb-4 leading-relaxed">
              We implement industry-standard security measures to protect your personal and professional data. All sensitive transactions are encrypted using SSL technology.
            </p>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-txt-dark mb-6 flex items-center gap-2">
              <FileText className="text-brand-primary" /> Terms of Service
            </h2>
            <p className="text-sm text-txt-secondary mb-4">Last Updated: February 18, 2026</p>

            <h3 className="text-lg font-bold text-txt-dark mt-6 mb-3">1. Acceptance of Terms</h3>
            <p className="text-txt-secondary mb-4 leading-relaxed">
              By accessing or using the O2Clinic platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access the service.
            </p>

            <h3 className="text-lg font-bold text-txt-dark mt-6 mb-3">2. Eligibility</h3>
            <p className="text-txt-secondary mb-4 leading-relaxed">
              You must be a registered medical professional, clinic, pharmacy, or authorized healthcare distributor to use our B2B services. We reserve the right to verify credentials and suspend accounts that do not meet these criteria.
            </p>

            <h3 className="text-lg font-bold text-txt-dark mt-6 mb-3">3. Orders and Pricing</h3>
            <p className="text-txt-secondary mb-4 leading-relaxed">
              All prices are subject to change without notice. We make every effort to ensure accurate pricing, but errors may occur. We reserve the right to cancel orders arising from pricing errors. Bulk pricing tiers are applied automatically based on order volume.
            </p>

            <h3 className="text-lg font-bold text-txt-dark mt-6 mb-3">4. Intellectual Property</h3>
            <p className="text-txt-secondary mb-4 leading-relaxed">
              The O2Clinic name, logo, and all related content are the exclusive property of O2Clinic Medical Store and are protected by copyright and trademark laws.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Legal;
