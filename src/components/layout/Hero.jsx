import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, ShieldCheck, Truck, Zap, Activity, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Hero = () => {
  const [stats, setStats] = useState({
    products: '50k+',
    doctors: '12k+',
    delivery: '24hr'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'estimated', head: true });

        const { count: doctorCount } = await supabase
          .from('profiles')
          .select('*', { count: 'estimated', head: true });

        setStats({
          products: productCount ? `${(productCount / 1000).toFixed(1)}k+` : '100+',
          doctors: doctorCount ? `${(doctorCount / 1000).toFixed(1)}k+` : '50+',
          delivery: '24hr'
        });
      } catch (error) {
        console.error('Error fetching hero stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-surface-bg pt-3 pb-16 lg:pt-12 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 flex flex-col text-left w-full h-full">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-primary border-brand-primary/20 bg-brand-primary/5 rounded-full uppercase">
              <Activity className="w-3 h-3 mr-2" />
              MCI & Drug License Verified Partner
            </Badge>
            <div className="w-full">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-txt-dark leading-[1.1] mb-6 tracking-tight">
                Procure <span className="text-brand-primary">Genuine</span> <br />
                Medicines Faster.
              </h1>
              <p className="text-lg sm:text-xl text-txt-secondary mb-10 leading-relaxed font-medium max-w-2xl">
                The most trusted B2B pharmaceutical platform for clinics and pharmacies. Direct from manufacturers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-12">
              <Link to="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-xl px-10 h-14 text-lg shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all">
                  Browse Catalog <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-xl px-10 h-14 text-lg bg-white border-2 border-brand-primary/20 hover:border-brand-primary text-txt-dark transition-all">
                  Register Practice
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 border-t border-surface-border pt-8 w-full">
              <div>
                <p className="text-3xl font-bold text-txt-dark mb-1">{stats.products}</p>
                <p className="text-xs text-txt-secondary font-medium uppercase tracking-wider">SKUs Available</p>
              </div>
              <div className="w-px h-10 bg-surface-border"></div>
              <div>
                <p className="text-3xl font-bold text-txt-dark mb-1">{stats.doctors}</p>
                <p className="text-xs text-txt-secondary font-medium uppercase tracking-wider">Verified Doctors</p>
              </div>
              <div className="w-px h-10 bg-surface-border"></div>
              <div>
                <p className="text-3xl font-bold text-txt-dark mb-1">{stats.delivery}</p>
                <p className="text-xs text-txt-secondary font-medium uppercase tracking-wider">Avg. Delivery</p>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] w-full flex items-center justify-center">
            {/* Abstract background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-brand-secondary/20 to-transparent blur-3xl opacity-60"></div>

            <div className="relative w-full max-w-md lg:max-w-full">
              {/* Main Hero Image Container */}
              <div className="relative z-10 bg-white p-2 rounded-3xl shadow-2xl rotate-[-2deg] hover:rotate-0 transition-all duration-700 ease-out border border-white/50">
                <img
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2938&auto=format&fit=crop"
                  alt="Pharmaceutical Logistics"
                  className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
                />

                {/* Floating Badge 1 */}
                <div className="absolute top-8 -right-8 bg-white p-4 rounded-xl shadow-xl border border-surface-border flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-txt-dark">FDA Approved</p>
                    <p className="text-[10px] text-txt-secondary">100% Compliant</p>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-surface-border flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-brand-primary">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-txt-dark">Cold Chain</p>
                    <p className="text-[10px] text-txt-secondary">Temperature Controlled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryStrip = () => {
  const [categories, setCategories] = useState([
    { name: "Antibiotics", icon: "💊", count: "1.2k+ Prods" },
    { name: "Cardiology", icon: "🫀", count: "800+ Prods" },
    { name: "Diabetology", icon: "🩸", count: "500+ Prods" },
    { name: "Respiratory", icon: "🫁", count: "450+ Prods" },
    { name: "Gastro", icon: "🧪", count: "300+ Prods" },
    { name: "Neurology", icon: "🧠", count: "200+ Prods" },
    { name: "Dermatology", icon: "🧴", count: "600+ Prods" },
    { name: "Supplements", icon: "⚡", count: "1k+ Prods" }
  ]);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_category_stats');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map icons based on category name (simple heuristic)
          const getIcon = (name) => {
            const lower = name.toLowerCase();
            if (lower.includes('antibiotic')) return "💊";
            if (lower.includes('cardio') || lower.includes('heart')) return "🫀";
            if (lower.includes('diabet') || lower.includes('sugar')) return "🩸";
            if (lower.includes('respir') || lower.includes('lung')) return "🫁";
            if (lower.includes('gastro') || lower.includes('stomach')) return "🧪";
            if (lower.includes('neuro') || lower.includes('brain')) return "🧠";
            if (lower.includes('derm') || lower.includes('skin')) return "🧴";
            if (lower.includes('supplement') || lower.includes('vitamin')) return "⚡";
            return "📦";
          };

          const mappedCategories = data.map(item => ({
            name: item.category,
            icon: getIcon(item.category),
            count: `${item.count} Prods`
          }));
          
          setCategories(mappedCategories);
        }
      } catch (err) {
        console.error('Failed to fetch category stats:', err);
        // Fallback to default categories if RPC fails or returns empty
      }
    };

    fetchCategoryStats();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-4">
        <div className="flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4 pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat, idx) => (
            <Link key={idx} to={`/products?category=${encodeURIComponent(cat.name)}`} className="flex flex-col items-center justify-center gap-2 min-w-[100px] p-3 rounded-xl hover:bg-surface-bg transition-colors group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-surface-bg group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-surface-border flex items-center justify-center text-2xl transition-all">
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-txt-dark group-hover:text-brand-primary transition-colors">{cat.name}</p>
                <p className="text-[10px] text-txt-placeholder group-hover:text-txt-secondary">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Hero, CategoryStrip };
