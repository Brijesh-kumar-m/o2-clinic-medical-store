import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, isMockMode } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  ChevronLeft, Clock, Beaker, ShieldCheck, Info,
  MapPin, User, Calendar, Smartphone, Activity,
  CheckCircle2, AlertCircle, Sparkles, Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const BloodTestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [test, setTest] = useState(null);
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'male',
    mobile: '',
    address: '',
    booking_date: new Date().toISOString().split('T')[0],
    time_slot: 'morning'
  });

  const timeSlots = [
    { id: 'morning', label: 'Morning (8AM - 11AM)', icon: '☀️' },
    { id: 'afternoon', label: 'Afternoon (12PM - 3PM)', icon: '⛅' },
    { id: 'evening', label: 'Evening (4PM - 7PM)', icon: '🌙' }
  ];

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        if (isMockMode) {
          await new Promise(resolve => setTimeout(resolve, 800));
          // Mock tests map
          const mockTests = {
            'bt-1': { id: 'bt-1', test_name: 'Complete Blood Count (CBC)', category: 'General', price: 399, mrp: 499, discount: 20, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-2': { id: 'bt-2', test_name: 'Lipid Profile', category: 'Heart', price: 699, mrp: 899, discount: 22, preparation: '9–12 hours fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-3': { id: 'bt-3', test_name: 'Thyroid Profile (T3, T4, TSH)', category: 'Hormonal', price: 750, mrp: null, discount: 0, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-4': { id: 'bt-4', test_name: 'Diabetes Screen (HbA1c)', category: 'Diabetes', price: 449, mrp: 550, discount: 18, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-5': { id: 'bt-5', test_name: 'Liver Function Test (LFT)', category: 'General', price: 950, mrp: null, discount: 0, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-6': { id: 'bt-6', test_name: 'Kidney Function Test (KFT)', category: 'General', price: 699, mrp: 850, discount: 18, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-7': { id: 'bt-7', test_name: 'Vitamin D (25-OH)', category: 'Supplements', price: 999, mrp: 1250, discount: 20, preparation: 'No fasting required', sample_type: 'Blood', report_time: '48 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-8': { id: 'bt-8', test_name: 'Iron Profile', category: 'General', price: 799, mrp: null, discount: 0, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-9': { id: 'bt-9', test_name: 'Urine Routine & Microscopy', category: 'General', price: 199, mrp: 299, discount: 33, preparation: 'Morning sample preferred', sample_type: 'Urine', report_time: '12 Hours', lab_name: 'MediTrust Diagnostics' },
            'bt-10': { id: 'bt-10', test_name: 'Vitamin B12', category: 'Supplements', price: 649, mrp: 799, discount: 19, preparation: 'No fasting required', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' }
          };
          setTest(mockTests[id] || mockTests['bt-1']);
          return;
        }

        const { data, error } = await supabase
          .from('blood_tests')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setTest(data);
      } catch (error) {
        console.error('Error fetching test detail:', error);
        toast.error('Failed to load test details');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to book a test');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Test booked successfully! We will contact you soon.');
        navigate('/blood-test-bookings');
        return;
      }

      const { error } = await supabase
        .from('test_bookings')
        .insert({
          ...formData,
          test_id: id,
          doctor_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Test booked successfully! Our team will reach out for collection.');
      navigate('/blood-test-bookings');
    } catch (error) {
      console.error('Error booking test:', error);
      toast.error('Booking failed. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="h-64 rounded-3xl bg-white animate-pulse shadow-sm border border-slate-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 rounded-3xl bg-white animate-pulse shadow-sm border border-slate-100" />
            <div className="h-96 rounded-3xl bg-white animate-pulse shadow-sm border border-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!test) return <div className="p-20 text-center font-bold">Test not found</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            onClick={() => navigate('/blood-tests')}
            className="flex items-center gap-2 text-txt-secondary hover:text-medical-error font-black text-sm uppercase tracking-widest transition-colors mb-8 group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Tests</span>
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
            <div className="w-full lg:w-[60%]">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className="bg-medical-error/10 text-medical-error border-medical-error/10 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
                  {test.category}
                </Badge>
                <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
                  NABL Certified
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-txt-dark mb-6 leading-tight tracking-tight">
                {test.test_name}
              </h1>
              <p className="text-lg text-txt-secondary leading-relaxed w-full font-medium">
                {test.description || 'Professional diagnostic measurement conducted by certified medical lab staff with precision and accuracy.'}
              </p>
            </div>

            <div className="w-full lg:w-[35%]">
              <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 w-full sm:min-w-[320px]">
                <p className="text-[11px] font-black text-txt-placeholder uppercase tracking-[0.2em] mb-2 text-center">Exclusive B2B Price</p>
                <div className="flex justify-center items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-txt-dark">₹{test.price}</span>
                  <span className="text-lg font-bold text-txt-placeholder line-through decoration-medical-error/30 decoration-4">₹{test.price * 1.5}</span>
                </div>
                <div className="space-y-4 pt-6 border-t border-slate-200/50">
                  <div className="flex items-center gap-3 text-sm font-bold text-txt-body">
                    <Clock size={18} className="text-medical-warning" />
                    <span>Ready in {test.report_time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-txt-body">
                    <Beaker size={18} className="text-blue-500" />
                    <span>Sample: {test.sample_type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Preparation & Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-[2.5rem] p-8 border-slate-200 shadow-sm bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-black text-txt-dark mb-8 flex items-center gap-3">
                <Info className="text-blue-500" /> Test Preparation
              </h3>
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-black text-txt-dark uppercase tracking-wider mb-2">Instructions</p>
                  <p className="text-txt-secondary text-sm font-medium leading-relaxed">
                    {test.preparation || 'No specific fasting or preparation required for this test.'}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-medical-error/10 text-medical-error flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <p className="text-xs text-txt-secondary font-medium leading-relaxed">
                    Continue taking your regular medications unless specifically advised by your doctor to stop.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2.5rem] p-8 border-slate-200 shadow-sm bg-white overflow-hidden relative">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-medical-success/5 rounded-full translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-black text-txt-dark mb-8 flex items-center gap-3">
                <ShieldCheck className="text-medical-success" /> Quality Assurance
              </h3>
              <ul className="space-y-4">
                {[
                  'Barcoded samples for 100% Tracking',
                  'NABL & CAP Certified Labs',
                  'Automated Analysis Systems',
                  'Doctor-verified digital reports'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-bold text-txt-body">
                    <CheckCircle2 size={16} className="text-medical-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="rounded-[3rem] p-8 lg:p-12 border-slate-200 shadow-2xl bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Send size={200} />
              </div>

              <div className="flex items-center gap-4 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-medical-error/10 text-medical-error flex items-center justify-center">
                  <Activity size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-txt-dark tracking-tight">Schedule Test Booking</h2>
                  <p className="text-txt-secondary font-bold text-sm">Fill in the patient details to confirm appointment</p>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-txt-placeholder uppercase tracking-[0.1em] px-1 ml-1">Patient Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-placeholder group-focus-within:text-medical-error transition-colors" size={20} />
                      <input
                        required
                        placeholder="e.g. John Doe"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-medical-error/20 focus:ring-4 focus:ring-medical-error/5 outline-none transition-all font-bold"
                        value={formData.patient_name}
                        onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-txt-placeholder uppercase tracking-[0.1em] px-1 ml-1">Patient Age</label>
                      <input
                        type="number"
                        required
                        placeholder="25"
                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-medical-error/20 focus:ring-4 focus:ring-medical-error/5 outline-none transition-all font-bold"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-txt-placeholder uppercase tracking-[0.1em] px-1 ml-1">Gender</label>
                      <select
                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-medical-error/20 outline-none transition-all font-bold appearance-none cursor-pointer"
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-txt-placeholder uppercase tracking-[0.1em] px-1 ml-1">Mobile Number</label>
                    <div className="relative group">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-placeholder group-focus-within:text-medical-error transition-colors" size={20} />
                      <input
                        required
                        type="tel"
                        placeholder="+91 98765-43210"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-medical-error/20 outline-none transition-all font-bold"
                        value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-txt-placeholder uppercase tracking-[0.1em] px-1 ml-1">Sample Pickup Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-placeholder group-focus-within:text-medical-error transition-colors" size={20} />
                      <input
                        required
                        placeholder="Flat, Road, Area, Pincode"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-medical-error/20 outline-none transition-all font-bold"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-txt-placeholder uppercase tracking-[0.1em] px-1 ml-1">Preferred Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-placeholder group-focus-within:text-medical-error transition-colors" size={20} />
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-medical-error/20 outline-none transition-all font-bold"
                        value={formData.booking_date}
                        onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-txt-placeholder uppercase tracking-[0.1em] px-1 ml-1">Preferred Time Slot</label>
                    <div className="flex gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, time_slot: slot.id })}
                          className={`flex-1 p-3 rounded-2xl border transition-all text-xs font-black flex flex-col items-center gap-1 ${formData.time_slot === slot.id ? 'bg-medical-error border-medical-error text-white shadow-lg shadow-red-500/20' : 'bg-slate-50 border-transparent text-txt-secondary hover:bg-slate-100'}`}
                        >
                          <span className="text-xl">{slot.icon}</span>
                          <span className="uppercase tracking-tighter">{slot.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-20 rounded-[1.5rem] bg-gradient-to-r from-medical-error to-red-600 shadow-2xl shadow-red-500/30 text-white text-xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 group"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-4">
                        <span>Confirm Booking</span>
                        <Sparkles className="animate-bounce" />
                      </div>
                    )}
                  </Button>
                  <p className="text-center text-[11px] font-bold text-txt-placeholder mt-6 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-medical-success" /> Encrypted & Secure Booking
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodTestDetail;
