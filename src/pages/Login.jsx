
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import {
  LogIn, UserPlus, ShieldCheck, Stethoscope,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = ({ mode }) => {
  const [searchParams] = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(mode === 'register' || searchParams.get('mode') === 'register');
  const { login, register, loading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', { isRegistering, formData });
    
    if (isRegistering) {
      const success = await register(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        license_number: formData.licenseNumber,
        role: 'doctor', // Default role, or could be 'pharmacy'
      });
      if (success) {
        console.log('Registration successful');
        setSuccessMessage('Registration successful! Please login now.');
        setIsRegistering(false);
        // Clear sensitive data but keep email for login
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        console.error('Registration failed');
      }
    } else {
      const success = await login(formData.email, formData.password);
      if (success) {
        console.log('Login successful');
        navigate('/');
      } else {
        console.error('Login failed');
      }
    }
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
            <span className="font-black text-3xl text-brand-primary tracking-tighter">MediWholesale Pro</span>
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
              <p className="font-bold text-txt-dark">MCI & Drug License Verified Partners</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <Stethoscope className="w-6 h-6" />
              </div>
              <p className="font-bold text-txt-dark">5000+ Registered Healthcare Practitioners</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <Card className="border-2 border-surface-border shadow-2xl p-0 overflow-hidden">
          <CardContent className="p-xl md:p-4xl">
            <div className="mb-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-md">
                {isRegistering ? <UserPlus className="w-8 h-8" /> : <LogIn className="w-8 h-8" />}
              </div>
              <h3 className="text-3xl font-black text-txt-dark">{isRegistering ? 'Create Practice Account' : 'Partner Login'}</h3>
              <p className="text-txt-secondary mt-2">Enter your professional credentials to continue</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Registration Successful!</h4>
                  <p className="text-sm opacity-90">{successMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegistering && (
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="First Name" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Rajesh" 
                    required 
                  />
                  <Input 
                    label="Last Name" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Kumar" 
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
                required
              />

              {isRegistering && (
                <Input
                  label="Phone Number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  type="tel"
                  required
                />
              )}

              {isRegistering && (
                <Input
                  label="Medical License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="MCI-123456"
                  required
                />
              )}

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="••••••••"
                  required
                />
                {!isRegistering && (
                  <button type="button" className="absolute right-0 top-0 text-xs font-bold text-brand-primary hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>

              <Button 
                className="w-full h-14 rounded-xl text-lg font-black group shadow-lg" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isRegistering ? 'Submit Verification' : 'Login to Dashboard')}
                {!loading && <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>

            </form>

            <div className="mt-2xl pt-xl border-t border-surface-border text-center">
              <p className="text-txt-secondary font-medium">
                {isRegistering ? 'Already have an account?' : 'New healthcare partner?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setSuccessMessage('');
                  }}
                  className="ml-2 text-brand-primary font-black hover:underline"
                >
                  {isRegistering ? 'Sign In' : 'Register Now'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
