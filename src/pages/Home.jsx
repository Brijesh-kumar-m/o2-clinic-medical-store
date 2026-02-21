import React, { useMemo } from 'react';
import { Hero, CategoryStrip } from '../components/layout/Hero';
import { medicines } from '../data/medicines';
import ProductCard from '../components/features/ProductCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, Activity, TrendingUp, Clock, ShieldCheck, Truck, Percent, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import StockAlertsMockup from '../components/features/StockAlertsMockup';

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

            <div className="relative z-10 lg:w-3/5 text-left py-4">
              <Badge variant="secondary" className="mb-8 bg-white/10 text-brand-primary-light border-white/10 backdrop-blur-xl px-5 py-2 inline-flex items-center gap-2 rounded-full border">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary-light animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Predictive Intelligence</span>
              </Badge>

              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white leading-[1.1] tracking-tight">
                Optimize Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary-light to-brand-secondary">Inventory</span>
              </h2>

              <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed max-w-xl">
                Empower your clinic with real-time analytics. Join 5,000+ medical leaders reducing waste by 40% with O2Clinic’s smart replenishment engine.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/login?mode=register" className="group">
                  <Button size="lg" className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-dark text-white border-none px-10 h-14 font-bold shadow-2xl shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-1">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login" className="group">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/20 bg-white/5 backdrop-blur-md px-10 h-14 font-bold transition-all duration-300">
                    Explore Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative UI Mockup Area */}
            <div className="hidden lg:block relative z-10 lg:w-2/5">
              <div className="relative transform rotate-2 hover:rotate-0 transition-all duration-700 ease-out">
                {/* Visual Glow behind mockup */}
                <div className="absolute -inset-10 bg-brand-primary/20 rounded-full blur-[100px] -z-10" />
                <StockAlertsMockup />
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
