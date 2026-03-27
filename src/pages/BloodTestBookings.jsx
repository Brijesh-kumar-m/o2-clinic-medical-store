import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isMockMode } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import { Button } from '../components/ui/Button';
import {
  FileText, Download, Calendar, User,
  MapPin, Clock, Search, Filter,
  AlertCircle, ChevronRight, Activity,
  ArrowRight, ShieldCheck, CheckCircle2, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const BloodTestBookings = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        if (isMockMode) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setBookings([
            { id: 'BK-001', blood_tests: { test_name: 'Complete Blood Count (CBC)', price: 499 }, patient_name: 'John Smith', booking_date: '2026-03-10', status: 'pending' },
            { id: 'BK-002', blood_tests: { test_name: 'Lipid Profile', price: 899 }, patient_name: 'Jane Doe', booking_date: '2026-03-05', status: 'result_ready', report_url: '#' },
            { id: 'BK-003', blood_tests: { test_name: 'Thyroid Profile', price: 750 }, patient_name: 'Robert Brown', booking_date: '2026-02-28', status: 'collected' }
          ]);
          return;
        }

        const { data, error } = await supabase
          .from('test_bookings')
          .select('*, blood_tests(test_name, price)')
          .eq('doctor_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusBadge = (status) => {
    const configs = {
      pending: { label: 'Pending Collection', color: 'bg-medical-warning/10 text-medical-warning border-medical-warning/20' },
      confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      collected: { label: 'Sample Collected', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      result_ready: { label: 'Report Ready', color: 'bg-medical-success/10 text-medical-success border-medical-success/20' },
      cancelled: { label: 'Cancelled', color: 'bg-medical-error/10 text-medical-error border-medical-error/20' }
    };
    const config = configs[status] || configs.pending;
    return (
      <Badge className={`${config.color} px-3 py-1 font-black text-[10px] uppercase tracking-wider rounded-xl`}>
        {config.label}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return b.status === 'pending' || b.status === 'confirmed';
    if (activeFilter === 'completed') return b.status === 'result_ready';
    return true;
  });

  const handleDownloadReport = (reportUrl) => {
    if (!reportUrl || reportUrl === '#') {
      toast.error('Report URL not available yet.');
      return;
    }
    window.open(reportUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Activity size={24} className="text-medical-error" />
                <span className="font-black text-xs uppercase tracking-[0.2em] text-txt-placeholder">Member Dashboard</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-txt-dark tracking-tighter">Diagnostic <span className="text-medical-error underline decoration-medical-error/10 underline-offset-8">Bookings</span></h1>
              <p className="text-txt-secondary font-bold text-lg mt-4 max-w-xl leading-relaxed">View and track all your scheduled blood test appointments. Access reports instantly upon release.</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-fit">
              {['all', 'pending', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeFilter === f ? 'bg-white text-medical-error shadow-lg shadow-black/5' : 'text-txt-placeholder hover:text-txt-dark hover:bg-white/50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />)}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-0 border-slate-200 overflow-hidden group hover:border-medical-error/20 hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center">
                  {/* Left Status Bar */}
                  <div className={`w-2 h-auto shrink-0 ${booking.status === 'result_ready' ? 'bg-medical-success' : 'bg-medical-error'}`} />

                  <div className="flex-1 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 relative overflow-hidden">
                    {/* Decorative Watermark */}
                    <div className="absolute right-0 top-0 opacity-[0.03] rotate-12 scale-150 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                      <FileText size={160} />
                    </div>

                    <div className="w-full lg:flex-1 min-w-[280px] space-y-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-2xl font-black text-txt-dark tracking-tight leading-none group-hover:text-medical-error transition-colors">
                          {booking.blood_tests?.test_name || 'Blood Test'}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-txt-placeholder">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-txt-placeholder uppercase tracking-tight">Patient</p>
                            <p className="text-sm font-bold text-txt-dark">{booking.patient_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-txt-placeholder">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-txt-placeholder uppercase tracking-tight">Date</p>
                            <p className="text-sm font-bold text-txt-dark">{booking.booking_date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-txt-placeholder">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-txt-placeholder uppercase tracking-tight">Booking Ref</p>
                            <p className="text-sm font-bold text-txt-placeholder font-mono leading-none">{booking.id.slice(0, 12)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-16 w-px bg-slate-100 hidden lg:block" />

                    <div className="lg:w-64 space-y-4 relative z-10">
                      <p className="text-3xl font-black text-txt-dark text-right lg:text-left mb-6">₹{(booking.blood_tests?.price || 0)}</p>
                      {booking.status === 'result_ready' ? (
                        <Button
                          onClick={() => handleDownloadReport(booking.report_url)}
                          className="w-full h-14 rounded-2xl bg-gradient-to-r from-medical-success to-emerald-600 shadow-xl shadow-medical-success/20 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:-translate-y-1 transition-transform group/btn"
                        >
                          <Download size={18} className="group-hover/btn:scale-110 transition-transform" /> Download Report
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-black text-txt-placeholder uppercase tracking-[0.2em] mb-2">Tracking Active</p>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${booking.status === 'collected' ? 'w-2/3 bg-purple-500' : 'w-1/3 bg-medical-warning'} animate-pulse`}
                            />
                          </div>
                          <p className="text-[10px] font-bold text-txt-secondary mt-1 uppercase tracking-tighter">Expected within 24 hours of collection</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[3rem] shadow-xl shadow-black/[0.02] border border-slate-100">
            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-txt-placeholder mb-8 animate-pulse">
              <Activity size={48} className="opacity-20" />
            </div>
            <h3 className="text-3xl font-black text-txt-dark mb-4">No Bookings Found</h3>
            <p className="text-lg text-txt-secondary max-w-sm mx-auto mb-10 leading-relaxed font-medium">You haven't scheduled any diagnostic tests yet. Get professional healthcare at your doorstep today.</p>
            <Button
              onClick={() => navigate('/blood-tests')}
              className="h-16 px-10 rounded-3xl bg-gradient-to-r from-medical-error to-red-600 shadow-2xl shadow-red-500/20 text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
            >
              Go to Blood Tests <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodTestBookings;
