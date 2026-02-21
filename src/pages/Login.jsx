import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  LogIn, UserPlus, ShieldCheck, Stethoscope,
  Mail, Lock, Smartphone, ChevronRight, ArrowLeft, Phone
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = ({ mode }) => {
  const [searchParams] = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(mode === 'register' || searchParams.get('mode') === 'register');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate auth
    login({
      id: "dr_001",
      profile: {
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "dr.rajesh@example.com",
        specialization: "General Physician",
        licenseNumber: "MCI12345"
      },
      practice: {
        name: "Kumar Clinic",
        address: "Mumbai, Maharashtra"
      }
    });
    toast.success('Welcome back, Dr. Rajesh!');
    navigate('/');
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

            <form onSubmit={handleLogin} className="space-y-6">
              {isRegistering && (
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="Rajesh" required />
                  <Input label="Last Name" placeholder="Kumar" required />
                </div>
              )}

              <Input
                label="Email Address"
                placeholder="dr.rajesh@clinic.com"
                type="email"
                required
              />

              <Input
                label="Phone Number *"
                placeholder="+91 98765 43210"
                type="tel"
                required
              />

              {isRegistering && (
                <Input
                  label="Medical License Number"
                  placeholder="MCI-123456"
                  required
                />
              )}

              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                {!isRegistering && (
                  <button className="absolute right-0 top-0 text-xs font-bold text-brand-primary hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>

              <Button className="w-full h-14 rounded-xl text-lg font-black group shadow-lg" type="submit">
                {isRegistering ? 'Submit Verification' : 'Login to Dashboard'}
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {isRegistering && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-surface-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-txt-placeholder font-black tracking-widest">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      login({
                        id: "google_dr_002",
                        profile: {
                          firstName: "Google",
                          lastName: "User",
                          email: "google.user@gmail.com",
                          specialization: "Surgeon",
                          licenseNumber: "G-98765"
                        },
                        practice: {
                          name: "Google Health Center",
                          address: "California, USA"
                        }
                      });
                      toast.success('Signed in with Google successfully!');
                      navigate('/');
                    }}
                    className="w-full h-14 rounded-xl border-2 border-surface-border bg-white hover:bg-surface-light flex items-center justify-center gap-3 transition-all font-bold shadow-sm group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}
            </form>

            <div className="mt-2xl pt-xl border-t border-surface-border text-center">
              <p className="text-txt-secondary font-medium">
                {isRegistering ? 'Already have an account?' : 'New healthcare partner?'}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="ml-2 text-brand-primary font-black hover:underline"
                >
                  {isRegistering ? 'Sign In' : 'Register Now'}
                </button>
              </p>

              {!isRegistering && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      login({
                        id: "admin_001",
                        role: "admin",
                        profile: { firstName: "Admin", lastName: "User", email: "admin@o2clinic.com" }
                      });
                      toast.success("Welcome, Admin!");
                      navigate('/admin');
                    }}
                    className="text-xs text-txt-placeholder hover:text-brand-dark font-bold uppercase tracking-widest border border-surface-border px-3 py-1 rounded-full hover:bg-surface-light transition-all"
                  >
                    Secret Admin Login
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
