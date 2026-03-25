
import { create } from 'zustand';
import { supabase, isMockMode } from '../lib/supabase';

export const useSettingsStore = create((set) => ({
  gstRate: 12.0,
  shippingCharge: 150.0,
  freeShippingThreshold: 5000.0,
  loading: true,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Ignore "Row not found" (use defaults)
            console.error('Error fetching settings:', error);
        }
      } else if (data) {
        set({
          gstRate: data.gst_rate,
          shippingCharge: data.shipping_charge,
          freeShippingThreshold: data.free_shipping_threshold,
        });
      }
    } catch (err) {
      console.error('Unexpected error fetching settings:', err);
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (newSettings) => {
    try {
      if (isMockMode) {
          set((state) => ({
            ...state,
            ...newSettings
          }));
          return true;
      }

      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: 1,
          gst_rate: newSettings.gstRate,
          shipping_charge: newSettings.shippingCharge,
          free_shipping_threshold: newSettings.freeShippingThreshold,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      set((state) => ({
        ...state,
        ...newSettings
      }));
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }
}));
