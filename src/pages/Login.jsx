
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import {
  LogIn, UserPlus, ShieldCheck, Stethoscope,
  ChevronRight, Eye, EyeOff, AlertCircle, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { isMockMode } from '../lib/supabase';

const Login = ({ mode }) => {
  const [searchParams] = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(mode === 'register' || searchParams.get('mode') === 'register');
  const { login, register, loading, isAuthenticated, profile } = useAuthStore();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    if (profile.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (profile.status === 'approved') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/approval-pending', { replace: true });
    }
  }, [isAuthenticated, profile, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side form validation
  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isRegistering) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s+\-()]/g, ''))) {
        newErrors.phone = 'Enter a valid 10-digit Indian phone number';
      }

      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'Medical license number is required';
      } else if (formData.licenseNumber.trim().length < 5) {
        newErrors.licenseNumber = 'Enter a valid license number';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isRegistering) {
      const success = await register(formData.email.trim().toLowerCase(), formData.password, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.replace(/[\s+\-()]/g, ''),
        license_number: formData.licenseNumber.trim().toUpperCase(),
        role: 'doctor',
      });

      if (success) {
        setSuccessMessage('Registration submitted! Your account is awaiting admin approval.');
        setIsRegistering(false);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } else {
      const success = await login(formData.email.trim().toLowerCase(), formData.password);
      if (!success) {
        // Toast is handled in the store
      }
    }
  };

  const switchMode = () => {
    setIsRegistering(prev => !prev);
    setSuccessMessage('');
    setErrors({});
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-surface-bg to-surface-bg">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">

        {/* Brand Side */}
        <div className="hidden lg:flex flex-col gap-xl pr-xl">
          <Link to="/" className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white shadow-xl">
              <span className="font-black text-2xl">M</span>
            </div>
            <span className="font-black text-3xl text-brand-primary tracking-tighter">O2Clinic</span>
          </Link>
          <h2 className="text-5xl font-black text-txt-dark leading-tight">
            Exclusive Portal for <span className="gradient-text">Medical Professionals</span>
          </h2>
          <p className="text-lg text-txt-secondary leading-relaxed">
            Access wholesale pricing, dedicated pharmaceutical support, and rapid distribution for your clinic or hospital.
          </p>

          <div className="space-y-6 mt-xl">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-medical-success/10 flex items-center justify-center text-medical-success">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="font-bold text-txt-dark">MCI & Drug License Verified</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <Stethoscope className="w-6 h-6" />
              </div>
              <p className="font-bold text-txt-dark">5000+ Registered Healthcare Practitioners</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-medical-warning/10 flex items-center justify-center text-medical-warning">
                <Clock className="w-6 h-6" />
              </div>
              <p className="font-bold text-txt-dark">Admin-verified accounts for secure access</p>
            </div>
          </div>

          {/* Mock mode hint */}
          {isMockMode && (
            <div className="mt-xl p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-bold text-amber-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Demo Mode — Login: any email / any password (or admin@demo.com / admin123)
              </p>
            </div>
          )}
        </div>

        {/* Form Side */}
        <Card className="border-2 border-surface-border shadow-2xl p-0 overflow-hidden">
          <CardContent className="p-xl md:p-4xl">
            <div className="mb-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-md">
                {isRegistering ? <UserPlus className="w-8 h-8" /> : <LogIn className="w-8 h-8" />}
              </div>
              <h3 className="text-3xl font-black text-txt-dark">
                {isRegistering ? 'Create Practice Account' : 'Partner Login'}
              </h3>
              <p className="text-txt-secondary mt-2">
                {isRegistering
                  ? 'Register for admin approval and wholesale access'
                  : 'Enter your professional credentials to continue'}
              </p>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Account Submitted!</h4>
                  <p className="text-sm opacity-90">{successMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {isRegistering && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Rajesh"
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Kumar"
                    error={errors.lastName}
                    required
                  />
                </div>
              )}

              <Input
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="dr.rajesh@clinic.com"
                type="email"
                error={errors.email}
                required
              />

              {isRegistering && (
                <>
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    type="tel"
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="Medical License Number"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="MCI-123456"
                    error={errors.licenseNumber}
                    required
                  />
                </>
              )}

              {/* Password with show/hide toggle */}
              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 bottom-3 text-txt-placeholder hover:text-txt-dark transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {isRegistering && (
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  required
                />
              )}

              {/* Forgot Password */}
              {!isRegistering && (
                <div className="flex justify-end -mt-2">
                  <button
                    type="button"
                    className="text-xs font-bold text-brand-primary hover:underline"
                    onClick={() => toast('Password reset via Supabase Magic Link — contact admin.')}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button
                className="w-full h-14 rounded-xl text-lg font-black group shadow-lg"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Processing...'
                  : isRegistering
                    ? 'Submit for Approval'
                    : 'Login to Dashboard'}
                {!loading && <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            {/* Toggle Register/Login */}
            <div className="mt-2xl pt-xl border-t border-surface-border text-center">
              <p className="text-txt-secondary font-medium">
                {isRegistering ? 'Already have an account?' : 'New healthcare partner?'}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-2 text-brand-primary font-black hover:underline"
                >
                  {isRegistering ? 'Sign In' : 'Register Now'}
                </button>
              </p>

              {/* Admin login shortcut */}
              <Link
                to="/admin/login"
                className="block mt-4 text-xs text-txt-placeholder hover:text-txt-dark transition-colors font-medium"
              >
                Admin login →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
