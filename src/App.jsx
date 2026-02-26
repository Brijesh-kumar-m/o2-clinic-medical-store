
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Wishlist from './pages/Wishlist';
import Support from './pages/Support';
import Legal from './pages/Legal';
import Unauthorized from './pages/Unauthorized';

import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

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
          className: 'bg-white text-txt-primary shadow-lg rounded-lg border border-surface-border',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0F172A',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login mode="register" />} />
          <Route path="support" element={<Support />} />
          <Route path="legal" element={<Legal />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes */}
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
          
          {/* Admin Routes */}
          <Route path="admin/login" element={<AdminLogin />} />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']} unauthenticatedTo="/admin/login" unauthorizedTo="/admin/login">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
