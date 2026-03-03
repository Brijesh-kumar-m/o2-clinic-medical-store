import React, { useState, useEffect } from 'react';
import { supabase, isMockMode } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  LayoutDashboard, ShoppingBag, PlusCircle, Users,
  Settings, Search, Package, Menu, X, LogOut,
  CheckCircle2, XCircle, Beaker, ClipboardList,
  ChevronRight, Box, Edit, Trash2, ShieldCheck,
  RefreshCw, Droplet, FileText, Upload, Smartphone,
  Activity, ArrowRight, Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AdminTestBookings = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [reportUrl, setReportUrl] = useState('');

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      if (isMockMode) {
        setBookings([
          { id: 'BK-001', test_id: 'bt-1', blood_tests: { test_name: 'CBC' }, patient_name: 'John Smith', mobile: '9876543210', status: 'pending', booking_date: '2026-03-10' },
          { id: 'BK-002', test_id: 'bt-2', blood_tests: { test_name: 'Lipid Profile' }, patient_name: 'Jane Doe', mobile: '1234567890', status: 'collected', booking_date: '2026-03-05' }
        ]);
        return;
      }
      const { data, error } = await supabase
        .from('test_bookings')
        .select('*, blood_tests(test_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load test bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (isMockMode) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        toast.success(`Booking ${id.slice(0, 8)} updated to ${newStatus}`);
        return;
      }

      const { error } = await supabase
        .from('test_bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleReportUpload = async (e) => {
    e.preventDefault();
    if (!reportUrl) return;
    setUpdatingId(selectedBooking.id);
    try {
      if (isMockMode) {
        setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, status: 'result_ready', report_url: reportUrl } : b));
        toast.success('Report URL saved successfully');
        setSelectedBooking(null);
        setReportUrl('');
        return;
      }

      const { error } = await supabase
        .from('test_bookings')
        .update({ status: 'result_ready', report_url: reportUrl })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, status: 'result_ready', report_url: reportUrl } : b));
      toast.success('Report URL saved successfully');
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Failed to save report URL');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { label: 'Pending', variant: 'warning' },
      confirmed: { label: 'Confirmed', variant: 'info' },
      collected: { label: 'Sample Collected', variant: 'default' },
      result_ready: { label: 'Ready', variant: 'success' },
      cancelled: { label: 'Cancelled', variant: 'error' }
    };
    const config = configs[status] || configs.pending;
    return (
      <Badge variant={config.variant} className="px-3 py-1 font-black text-[10px] uppercase tracking-wider rounded-xl">
        {config.label}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(b =>
    b.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.mobile.includes(searchQuery) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-bg flex">
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-surface-border shadow-xl lg:shadow-sm flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-black text-txt-dark">Admin</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-txt-secondary hover:bg-surface-bg transition-all">
            <LayoutDashboard className="w-5 h-5" /> Dashboard Overview
          </Link>
          <Link to="/admin/blood-tests" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-txt-secondary hover:bg-surface-bg transition-all">
            <Droplet className="w-5 h-5" /> Blood Test Catalog
          </Link>
          <Link to="/admin/test-bookings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-medical-error to-red-600 text-white shadow-lg shadow-red-500/20">
            <ClipboardList className="w-5 h-5" /> Patient Bookings
          </Link>
          <div className="border-t border-surface-border my-6 opacity-30" />
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-txt-secondary hover:bg-surface-bg transition-all">
            <ArrowRight className="w-5 h-5" /> View Live Store
          </Link>
        </nav>
        <div className="p-4 border-t border-surface-border">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-medical-error hover:bg-medical-error/5 transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-border px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6" /></button>
            <h1 className="text-2xl font-black text-txt-dark">Diagnostic Bookings</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-placeholder group-focus-within:text-medical-error transition-colors" />
              <input
                type="text"
                placeholder="Search patient, mobile or booking ID..."
                className="pl-10 pr-4 py-2.5 w-72 rounded-xl border border-surface-border bg-surface-bg/50 text-sm outline-none focus:ring-2 focus:ring-medical-error/10 focus:border-medical-error/20"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-error to-red-600 flex items-center justify-center text-white font-bold shadow-md">A</div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-medical-error to-red-600 text-white rounded-[2rem] shadow-xl shadow-red-500/15">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-red-100 mb-1">Active Bookings</h4>
              <h3 className="text-3xl font-black">{bookings.filter(b => b.status !== 'result_ready' && b.status !== 'cancelled').length}</h3>
            </Card>
            <Card className="p-6 bg-white border-slate-200 rounded-[2rem]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-txt-placeholder mb-1">Pending Collection</h4>
              <h3 className="text-3xl font-black text-txt-dark">{bookings.filter(b => b.status === 'pending').length}</h3>
            </Card>
            <Card className="p-6 bg-white border-slate-200 rounded-[2rem]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-txt-placeholder mb-1">Reports Delivered</h4>
              <h3 className="text-3xl font-black text-medical-success">{bookings.filter(b => b.status === 'result_ready').length}</h3>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Patient Details</th>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Test Ordered</th>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Appointment</th>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-txt-placeholder group-hover:bg-medical-error/10 group-hover:text-medical-error transition-colors">
                            <Users size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-txt-dark">{booking.patient_name}</p>
                            <p className="text-[10px] text-txt-placeholder mt-0.5 font-bold flex items-center gap-1">
                              <Smartphone size={10} /> {booking.mobile}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-txt-dark">{booking.blood_tests?.test_name || 'Blood Test'}</p>
                        <p className="text-[10px] text-txt-placeholder mt-0.5 font-mono uppercase">ID: {booking.id.slice(0, 8)}</p>
                      </td>
                      <td className="px-8 py-6">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-txt-dark">{booking.booking_date}</p>
                        <p className="text-[10px] text-txt-placeholder mt-0.5 font-black uppercase tracking-tighter">{booking.time_slot}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5">
                          {booking.status === 'pending' && (
                            <button onClick={() => handleStatusChange(booking.id, 'confirmed')} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:scale-110 transition-transform" title="Confirm Booking"><CheckCircle2 size={16} /></button>
                          )}
                          {booking.status === 'confirmed' && (
                            <button onClick={() => handleStatusChange(booking.id, 'collected')} className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:scale-110 transition-transform" title="Sample Collected"><Beaker size={16} /></button>
                          )}
                          <button onClick={() => { setSelectedBooking(booking); setReportUrl(booking.report_url || ''); }} className="p-2 rounded-lg bg-green-50 text-green-600 hover:scale-110 transition-transform" title="Upload Report"><Upload size={16} /></button>
                          <button onClick={() => handleStatusChange(booking.id, 'cancelled')} className="p-2 rounded-lg bg-red-50 text-red-600 hover:scale-110 transition-transform" title="Cancel Booking"><XCircle size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Upload Modal Overlay */}
        {selectedBooking && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-xl rounded-[2.5rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-medical-success/10 text-medical-success flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-txt-dark">Release Diagnostic Report</h2>
                    <p className="text-xs font-bold text-txt-secondary mt-0.5 uppercase tracking-tight">Patient: {selectedBooking.patient_name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-txt-placeholder hover:text-medical-error transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleReportUpload} className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-txt-placeholder uppercase tracking-widest ml-1">Secure Report URL (PDF)</label>
                  <div className="relative group">
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-placeholder group-focus-within:text-medical-success transition-colors" size={20} />
                    <input
                      required
                      type="url"
                      placeholder="https://example.com/reports/id123.pdf"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-medical-success/20 outline-none transition-all font-bold"
                      value={reportUrl}
                      onChange={e => setReportUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-4">
                  <ShieldCheck className="text-blue-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-blue-600 font-bold leading-relaxed tracking-tight underline-offset-4 decoration-blue-200 decoration-2">
                    Once uploaded, the status will automatically change to <span className="uppercase text-blue-700">Result Ready</span> and the patient/doctor will be notified.
                  </p>
                </div>
                <Button type="submit" disabled={updatingId === selectedBooking.id} className="w-full h-16 rounded-2xl bg-gradient-to-r from-medical-success to-emerald-600 shadow-xl shadow-medical-success/20 text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:-translate-y-1 transition-transform disabled:opacity-50">
                  {updatingId === selectedBooking.id ? <RefreshCw className="animate-spin" /> : <><Save size={20} /> Save & Release Report</>}
                </Button>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTestBookings;
