import React, { useState, useEffect, useMemo } from 'react';
import { supabase, isMockMode } from '../lib/supabase';
import BloodTestCard from '../components/features/BloodTestCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Search, X, Activity, Droplet, Microscope, Stethoscope,
  Tag, Zap, Clock, ChevronRight, Flame, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────
   Mock Blood Tests — extended with mrp + discount fields
───────────────────────────────────────────────────────── */
const MOCK_BLOOD_TESTS = [
  {
    id: 'bt-1', test_name: 'Complete Blood Count (CBC)',
    category: 'General', price: 399, mrp: 499, discount: 20,
    preparation: 'No fasting required', sample_type: 'Blood',
    report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: true,
  },
  {
    id: 'bt-2', test_name: 'Lipid Profile',
    category: 'Heart', price: 699, mrp: 899, discount: 22,
    preparation: '9–12 hours fasting required', sample_type: 'Blood',
    report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: true,
  },
  {
    id: 'bt-3', test_name: 'Thyroid Profile (T3, T4, TSH)',
    category: 'Hormonal', price: 750, mrp: null, discount: 0,
    preparation: 'No fasting required', sample_type: 'Blood',
    report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: false,
  },
  {
    id: 'bt-4', test_name: 'Diabetes Screen (HbA1c)',
    category: 'Diabetes', price: 449, mrp: 550, discount: 18,
    preparation: 'No fasting required', sample_type: 'Blood',
    report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: true,
  },
  {
    id: 'bt-5', test_name: 'Liver Function Test (LFT)',
    category: 'General', price: 950, mrp: null, discount: 0,
    preparation: 'No fasting required', sample_type: 'Blood',
    report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: false,
  },
  {
    id: 'bt-6', test_name: 'Kidney Function Test (KFT)',
    category: 'General', price: 699, mrp: 850, discount: 18,
    preparation: 'No fasting required', sample_type: 'Blood',
    report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: false,
  },
  {
    id: 'bt-7', test_name: 'Vitamin D (25-OH)',
    category: 'Supplements', price: 999, mrp: 1250, discount: 20,
    preparation: 'No fasting required', sample_type: 'Blood',
    report_time: '48 Hours', lab_name: 'MediTrust Diagnostics', featured: true,
  },
  {
    id: 'bt-8', test_name: 'Iron Profile',
    category: 'General', price: 799, mrp: null, discount: 0,
    preparation: 'No fasting required', sample_type: 'Blood',
    report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: false,
  },
  {
    id: 'bt-9', test_name: 'Urine Routine & Microscopy',
    category: 'General', price: 199, mrp: 299, discount: 33,
    preparation: 'Morning sample preferred', sample_type: 'Urine',
    report_time: '12 Hours', lab_name: 'MediTrust Diagnostics', featured: false,
  },
  {
    id: 'bt-10', test_name: 'Vitamin B12',
    category: 'Supplements', price: 649, mrp: 799, discount: 19,
    preparation: 'No fasting required', sample_type: 'Blood',
    report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: false,
  },
];

