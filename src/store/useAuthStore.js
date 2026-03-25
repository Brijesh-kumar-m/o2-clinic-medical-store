
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
  status: 'approved' // Demo user is always approved for mock testing
};

// Internal helper: fetch profile row, returns null on error.
// Supports both common schema variants:
// - profiles.id === auth.users.id
// - profiles.user_id === auth.users.id
const fetchProfileById = async (userId) => {
  try {
    // 1) Try matching on `id`
    const { data: byId, error: byIdError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1);

    if (byIdError) {
      console.warn('Error fetching profile by id:', byIdError.message);
    }
    if (byId?.[0]) return byId[0];

    // 2) Fallback to `user_id`
    const { data: byUserId, error: byUserIdError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .limit(1);

    if (byUserIdError) {
      console.warn('Error fetching profile by user_id:', byUserIdError.message);
    }

    return byUserId?.[0] || null;
  } catch (e) {
    console.warn('Profile fetch exception:', e);
    return null;
  }
};

const fetchProfileByIdWithRetry = async (userId, attempts = 3, delayMs = 600) => {
  for (let i = 0; i < attempts; i += 1) {
    const profile = await fetchProfileById(userId);
    if (profile) return profile;
    if (i < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return null;
};

const normalizeProfile = (profile) => {
  if (!profile) return profile;
  return {
    ...profile,
    role: profile.role ? String(profile.role).toLowerCase() : profile.role,
    status: profile.status ? String(profile.status).toLowerCase() : profile.status,
  };
};

const formatSupabaseError = (error) => {
  const message = error?.message ? String(error.message) : String(error);
  const lower = message.toLowerCase();
  if (lower.includes('failed to fetch')) {
    return 'Network/CORS error: Supabase is unreachable from your browser. Check internet/VPN and `VITE_SUPABASE_URL`.';
  }
  if (lower.includes('cors')) {
    return 'CORS error: Supabase requests are blocked. Check browser console and your network/VPN settings.';
  }
  return message;
};

export const useAuthStore = create((set, get) => {
  // Store the Supabase auth subscription so we can clean it up on re-init
  let _subscription = null;

  return {
    user: null,
    profile: null,
    isAuthenticated: false,
    loading: true,

    // Initialize session on app start
    initializeAuth: async () => {
      set({ loading: true });

      // Clean up any existing listener before creating a new one
      if (_subscription) {
        _subscription.unsubscribe();
        _subscription = null;
      }

      try {
        // ─── MOCK MODE ────────────────────────────────────────────────
        if (isMockMode) {
          const isMockAuth = localStorage.getItem('mock_auth_user');
          if (isMockAuth) {
            const storedRole = localStorage.getItem('mock_auth_role') || 'doctor';
            const storedEmail = localStorage.getItem('mock_auth_email') || '';
            const isAdmin = storedRole === 'admin';
            const profile = isAdmin
              ? { ...MOCK_ADMIN_PROFILE, email: storedEmail || MOCK_ADMIN_PROFILE.email }
              : { ...MOCK_DOCTOR_PROFILE, email: storedEmail || MOCK_DOCTOR_PROFILE.email };

            set({
              user: { ...MOCK_USER, id: profile.id, email: profile.email },
              profile,
              isAuthenticated: true,
              loading: false,
            });
            useCartStore.getState().fetchCart();
            return;
          }
          set({ user: null, profile: null, isAuthenticated: false, loading: false });
          return;
        }

        // ─── REAL SUPABASE ─────────────────────────────────────────────
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          const profile = normalizeProfile(
            await fetchProfileByIdWithRetry(session.user.id, 3, 600)
          );
          // If we can't load the profile row, treat the session as unusable.
          // This keeps login redirect + ProtectedRoute role/status checks consistent.
          if (!profile) {
            console.warn('Profile missing for authenticated session; signing out.');
            try { await supabase.auth.signOut(); } catch { /* ignore */ }
            useCartStore.getState().resetCart();
            set({ user: null, profile: null, isAuthenticated: false, loading: false });
            return;
          }

          set({ user: session.user, profile, isAuthenticated: true, loading: false });
          useCartStore.getState().fetchCart();
        } else {
          set({ user: null, profile: null, isAuthenticated: false, loading: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        set({ user: null, profile: null, isAuthenticated: false, loading: false });
      }

      // ─── REALTIME AUTH LISTENER ──────────────────────────────────────
      // Only set up the listener once for real Supabase mode
      if (!isMockMode) {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            try {
              if (session?.user) {
                const profile = normalizeProfile(await fetchProfileById(session.user.id));
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
          }
        );
        _subscription = authListener?.subscription;
      }
    },

    login: async (email, password) => {
      set({ loading: true });

      // Input sanity check
      if (!email || !password) {
        toast.error('Email and password are required.');
        set({ loading: false });
        return false;
      }

      // ─── MOCK MODE ────────────────────────────────────────────────
      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const normalizedEmail = String(email).trim().toLowerCase();
        const isAdminLogin =
          normalizedEmail === MOCK_ADMIN_CREDENTIALS.email.toLowerCase() &&
          password === MOCK_ADMIN_CREDENTIALS.password;

        const profile = isAdminLogin
          ? { ...MOCK_ADMIN_PROFILE }
          : { ...MOCK_DOCTOR_PROFILE, email };

        localStorage.setItem('mock_auth_user', 'true');
        localStorage.setItem('mock_auth_role', profile.role);
        localStorage.setItem('mock_auth_email', email);

        set({
          user: { ...MOCK_USER, id: profile.id, email },
          profile,
          isAuthenticated: true,
          loading: false,
        });
        useCartStore.getState().fetchCart();
        toast.success('Logged in (Mock Mode)');
        return true;
      }

      // ─── REAL SUPABASE ─────────────────────────────────────────────
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email first. Check your inbox.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password.');
        } else {
          toast.error(formatSupabaseError(error));
        }
        set({ loading: false });
        return false;
      }

      try {
        const signedInUser = data?.session?.user || data?.user;

        if (!signedInUser) {
          set({ user: null, profile: null, isAuthenticated: false, loading: false });
          toast.error('Login failed. Please try again.');
          return false;
        }

        const profile = normalizeProfile(await fetchProfileByIdWithRetry(signedInUser.id, 3, 600));
        if (!profile) {
          console.warn('Profile missing after login; signing out.');
          try { await supabase.auth.signOut(); } catch { /* ignore */ }
          useCartStore.getState().resetCart();
          set({ user: null, profile: null, isAuthenticated: false, loading: false });
          toast.error('Your account profile could not be loaded. Please contact admin.');
          return false;
        }

        set({ user: signedInUser, profile, isAuthenticated: true, loading: false });
        useCartStore.getState().fetchCart();
        toast.success('Logged in successfully');
        return true;
      } catch (e) {
        console.error('Post-login state update failed:', e);
        set({ loading: false });
        return true; // Auth succeeded even if profile fetch failed
      }
    },

    loginAdmin: async (email, password) => {
      set({ loading: true });

      if (!email || !password) {
        toast.error('Email and password are required.');
        set({ loading: false });
        return false;
      }

      // ─── MOCK MODE ────────────────────────────────────────────────
      if (isMockMode) {
        const normalizedEmail = String(email).trim().toLowerCase();
        const isMockAdmin =
          normalizedEmail === MOCK_ADMIN_CREDENTIALS.email.toLowerCase() &&
          password === MOCK_ADMIN_CREDENTIALS.password;

        if (!isMockAdmin) {
          set({ loading: false });
          toast.error('Invalid admin credentials.');
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
          loading: false,
        });
        useCartStore.getState().fetchCart();
        toast.success('Admin login successful (Mock Mode)');
        return true;
      }

      // ─── REAL SUPABASE ─────────────────────────────────────────────
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Email not confirmed. Please check Supabase Auth settings.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid admin credentials.');
        } else {
          toast.error(formatSupabaseError(error));
        }
        set({ loading: false });
        return false;
      }

      const signedInUser = data?.session?.user || data?.user;
      const profile = signedInUser ? normalizeProfile(await fetchProfileById(signedInUser.id)) : null;

      if (!profile || profile.role !== 'admin') {
        try { await supabase.auth.signOut(); } catch { /* ignore */ }
        set({ user: null, profile: null, isAuthenticated: false, loading: false });
        useCartStore.getState().resetCart();
        toast.error('Access denied. Admin credentials required.');
        return false;
      }

      set({ user: signedInUser, profile, isAuthenticated: true, loading: false });
      useCartStore.getState().fetchCart();
      toast.success('Admin login successful');
      return true;
    },

    register: async (email, password, metadata) => {
      set({ loading: true });

      // Validate inputs
      if (!email || !password) {
        toast.error('Email and password are required.');
        set({ loading: false });
        return false;
      }
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters.');
        set({ loading: false });
        return false;
      }

      // ─── MOCK MODE ────────────────────────────────────────────────
      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        // In mock mode, simulate the approval pending state
        const mockProfile = {
          ...MOCK_DOCTOR_PROFILE,
          email,
          ...metadata,
          role: metadata?.role || 'doctor',
          status: 'pending', // Requires admin approval
        };
        localStorage.setItem('mock_auth_user', 'true');
        localStorage.setItem('mock_auth_role', mockProfile.role);
        localStorage.setItem('mock_auth_email', email);

        set({
          user: { ...MOCK_USER, email, user_metadata: metadata },
          profile: mockProfile,
          isAuthenticated: true,
          loading: false,
        });
        toast.success('Registration successful! Awaiting admin approval.');
        return true;
      }

      // ─── REAL SUPABASE ─────────────────────────────────────────────
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            status: 'pending', // Will be used by DB trigger to set initial status
          },
        },
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          toast.error('Too many requests. Please wait a moment and try again.');
        } else if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          toast.error('An account with this email already exists. Please login instead.');
        } else if (error.message.includes('signups are disabled')) {
          toast.error('Signups are currently disabled. Please contact support.');
        } else {
          toast.error(formatSupabaseError(error));
        }
        set({ loading: false });
        return false;
      }

      // If email confirmation is off, user is logged in immediately
      if (data?.session) {
        const profile = normalizeProfile(
          await fetchProfileByIdWithRetry(data.session.user.id, 3, 600)
        );

        // If profile isn't available yet, don't leave the app in a half-authenticated state.
        // (Some setups rely on DB triggers; profile will be available after they run.)
        if (!profile) {
          console.warn('Profile missing after registration session; signing out.');
          try { await supabase.auth.signOut(); } catch { /* ignore */ }
          useCartStore.getState().resetCart();
          set({ user: null, profile: null, isAuthenticated: false, loading: false });
          toast.error('Registration succeeded but profile data is not ready yet. Please try logging in again.');
          return false;
        }

        set({ user: data.session.user, profile, isAuthenticated: true, loading: false });
        useCartStore.getState().fetchCart();
        toast.success('Registration submitted! Your account is awaiting admin approval.');
        return true;
      }

      // Email confirmation required
      toast.success('Registration submitted! Please check your email to confirm, then await admin approval.');
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
      set({ user: null, profile: null, isAuthenticated: false, loading: false });
      useCartStore.getState().resetCart();
      toast.success('Logged out');
    },

    updateProfile: async (updates) => {
      const { user } = get();
      if (!user) return false;

      if (isMockMode) {
        set((state) => ({ profile: { ...state.profile, ...updates } }));
        toast.success('Profile updated (Mock Mode)');
        return true;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile: ' + error.message);
        return false;
      }

      set((state) => ({ profile: { ...state.profile, ...updates } }));
      toast.success('Profile updated successfully');
      return true;
    },

    // Refresh profile from DB (useful after admin approval)
    refreshProfile: async () => {
      const { user } = get();
      if (!user || isMockMode) return;
      const profile = normalizeProfile(await fetchProfileByIdWithRetry(user.id, 2, 500));
      if (profile) set({ profile });
    },
  };
});
