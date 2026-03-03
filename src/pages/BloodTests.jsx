import React, { useState, useEffect, useMemo } from 'react';
import { supabase, isMockMode } from '../lib/supabase';
import BloodTestCard from '../components/features/BloodTestCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Filter, Search, X, Activity, Droplet, Microscope, Stethoscope, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BloodTests = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock blood tests
  const mockBloodTests = [
    { id: 'bt-1', test_name: 'Complete Blood Count (CBC)', category: 'General', price: 499, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
    { id: 'bt-2', test_name: 'Lipid Profile', category: 'Heart', price: 899, preparation: '9-12 hours fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
    { id: 'bt-3', test_name: 'Thyroid Profile (T3, T4, TSH)', category: 'Hormonal', price: 750, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
    { id: 'bt-4', test_name: 'Diabetes Screen (HbA1c)', category: 'Diabetes', price: 550, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics', featured: true },
    { id: 'bt-5', test_name: 'Liver Function Test (LFT)', category: 'General', price: 950, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
    { id: 'bt-6', test_name: 'Kidney Function Test (KFT)', category: 'General', price: 850, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
    { id: 'bt-7', test_name: 'Vitamin D (25-OH)', category: 'Supplements', price: 1250, preparation: 'No fasting required', sample_type: 'Blood', report_time: '48 Hours', lab_name: 'MediTrust Diagnostics' },
    { id: 'bt-8', test_name: 'Iron Profile', category: 'General', price: 799, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
  ];

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        if (isMockMode) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setTests(mockBloodTests);
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
        setTests(mockBloodTests); // Fallback to mock on error
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(tests.map(t => t.category))], [tests]);

  const filteredTests = useMemo(() => {
    return tests.filter(t => {
      const matchesSearch = t.test_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, tests]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header Section */}
      <div className="relative bg-white pt-16 pb-12 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-medical-error/5 to-transparent skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-blue-500/5 to-transparent -skew-x-12 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-error/10 text-medical-error font-black text-xs uppercase tracking-widest border border-medical-error/10 mb-6 animate-in fade-in slide-in-from-left duration-700">
                <Activity size={14} className="animate-pulse" />
                <span>Diagnostic Excellence</span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-txt-dark leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-left duration-1000">
                Expert <span className="text-medical-error underline decoration-medical-error/30 underline-offset-8">Diagnostic Tests</span> <br />
                at Your Convenience.
              </h1>
              <p className="text-lg text-txt-secondary leading-relaxed mb-8 max-w-xl animate-in fade-in slide-in-from-left duration-1000 delay-200">
                Book premium blood tests from home or clinic. Get certified reports within 24 hours from India's leading medical diagnostic centers.
              </p>

              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-medical-error/30 transition-all cursor-default group">
                  <Droplet className="w-5 h-5 text-medical-error group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] font-bold text-txt-placeholder uppercase tracking-tight">Accreditation</p>
                    <p className="text-sm font-bold text-txt-dark">NABL Certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500/30 transition-all cursor-default group">
                  <Microscope className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] font-bold text-txt-placeholder uppercase tracking-tight">Sample Pickup</p>
                    <p className="text-sm font-bold text-txt-dark">Prompt Doorstep Collection</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-[450px] animate-in fade-in zoom-in duration-1000">
              <div className="relative p-2 bg-gradient-to-br from-white to-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
                <div className="absolute inset-0 bg-gradient-to-br from-medical-error/20 to-blue-500/20 opacity-30 blur-3xl animate-pulse" />
                <img
                  src="https://images.unsplash.com/photo-1579154235602-4c070188686e?auto=format&fit=crop&q=80&w=800"
                  alt="Blood Testing"
                  className="w-full h-full object-cover rounded-[2rem] relative z-10"
                />
                <div className="absolute top-8 right-8 z-20 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-medical-error rotate-6 group hover:rotate-0 transition-transform duration-500">
                  <Droplet size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-24 relative z-30 pb-24">
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 p-8 lg:p-12 min-h-[600px]">

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div className="flex-1 max-w-xl">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-txt-placeholder group-focus-within:text-medical-error transition-colors" />
                <input
                  type="text"
                  placeholder="Search for blood tests (e.g. CBC, Diabetes, Thyroid...)"
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-medical-error/20 focus:ring-4 focus:ring-medical-error/5 transition-all outline-none font-semibold text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="hidden md:inline text-[11px] font-black text-txt-placeholder uppercase tracking-tighter">Enter to Search</span>
                  <kbd className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-txt-placeholder shadow-sm">↵</kbd>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="p-1 rounded-2xl bg-slate-100 flex gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-3 rounded-xl text-sm font-black tracking-tight transition-all ${selectedCategory === cat ? 'bg-white text-medical-error shadow-sm' : 'text-txt-secondary hover:text-txt-dark'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="h-14 w-px bg-slate-200 mx-2 hidden lg:block" />
              <Button variant="outline" className="h-14 rounded-xl px-6 border-slate-200 hover:bg-slate-50 relative group overflow-hidden">
                <span className="relative z-10 flex items-center gap-2 font-black text-txt-secondary group-hover:text-medical-error transition-colors">
                  <Filter size={18} /> Filters
                </span>
              </Button>
            </div>
          </div>

          {/* Test Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-[400px] rounded-3xl bg-slate-50 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
              {filteredTests.map(test => (
                <BloodTestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-txt-placeholder mb-8 relative">
                <Search size={48} className="opacity-20" />
                <X size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-medical-error opacity-40" />
              </div>
              <h3 className="text-3xl font-black text-txt-dark mb-4">Oops! Test Not Found</h3>
              <p className="text-lg text-txt-secondary max-w-md mx-auto mb-10 leading-relaxed font-medium">
                We couldn't find "<span className="text-medical-error font-black">{searchQuery}</span>" in our diagnostic catalog. Please try a different term or contact support.
              </p>
              <Button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="rounded-2xl h-14 px-10 bg-gradient-to-r from-medical-error to-red-600 shadow-xl shadow-red-500/20 text-white font-black hover:-translate-y-1 transition-transform"
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Features Row */}
          {!loading && filteredTests.length > 0 && (
            <div className="mt-20 pt-16 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-medical-error flex items-center justify-center shrink-0 shadow-sm">
                  <Droplet size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-txt-dark mb-2">Safe Collection</h4>
                  <p className="text-txt-secondary text-sm leading-relaxed font-medium">100% sterile, single-use kits used by certified professionals.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-txt-dark mb-2">Doctor Review</h4>
                  <p className="text-txt-secondary text-sm leading-relaxed font-medium">Reports reviewed by qualified pathologists for accuracy.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center shrink-0 shadow-sm">
                  <Activity size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-txt-dark mb-2">Quick Results</h4>
                  <p className="text-txt-secondary text-sm leading-relaxed font-medium">Digital reports sent via SMS, Email & App within 24-48 hours.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodTests;
