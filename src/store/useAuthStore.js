
import { create } from 'zustand';
import { supabase, isMockMode } from '../lib/supabase';
import { useCartStore } from './useCartStore';
import toast from 'react-hot-toast';

const MOCK_USER = {
  id: 'mock-user-id',
  email: 'doctor@demo.com',
  user_metadata: {
    first_name: 'Demo',
    last_name: 'Doctor'
  }
};

const MOCK_PROFILE = {
  id: 'mock-user-id',
  first_name: 'Demo',
  last_name: 'Admin',
  email: 'admin@demo.com',
  role: 'admin',
  phone: '9876543210',
  license_number: 'MCI-12345',
  clinic_name: 'Demo Clinic',
  address: '123 Medical Lane, Health City',
  specialization: 'General Physician'
};

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true,

  // Initialize session
  initializeAuth: async () => {
    set({ loading: true });
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Fetch profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        set({ user: session.user, profile, isAuthenticated: true, loading: false });
        useCartStore.getState().fetchCart();
      } else {
        // If no profile found (shouldn't happen with triggers), just set user
        set({ user: session.user, isAuthenticated: true, loading: false });
        useCartStore.getState().fetchCart();
      }
    } else {
      set({ user: null, profile: null, isAuthenticated: false, loading: false });
      useCartStore.getState().resetCart();
    }

    // Listen for changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
         const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        set({ user: session.user, profile, isAuthenticated: true, loading: false });
        useCartStore.getState().fetchCart();
      } else {
        set({ user: null, profile: null, isAuthenticated: false, loading: false });
        useCartStore.getState().resetCart();
      }
    });
  },

  login: async (email, password) => {
    set({ loading: true });

    if (isMockMode) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      localStorage.setItem('mock_auth_user', 'true');
      set({ 
        user: { ...MOCK_USER, email }, 
        profile: { ...MOCK_PROFILE, email }, 
        isAuthenticated: true, 
        loading: false 
      });
      useCartStore.getState().fetchCart();
      toast.success('Logged in (Mock Mode)');
      return true;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      if (error.message.includes('Email not confirmed')) {
        toast.error('Email not confirmed. Please disable "Confirm email" in Supabase Auth settings, or run the SQL fix.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password.');
      } else {
        toast.error(error.message);
      }
      set({ loading: false });
      return false;
    }
    
    toast.success('Logged in successfully');
    return true;
  },

  register: async (email, password, metadata) => {
    set({ loading: true });

    if (isMockMode) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      localStorage.setItem('mock_auth_user', 'true');
      const mockUser = { ...MOCK_USER, email, user_metadata: metadata };
      const mockProfile = { ...MOCK_PROFILE, email, ...metadata };
      
      set({ 
        user: mockUser, 
        profile: mockProfile, 
        isAuthenticated: true, 
        loading: false 
      });
      useCartStore.getState().fetchCart();
      toast.success('Registration successful (Mock Mode)');
      return true;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // { first_name, last_name, role, etc. }
      }
    });

    if (error) {
      console.error("Signup error:", error);
      if (error.message.includes('rate limit')) {
        toast.error('Too many emails sent! Please wait or use a different email.');
      } else if (error.message.includes('already registered')) {
        toast.error('User already registered. Please login instead.');
      } else if (error.message.includes('signups are disabled')) {
        toast.error('Signups disabled! Go to Supabase > Auth > Providers > Email and turn ON "Enable Email Signup".');
      } else {
        toast.error(error.message);
      }
      set({ loading: false });
      return false;
    }

    if (data?.session) {
      set({ 
        user: data.session.user, 
        isAuthenticated: true, 
        loading: false 
      });
      useCartStore.getState().fetchCart();
      toast.success('Registration successful! Logging in...');
      return true;
    }

    toast.success('Registration successful! Please login.');
    set({ loading: false });
    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAuthenticated: false });
    useCartStore.getState().resetCart();
    toast.success('Logged out');
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return false;

    if (isMockMode) {
       // Update local state only
       set((state) => ({
        profile: { ...state.profile, ...updates }
      }));
      toast.success('Profile updated (Mock Mode)');
      return true;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast.error(error.message);
      return false;
    }

    // Update local state
    set((state) => ({
      profile: { ...state.profile, ...updates }
    }));
    
    toast.success('Profile updated successfully');
    return true;
  }
}));