/* ─────────────────────────────────────────────────────────
   Offer Banner Component
───────────────────────────────────────────────────────── */
const OfferBanner = () => (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-6 mb-10 shadow-2xl shadow-red-500/20">
    {/* Decorative blobs */}
    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
    <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-orange-400/30 blur-2xl pointer-events-none" />

    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
      {/* Left: Text */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner border border-white/20">
          <Zap className="w-7 h-7 text-yellow-300 fill-yellow-300" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest">Limited Time</span>
            <span className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-300/30 text-yellow-200 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              <Clock className="w-2.5 h-2.5" /> Offer
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
            Up to <span className="text-yellow-300">33% OFF</span> on Diagnostic Tests
          </h3>
          <p className="text-sm text-red-100 font-medium mt-0.5">
            Book today — certified lab results in 12–48 hours, doorstep sample pickup free.
          </p>
        </div>
      </div>

      {/* Right: Stats */}
      <div className="flex sm:flex-col gap-4 sm:gap-2 shrink-0">
        <div className="text-center sm:text-right">
          <p className="text-2xl font-black text-white">₹199</p>
          <p className="text-[10px] text-red-200 font-bold uppercase tracking-tight">Tests Starting At</p>
        </div>
        <div className="hidden sm:block h-px bg-white/20 w-full" />
        <div className="text-center sm:text-right">
          <p className="text-2xl font-black text-white">10+</p>
          <p className="text-[10px] text-red-200 font-bold uppercase tracking-tight">Tests on Offer</p>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────── */
const BloodTests = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOffersOnly, setShowOffersOnly] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        if (isMockMode) {
          await new Promise(resolve => setTimeout(resolve, 700));
          setTests(MOCK_BLOOD_TESTS);
          return;
        }
        const { data, error } = await supabase
          .from('blood_tests')
          .select('*')
          .order('test_name', { ascending: true });
        if (error) throw error;
        setTests(data || []);
      } catch (error) {
        console.error('Error fetching blood tests:', error);
        toast.error('Failed to load blood tests');
        setTests(MOCK_BLOOD_TESTS);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(tests.map(t => t.category))],
    [tests]
  );

  const filteredTests = useMemo(() => {
    return tests.filter(t => {
      const matchesSearch = t.test_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesOffer = showOffersOnly ? (t.discount && t.discount > 0) : true;
      return matchesSearch && matchesCategory && matchesOffer;
    });
  }, [searchQuery, selectedCategory, showOffersOnly, tests]);

  const offersCount = useMemo(
    () => tests.filter(t => t.discount && t.discount > 0).length,
    [tests]
  );

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <div className="relative bg-white pt-4 pb-16 overflow-hidden border-b border-slate-100">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-red-50/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-gradient-to-tr from-blue-50/60 to-transparent pointer-events-none" />
        <div className="absolute top-10 right-[15%] w-64 h-64 rounded-full bg-red-100/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-16">

            {/* ── Left Text ── */}
            <div className="w-full lg:w-[55%]">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-medical-error font-black text-[11px] uppercase tracking-widest border border-red-100 mb-5 animate-in fade-in slide-in-from-left duration-700">
                <Activity size={12} className="animate-pulse" />
                <span>Diagnostic Excellence</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-txt-dark leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-left duration-1000">
                Expert{' '}
                <span className="text-medical-error relative inline-block">
                  Diagnostic Tests
                  <span className="absolute bottom-1 left-0 w-full h-[4px] rounded-full bg-medical-error/30" />
                </span>
                <br />
                <span className="text-txt-secondary font-extrabold text-3xl lg:text-5xl mt-2 block">at Your Convenience.</span>
              </h1>

              {/* Subtext */}
              <p className="text-lg sm:text-lg md:text-xl text-txt-secondary leading-relaxed mb-10 w-full block animate-in fade-in slide-in-from-left duration-1000 delay-200">
                Book premium blood tests from home or clinic. Certified reports within{' '}
                <span className="font-bold text-txt-dark">24–48 hours</span> from India's leading NABL-accredited diagnostic centers.
              </p>

              {/* Trust Pills */}
              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-400">
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-red-200 hover:shadow-md transition-all cursor-default group">
                  <Droplet className="w-5 h-5 text-medical-error group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] font-black text-txt-placeholder uppercase tracking-widest">Accreditation</p>
                    <p className="text-sm font-black text-txt-dark">NABL Certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-default group">
                  <Microscope className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] font-black text-txt-placeholder uppercase tracking-widest">Sample Pickup</p>
                    <p className="text-sm font-black text-txt-dark">Free Doorstep</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-green-200 hover:shadow-md transition-all cursor-default group">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] font-black text-txt-placeholder uppercase tracking-widest">Reports</p>
                    <p className="text-sm font-black text-txt-dark">Doctor Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Image ── */}
            <div className="w-full lg:w-[40%] max-w-[420px] mx-auto lg:mx-0 animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="relative p-2 bg-gradient-to-br from-white via-slate-100 to-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/80">
                <div className="absolute inset-0 bg-gradient-to-br from-red-200/20 to-blue-200/20 opacity-40 blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1579154235602-4c070188686e?auto=format&fit=crop&q=80&w=800"
                  alt="Blood Testing Lab"
                  className="w-full h-64 lg:h-72 object-cover rounded-[2rem] relative z-10"
                />
                {/* Floating badge on image */}
                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl px-4 py-2.5 border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-txt-dark">Live Booking Available</span>
                </div>
                <div className="absolute top-6 right-6 z-20 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-medical-error rotate-6 group-hover:rotate-0 transition-transform duration-500 border border-slate-100">
                  <Droplet size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT CARD
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30 pb-12">
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.07)] border border-slate-100 p-6 lg:p-10">

          {/* ── Offer Banner ── */}
          {!loading && offersCount > 0 && <OfferBanner />}

          {/* ── Controls Bar ── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">

            {/* Search Input */}
            <div className="flex-1 max-w-lg">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-txt-placeholder group-focus-within:text-medical-error transition-colors" />
                <input
                  type="text"
                  placeholder="Search tests — CBC, Thyroid, Diabetes..."
                  className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-50 transition-all outline-none font-semibold text-sm text-txt-dark placeholder:text-txt-placeholder"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-red-100 text-txt-secondary hover:text-medical-error flex items-center justify-center transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Tabs + Offers Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Offers-Only Toggle */}
              <button
                onClick={() => setShowOffersOnly(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black tracking-tight transition-all border ${
                  showOffersOnly
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-lg shadow-red-300/30'
                    : 'bg-white text-txt-secondary border-slate-200 hover:border-red-200 hover:text-medical-error'
                }`}
              >
                <Flame size={14} className={showOffersOnly ? 'text-yellow-300' : 'text-orange-400'} />
                Offers
                {offersCount > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${showOffersOnly ? 'bg-white/20 text-white' : 'bg-red-100 text-medical-error'}`}>
                    {offersCount}
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              {/* Category Tabs */}
              <div className="p-1 rounded-2xl bg-slate-100 flex flex-wrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-tight transition-all ${
                      selectedCategory === cat
                        ? 'bg-white text-medical-error shadow-sm'
                        : 'text-txt-secondary hover:text-txt-dark'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filter Summary */}
          {(showOffersOnly || selectedCategory !== 'All' || searchQuery) && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-xs font-bold text-txt-placeholder">Active Filters:</span>
              {showOffersOnly && (
                <span className="inline-flex items-center gap-1 text-xs font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                  <Tag size={10} /> Offers Only
                  <button onClick={() => setShowOffersOnly(false)} className="ml-1 hover:text-red-600"><X size={10} /></button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 text-xs font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="ml-1 hover:text-red-600"><X size={10} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 text-xs font-black text-txt-secondary bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-600"><X size={10} /></button>
                </span>
              )}
              <span className="text-xs text-txt-placeholder">— {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found</span>
            </div>
          )}

          {/* ── Test Grid ── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[340px] rounded-3xl bg-slate-50 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
              {filteredTests.map(test => (
                <BloodTestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-txt-placeholder mb-6 relative border border-slate-100">
                <Search size={36} className="opacity-20" />
                <X size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-medical-error opacity-40" />
              </div>
              <h3 className="text-2xl font-black text-txt-dark mb-3">No Tests Found</h3>
              <p className="text-base text-txt-secondary max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                We couldn't find any test matching your filters. Try adjusting your search or category.
              </p>
              <Button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setShowOffersOnly(false); }}
                className="rounded-2xl h-12 px-8 bg-gradient-to-r from-medical-error to-red-600 shadow-xl shadow-red-500/20 text-white font-black hover:-translate-y-0.5 transition-transform"
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* ── Bottom Features Row ── */}
          {!loading && filteredTests.length > 0 && (
            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Droplet size={24} />,
                  color: 'bg-red-50 text-medical-error',
                  title: 'Safe Collection',
                  desc: '100% sterile, single-use kits used by certified phlebotomists at your doorstep.',
                },
                {
                  icon: <Stethoscope size={24} />,
                  color: 'bg-blue-50 text-blue-500',
                  title: 'Doctor Reviewed',
                  desc: 'Every report reviewed and validated by qualified NABL-registered pathologists.',
                },
                {
                  icon: <Activity size={24} />,
                  color: 'bg-green-50 text-green-500',
                  title: 'Quick Results',
                  desc: 'Digital reports dispatched via SMS, Email & App within 24–48 hours.',
                },
              ].map(({ icon, color, title, desc }) => (
                <div key={title} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${color}`}>
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-txt-dark mb-1">{title}</h4>
                    <p className="text-sm text-txt-secondary leading-relaxed font-medium">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodTests;
