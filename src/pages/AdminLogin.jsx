import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { isMockMode } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { ShieldCheck, Lock, AlertCircle, Loader2, ChevronRight, KeyRound, LayoutDashboard } from 'lucide-react';
import Logo from '../components/ui/Logo';

const AdminLogin = () => {
  const { loginAdmin, loading, isAuthenticated, profile } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!profile) return;

    if (profile.role === 'admin') {
      navigate('/admin');
      return;
    }
  }, [isAuthenticated, profile, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await loginAdmin(formData.email, formData.password);

    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-md relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-surface-bg to-surface-bg" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
        {/* Left Side - Info */}
        <div className="hidden lg:flex flex-col gap-xl pr-xl">
          <Link to="/" className="flex items-center gap-3 mb-2 group">
            <Logo className="w-12 h-12" />
          </Link>
          <h2 className="text-4xl xl:text-5xl font-black text-txt-dark leading-tight">
            Admin <span className="gradient-text">Control Panel</span>
          </h2>
          <p className="text-lg text-txt-secondary leading-relaxed">
            Manage orders, approvals, inventory, and settings securely from one place.
          </p>

          <div className="space-y-5 mt-xl">
            <div className="flex gap-4 items-center group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-medical-success/10 flex items-center justify-center text-medical-success group-hover:scale-110 transition-transform duration-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-txt-dark">Role-Based Access</p>
                <p className="text-sm text-txt-secondary">Admin-only restricted area</p>
              </div>
            </div>
            <div className="flex gap-4 items-center group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-200">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-txt-dark">Secure Authentication</p>
                <p className="text-sm text-txt-secondary">Encrypted login credentials</p>
              </div>
            </div>
            <div className="flex gap-4 items-center group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform duration-200">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-txt-dark">Full Dashboard Access</p>
                <p className="text-sm text-txt-secondary">Orders, products, users & settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="border-2 border-surface-border shadow-2xl p-0 overflow-hidden hover:shadow-2xl">
          <CardContent className="p-xl md:p-4xl">
            <div className="mb-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-2xl flex items-center justify-center text-white mb-md shadow-lg shadow-brand-primary/25">
                <KeyRound className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-txt-dark">Admin Login</h3>
              <p className="text-sm text-txt-secondary mt-2 max-w-[280px]">
                Enter your admin credentials to access the management dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Admin Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@yourdomain.com"
                type="email"
                required
              />

              <Input
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                required
              />

              <div className="pt-2">
                <Button
                  className="w-full h-14 rounded-xl text-base font-black group shadow-lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-5 h-5" /> Login <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-2xl pt-xl border-t border-surface-border">
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-bg/60 border border-surface-border/50">
                <AlertCircle className="w-4 h-4 text-txt-placeholder shrink-0" />
                <p className="text-xs text-txt-placeholder text-center">
                  {isMockMode
                    ? 'Demo Mode — Use: admin@demo.com / admin123'
                    : 'Production — Use your Supabase admin account'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
