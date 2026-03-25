
import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import { Loader2 } from 'lucide-react';

// === EAGERLY LOADED — Critical path pages ===
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Unauthorized from './pages/Unauthorized';
import ApprovalPending from './pages/ApprovalPending';

// === LAZILY LOADED — Non-critical pages ===
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Support = lazy(() => import('./pages/Support'));
const Legal = lazy(() => import('./pages/Legal'));

// Blood Test Module — Lazily loaded
const BloodTests = lazy(() => import('./pages/BloodTests'));
const BloodTestDetail = lazy(() => import('./pages/BloodTestDetail'));
const BloodTestBookings = lazy(() => import('./pages/BloodTestBookings'));
const AdminBloodTests = lazy(() => import('./pages/AdminBloodTests'));
const AdminTestBookings = lazy(() => import('./pages/AdminTestBookings'));

import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

// Full-screen fallback for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bg gap-4">
    <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
    </div>
    <p className="text-sm font-semibold text-txt-secondary">Loading...</p>
  </div>
);

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0F172A',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
            fontWeight: 600,
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* ── Public Routes ── */}
            <Route index element={<Home />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Login mode="register" />} />
            <Route path="support" element={<Support />} />
            <Route path="legal" element={<Legal />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="blood-tests" element={<BloodTests />} />
            <Route path="blood-tests/:id" element={<BloodTestDetail />} />

            {/* ── Approval Pending (authenticated but not approved) ── */}
            <Route path="approval-pending" element={<ApprovalPending />} />

            {/* ── Protected Routes (requires auth + approved) ── */}
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="blood-test-bookings"
              element={
                <ProtectedRoute>
                  <BloodTestBookings />
                </ProtectedRoute>
              }
            />

            {/* ── Admin Routes (requires role=admin) ── */}
            <Route path="admin/login" element={<AdminLogin />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute
                  allowedRoles={['admin']}
                  unauthenticatedTo="/admin/login"
                  unauthorizedTo="/admin/login"
                  requiresApproval={false}
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/blood-tests"
              element={
                <ProtectedRoute
                  allowedRoles={['admin']}
                  unauthenticatedTo="/admin/login"
                  unauthorizedTo="/admin/login"
                  requiresApproval={false}
                >
                  <AdminBloodTests />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/test-bookings"
              element={
                <ProtectedRoute
                  allowedRoles={['admin']}
                  unauthenticatedTo="/admin/login"
                  unauthorizedTo="/admin/login"
                  requiresApproval={false}
                >
                  <AdminTestBookings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
