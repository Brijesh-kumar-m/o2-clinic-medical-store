import React, { useMemo } from 'react';
import { Hero, CategoryStrip } from '../components/layout/Hero';
import { medicines } from '../data/medicines';
import ProductCard from '../components/features/ProductCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, Activity, TrendingUp, Clock, ShieldCheck, Truck, Percent, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Filter for featured and best deals
  const featuredMedicines = useMemo(() =>
    medicines.filter(m => m.featured).slice(0, 8),
    []);

  const deals = useMemo(() =>
    medicines.filter(m => m.packSizes[0].discount > 25).slice(0, 4),
    []);

  return (
    <div className="flex flex-col gap-0 w-full overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Category Strip - Elevated */}
      <div className="-mt-8 relative z-10 px-4 mb-12">
        <CategoryStrip />
      </div>

      {/* Trust Benefits Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-txt-primary text-sm">100% Genuine</h4>
              <p className="text-xs text-txt-secondary">Direct from manufacturers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-brand-secondary flex items-center justify-center">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-txt-primary text-sm">Express Delivery</h4>
              <p className="text-xs text-txt-secondary">Same-day in 15+ cities</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-medical-warning flex items-center justify-center">
              <Percent size={24} />
            </div>
            <div>
              <h4 className="font-bold text-txt-primary text-sm">Best Margins</h4>
              <p className="text-xs text-txt-secondary">Unbeatable wholesale rates</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Stethoscope size={24} />
            </div>
            <div>
              <h4 className="font-bold text-txt-primary text-sm">Pharmacist Support</h4>
              <p className="text-xs text-txt-secondary">24/7 Professional help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Best Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full bg-gradient-to-b from-surface-bg to-white rounded-3xl mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-medical-error mb-2 bg-red-50 w-fit px-3 py-1 rounded-full border border-red-100">
              <Clock className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Limited Time Offers</span>
            </div>
            <h2 className="text-3xl font-bold text-txt-dark tracking-tight">Today's Best Deals</h2>
            <p className="text-txt-secondary mt-2">Maximum savings on high-demand essentials.</p>
          </div>
          <Link to="/products?filter=deals">
            <Button variant="ghost" className="group text-brand-primary hover:bg-blue-50">
              View All Offers <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Banner - Professional/Clinical Style */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-txt-primary rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <div className="relative z-10 max-w-xl">
              <Badge variant="secondary" className="mb-4 bg-brand-primary/20 text-brand-primary border-brand-primary/20 backdrop-blur-md">
                Exclusive for Clinics
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Optimize Your <span className="text-brand-primary">Inventory</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Join over 5,000+ clinics using our automated inventory prediction to reduce wastage and stockouts.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white border-none px-8">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Decorative UI Mockup Area */}
            <div className="hidden md:block relative z-10 w-1/3">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transform rotate-6 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                  <Activity className="text-brand-primary" />
                  <div>
                    <h4 className="text-white font-bold">Stock Alert</h4>
                    <p className="text-xs text-slate-400">Reorder Level Reached</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                  <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Medicines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 text-brand-primary mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Market Trends</span>
            </div>
            <h2 className="text-3xl font-bold text-txt-dark">Popular Medicines</h2>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="group text-brand-primary hover:bg-blue-50">
              Full Catalog <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMedicines.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/products">
            <Button variant="outline" size="lg" className="px-12 rounded-full border-2 border-surface-border text-txt-secondary hover:text-brand-primary hover:border-brand-primary">
              View All 500+ Medicines
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
