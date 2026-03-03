import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Clock, ShieldCheck, Mail, LogOut, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApprovalPending = () => {
  const { profile, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-md">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-medical-warning/10 rounded-full flex items-center justify-center">
          <Clock className="w-12 h-12 text-medical-warning" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-txt-dark mb-4">
          Account Pending Approval
        </h1>

        {/* Description */}
        <p className="text-txt-secondary text-lg mb-8 leading-relaxed">
          Thank you for registering, <strong className="text-txt-dark">{profile?.first_name || 'Doctor'}</strong>!
          Your account is currently under review by our admin team.
          You'll receive full access once your medical credentials are verified.
        </p>

        {/* Status Card */}
        <div className="bg-white rounded-2xl border-2 border-medical-warning/20 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-surface-border">
            <span className="text-sm font-bold text-txt-secondary">Account Status</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-medical-warning/10 text-medical-warning text-xs font-bold border border-medical-warning/20">
              <Clock className="w-3 h-3" />
              Pending Review
            </span>
          </div>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="w-4 h-4 text-txt-placeholder" />
              <span className="text-txt-secondary">License verification in progress</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-txt-placeholder" />
              <span className="text-txt-secondary">Email: {profile?.email || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-surface-bg rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-bold text-txt-dark mb-3">What happens next?</h3>
          <ol className="space-y-2 text-sm text-txt-secondary">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
              Our team verifies your medical license
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
              You'll be notified once approved
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary/60 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">3</span>
              Full access to wholesale pricing & ordering
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Check Status
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="gap-2 text-medical-error hover:bg-medical-error/10">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPending;
