import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { supabase, isMockMode } from '../../lib/supabase';

const StockAlerts = () => {
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        let data = [];
        
        if (isMockMode) {
          // Mock data fallback if mockProducts is not defined in scope
          const mockItems = [
             { id: 1, name: 'Paracetamol 500mg', stock: 120 },
             { id: 2, name: 'Amoxycillin 500mg', stock: 50 },
             { id: 3, name: 'Cetirizine 10mg', stock: 200 }
          ];
          data = mockItems;
        } else {
          const { data: supabaseData, error } = await supabase
            .from('products')
            .select('*')
            .lt('stock', 300)
            .limit(3);

          if (error) throw error;
          data = supabaseData || [];
        }

        const formattedItems = data.map(m => ({
          ...m,
          percentage: Math.min(Math.floor((m.stock / 1000) * 100), 100)
        }));
        
        setLowStockItems(formattedItems);
      } catch (error) {
        console.error('Error fetching stock alerts:', error);
      }
    };

    fetchLowStockItems();
  }, []);

  if (lowStockItems.length === 0) return null;

  return (
    <div className="relative w-full max-w-md mx-auto md:mx-0">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transform md:rotate-3 hover:rotate-0 transition-all duration-700 ease-out group">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Inventory AI</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Predictive Stock Alert</p>
            </div>
          </div>
          <div className="bg-medical-error/20 text-medical-error px-2 py-1 rounded-lg text-[10px] font-black animate-bounce">
            3 CRITICAL
          </div>
        </div>

        <div className="space-y-5">
          {lowStockItems.map((item, idx) => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <Package className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-bold text-white/90">{item.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-medical-error">{item.stock}</span>
                  <span className="text-[8px] text-slate-500 uppercase">Left</span>
                </div>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1.5, delay: idx * 0.2 }}
                  className={`h-full rounded-full ${item.percentage < 20 ? 'bg-medical-error' : 'bg-medical-warning'
                    }`}
                />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-medical-error" /> High demand velocity
                </span>
                <span className="text-brand-primary font-bold">Auto-Reorder in 2h</span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Stat Chip */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute -right-6 -bottom-6 bg-white rounded-2xl p-4 shadow-xl border border-surface-border hidden lg:block"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-secondary flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-txt-placeholder uppercase">Wastage Saved</p>
              <p className="text-sm font-black text-txt-dark">₹12,450 / mo</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockAlerts;
