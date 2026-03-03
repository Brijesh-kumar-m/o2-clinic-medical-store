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
  RefreshCw, Droplet
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AdminBloodTests = () => {
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newTest, setNewTest] = useState({
    test_name: '',
    category: 'General',
    price: '',
    preparation: '',
    sample_type: 'Blood',
    report_time: '24 Hours',
    lab_name: 'MediTrust Diagnostics'
  });

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      if (isMockMode) {
        setTests([
          { id: 'bt-1', test_name: 'Complete Blood Count (CBC)', category: 'General', price: 499, preparation: 'No fasting', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' },
          { id: 'bt-2', test_name: 'Lipid Profile', category: 'Heart', price: 899, preparation: '9-12 hrs fasting', sample_type: 'Blood', report_time: '24 Hours', lab_name: 'MediTrust Diagnostics' }
        ]);
        return;
      }
      const { data, error } = await supabase.from('blood_tests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load blood tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isMockMode) {
        if (editingId) {
          setTests(tests.map(t => t.id === editingId ? { ...newTest, id: editingId } : t));
          toast.success('Test updated successfully');
        } else {
          setTests([{ ...newTest, id: Date.now().toString() }, ...tests]);
          toast.success('Test added successfully');
        }
        resetForm();
        return;
      }

      const { error } = editingId
        ? await supabase.from('blood_tests').update(newTest).eq('id', editingId)
        : await supabase.from('blood_tests').insert(newTest);

      if (error) throw error;

      toast.success(editingId ? 'Test updated successfully' : 'Test added successfully');
      fetchTests();
      resetForm();
    } catch (error) {
      console.error('Error saving test:', error);
      toast.error('Failed to save test');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    try {
      if (isMockMode) {
        setTests(tests.filter(t => t.id !== id));
        toast.success('Test deleted');
        return;
      }
      const { error } = await supabase.from('blood_tests').delete().eq('id', id);
      if (error) throw error;
      toast.success('Test deleted');
      fetchTests();
    } catch (error) {
      toast.error('Failed to delete test');
    }
  };

  const resetForm = () => {
    setNewTest({
      test_name: '',
      category: 'General',
      price: '',
      preparation: '',
      sample_type: 'Blood',
      report_time: '24 Hours',
      lab_name: 'MediTrust Diagnostics'
    });
    setEditingId(null);
  };

  const filteredTests = tests.filter(t =>
    t.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-bg flex">
      {/* Sidebar Replicated from AdminDashboard */}
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
          <Link to="/admin/blood-tests" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-medical-error to-red-600 text-white shadow-lg shadow-red-500/20">
            <Droplet className="w-5 h-5" /> Blood Test Catalog
          </Link>
          <Link to="/admin/test-bookings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-txt-secondary hover:bg-surface-bg transition-all">
            <ClipboardList className="w-5 h-5" /> Test Bookings
          </Link>
          <div className="border-t border-surface-border my-6 opacity-30" />
          <Link to="/products" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-txt-secondary hover:bg-surface-bg transition-all">
            <Package className="w-5 h-5" /> Main Medicine Store
          </Link>
        </nav>
        <div className="p-4 border-t border-surface-border">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-medical-error hover:bg-medical-error/5 transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-border px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6" /></button>
            <h1 className="text-2xl font-black text-txt-dark">Blood Test Catalog</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-placeholder group-focus-within:text-medical-error transition-colors" />
              <input
                type="text"
                placeholder="Search test..."
                className="pl-10 pr-4 py-2.5 w-60 rounded-xl border border-surface-border bg-surface-bg/50 text-sm outline-none focus:ring-2 focus:ring-medical-error/10 focus:border-medical-error/20"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-error to-red-600 flex items-center justify-center text-white font-bold shadow-md">A</div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Add/Edit Form */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-medical-error/10 text-medical-error flex items-center justify-center">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-txt-dark">{editingId ? 'Edit Blood Test' : 'Add New Blood Test'}</h2>
                  <p className="text-sm font-medium text-txt-secondary mt-0.5">Setup diagnostic test details for doctors to book</p>
                </div>
              </div>
              {editingId && (
                <Button variant="outline" onClick={resetForm} className="h-10 rounded-xl">Cancel Edit</Button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Input label="Test Name" required value={newTest.test_name} onChange={e => setNewTest({ ...newTest, test_name: e.target.value })} placeholder="e.g. CBC" />
                <Input label="Category" required value={newTest.category} onChange={e => setNewTest({ ...newTest, category: e.target.value })} placeholder="e.g. General" />
                <Input label="Price (₹)" required type="number" value={newTest.price} onChange={e => setNewTest({ ...newTest, price: e.target.value })} placeholder="0.00" />
                <Input label="Report Time" value={newTest.report_time} onChange={e => setNewTest({ ...newTest, report_time: e.target.value })} placeholder="e.g. 24 Hours" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Input label="Sample Type" value={newTest.sample_type} onChange={e => setNewTest({ ...newTest, sample_type: e.target.value })} placeholder="e.g. Blood" />
                <Input label="Lab Name" value={newTest.lab_name} onChange={e => setNewTest({ ...newTest, lab_name: e.target.value })} placeholder="e.g. MediTrust" />
                <Input label="Preparation" value={newTest.preparation} onChange={e => setNewTest({ ...newTest, preparation: e.target.value })} placeholder="e.g. 12h Fasting" />
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-medical-error to-red-600 shadow-xl shadow-red-500/20 text-white font-black text-lg uppercase tracking-widest disabled:opacity-50" disabled={loading}>
                {loading ? <RefreshCw className="animate-spin" /> : editingId ? 'Update Diagnostic Test' : 'Add Diagnostic Test'}
              </Button>
            </form>
          </Card>

          {/* List Table */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Test Details</th>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Category</th>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Price</th>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Report</th>
                    <th className="px-8 py-5 text-[11px] font-black text-txt-placeholder uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTests.map(test => (
                    <tr key={test.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-txt-dark group-hover:text-medical-error transition-colors">{test.test_name}</p>
                        <p className="text-[10px] text-txt-placeholder mt-1 font-bold uppercase tracking-tight">{test.sample_type} • {test.lab_name}</p>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 font-black text-[10px] uppercase tracking-wider rounded-xl">
                          {test.category}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-txt-dark">₹{test.price}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-txt-secondary">{test.report_time}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditingId(test.id); setNewTest({ ...test }); }} className="p-2.5 rounded-xl bg-slate-100 text-txt-secondary hover:bg-blue-50 hover:text-blue-500 transition-all hover:scale-110">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(test.id)} className="p-2.5 rounded-xl bg-slate-100 text-txt-secondary hover:bg-medical-error/10 hover:text-medical-error transition-all hover:scale-110">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminBloodTests;
