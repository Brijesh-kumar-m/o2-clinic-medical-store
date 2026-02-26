
import { create } from 'zustand';
import { supabase, isMockMode } from '../lib/supabase';
import { useCartStore } from './useCartStore';
import toast from 'react-hot-toast';

const MOCK_ADMIN_CREDENTIALS = {
  email: 'admin@demo.com',
  password: 'admin123'
};

const MOCK_USER = {
  id: 'mock-user-id',
  email: 'doctor@demo.com',
  user_metadata: {
    first_name: 'Demo',
    last_name: 'Doctor'
  }
};

const MOCK_ADMIN_PROFILE = {
  id: 'mock-admin-id',
  first_name: 'Demo',
  last_name: 'Admin',
  email: MOCK_ADMIN_CREDENTIALS.email,
  role: 'admin',
  phone: '9876543210',
  license_number: 'ADMIN-0001',
  clinic_name: 'O2Clinic Admin',
  address: 'Head Office',
  specialization: 'Administration',
  status: 'approved'
};

const MOCK_DOCTOR_PROFILE = {
  id: 'mock-user-id',
  first_name: 'Demo',
  last_name: 'Doctor',
  email: 'doctor@demo.com',
  role: 'doctor',
  phone: '9876543210',
  license_number: 'MCI-12345',
  clinic_name: 'Demo Clinic',
  address: '123 Medical Lane, Health City',
  specialization: 'General Physician',
  status: 'approved'
};

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true,

  // Initialize session
  initializeAuth: async () => {
    set({ loading: true });

    try {
      if (isMockMode) {
        const isMockAuth = localStorage.getItem('mock_auth_user');
        if (isMockAuth) {
          const storedRole = localStorage.getItem('mock_auth_role') || 'doctor';
          const storedEmail = localStorage.getItem('mock_auth_email') || '';
          const isAdmin = storedRole === 'admin';

          // Restore mock session
          set({
            user: { ...MOCK_USER, id: isAdmin ? MOCK_ADMIN_PROFILE.id : MOCK_DOCTOR_PROFILE.id, email: storedEmail || (isAdmin ? MOCK_ADMIN_PROFILE.email : MOCK_DOCTOR_PROFILE.email) },
            profile: isAdmin ? { ...MOCK_ADMIN_PROFILE, email: storedEmail || MOCK_ADMIN_PROFILE.email } : { ...MOCK_DOCTOR_PROFILE, email: storedEmail || MOCK_DOCTOR_PROFILE.email },
            isAuthenticated: true,
            loading: false
          });
          useCartStore.getState().fetchCart();
          return;
        }
      }

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (session?.user) {
        let profile = null;
        try {
          // Fetch profile
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          profile = data;
        } catch (profileError) {
          console.warn('Error fetching profile:', profileError);
        }

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
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, profile: null, isAuthenticated: false, loading: false });
    }

    // Listen for changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          let profile = null;
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            profile = data;
          } catch (e) { console.warn('Profile fetch error in listener', e); }

          set({ user: session.user, profile, isAuthenticated: true, loading: false });
          useCartStore.getState().fetchCart();
        } else {
          set({ user: null, profile: null, isAuthenticated: false, loading: false });
          useCartStore.getState().resetCart();
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        set({ loading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ loading: true });

    if (isMockMode) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const normalizedEmail = String(email || '').trim().toLowerCase();
      const isAdminLogin =
        normalizedEmail === MOCK_ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === MOCK_ADMIN_CREDENTIALS.password;

      const profile = isAdminLogin
        ? { ...MOCK_ADMIN_PROFILE }
        : { ...MOCK_DOCTOR_PROFILE, email: email };

      localStorage.setItem('mock_auth_user', 'true');
      localStorage.setItem('mock_auth_role', profile.role);
      localStorage.setItem('mock_auth_email', email);

      set({
        user: { ...MOCK_USER, id: profile.id, email },
        profile,
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

    try {
      const signedInUser = data?.session?.user || data?.user;
      let profile = null;

      if (signedInUser) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', signedInUser.id)
            .single();
          if (profileError) throw profileError;
          profile = profileData;
        } catch (profileError) {
          console.warn('Error fetching profile after login:', profileError);
        }
      }

      set({ user: signedInUser || null, profile, isAuthenticated: !!signedInUser, loading: false });
      if (signedInUser) {
        useCartStore.getState().fetchCart();
      }
      toast.success('Logged in successfully');
      return true;
    } catch (e) {
      console.error('Post-login state update failed:', e);
      set({ loading: false });
      toast.error('Login succeeded, but failed to load profile.');
      return true;
    }
  },

  loginAdmin: async (email, password) => {
    set({ loading: true });

    // Only use mock admin login if we're ALREADY in mock mode (no real Supabase credentials)
    if (isMockMode) {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const isMockAdmin =
        normalizedEmail === MOCK_ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === MOCK_ADMIN_CREDENTIALS.password;

      if (!isMockAdmin) {
        set({ loading: false });
        toast.error('Invalid admin email or password.');
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      localStorage.setItem('mock_auth_user', 'true');
      localStorage.setItem('mock_auth_role', 'admin');
      localStorage.setItem('mock_auth_email', MOCK_ADMIN_CREDENTIALS.email);

      set({
        user: { ...MOCK_USER, id: MOCK_ADMIN_PROFILE.id, email: MOCK_ADMIN_PROFILE.email },
        profile: { ...MOCK_ADMIN_PROFILE },
        isAuthenticated: true,
        loading: false
      });
      useCartStore.getState().fetchCart();
      toast.success('Admin login successful (Mock Mode)');
      return true;
    }

    // Real Supabase login for admin
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      if (error.message.includes('Email not confirmed')) {
        toast.error('Email not confirmed. Please disable "Confirm email" in Supabase Auth settings.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password.');
      } else {
        toast.error(error.message);
      }
      set({ loading: false });
      return false;
    }

    const signedInUser = data?.session?.user || data?.user;
    let profile = null;

    if (signedInUser) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signedInUser.id)
          .single();
        if (profileError) throw profileError;
        profile = profileData;
      } catch (profileError) {
        console.warn('Error fetching profile after admin login:', profileError);
      }
    }

    if (!profile || profile.role !== 'admin') {
      try {
        await supabase.auth.signOut();
      } catch { }
      set({ user: null, profile: null, isAuthenticated: false, loading: false });
      useCartStore.getState().resetCart();
      toast.error('Admin access required.');
      return false;
    }

    set({ user: signedInUser || null, profile, isAuthenticated: !!signedInUser, loading: false });
    useCartStore.getState().fetchCart();
    toast.success('Admin login successful');
    return true;
  },

  register: async (email, password, metadata) => {
    set({ loading: true });

    if (isMockMode) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      localStorage.setItem('mock_auth_user', 'true');
      localStorage.setItem('mock_auth_role', metadata?.role || 'doctor');
      localStorage.setItem('mock_auth_email', email);

      const mockUser = { ...MOCK_USER, email, user_metadata: metadata };
      const mockProfile = { ...MOCK_DOCTOR_PROFILE, email, ...metadata, role: metadata?.role || 'doctor', status: 'approved' };

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
    localStorage.removeItem('force_mock_mode');
    if (isMockMode) {
      localStorage.removeItem('mock_auth_user');
      localStorage.removeItem('mock_auth_role');
      localStorage.removeItem('mock_auth_email');
      set({ user: null, profile: null, isAuthenticated: false, loading: false });
      useCartStore.getState().resetCart();
      toast.success('Logged out');
      return;
    }

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
