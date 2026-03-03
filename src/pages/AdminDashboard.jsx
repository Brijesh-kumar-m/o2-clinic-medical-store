import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  LayoutDashboard, ShoppingBag, PlusCircle, Users,
  Settings, Search, Package, Menu, X, LogOut,
  CheckCircle2, XCircle, Truck, DollarSign, Phone,
  TrendingUp, ShieldCheck, RefreshCw, Trash2, Star,
  ChevronRight, Box, UserCheck, UserX, ClipboardList,
  Percent, CreditCard, Gift, Save, AlertCircle, Eye, Droplet
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase, isMockMode } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    manufacturer: '',
    description: '',
    packSize: '',
    mrp: '',
    stock: '100',
    featured: false,
    image: ''
  });

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // Settings Store
  const { gstRate, shippingCharge, freeShippingThreshold, updateSettings, fetchSettings: fetchAppSettings } = useSettingsStore();
  const [settingsForm, setSettingsForm] = useState({
    gstRate: '',
    shippingCharge: '',
    freeShippingThreshold: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchUsers();
    fetchProducts();
    fetchAppSettings();
  }, []);

  useEffect(() => {
    setSettingsForm({
      gstRate,
      shippingCharge,
      freeShippingThreshold
    });
  }, [gstRate, shippingCharge, freeShippingThreshold]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const success = await updateSettings({
      gstRate: parseFloat(settingsForm.gstRate),
      shippingCharge: parseFloat(settingsForm.shippingCharge),
      freeShippingThreshold: parseFloat(settingsForm.freeShippingThreshold)
    });
    if (success) {
      toast.success('Settings updated successfully!');
    } else {
      toast.error('Failed to update settings');
    }
  };

  const fetchProducts = async () => {
    try {
      if (isMockMode) {
        setProducts([
          { id: 'PROD-1', name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 120, pack_sizes: [{ price: 45 }], manufacturer: { name: 'HealthCare Inc' } },
          { id: 'PROD-2', name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 50, pack_sizes: [{ price: 85 }], manufacturer: { name: 'PharmaPlus' } },
          { id: 'PROD-3', name: 'Vitamin C 500mg', category: 'Supplements', stock: 0, pack_sizes: [{ price: 150 }], manufacturer: { name: 'NutriLife' } },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data on error/timeout
      const { mockProducts } = await import('../lib/mockData');
      setProducts(mockProducts);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const fetchUsers = async () => {
    try {
      if (isMockMode) {
        setUsers([
          { id: 'USR-1', practice_name: 'City Clinic', email: 'doctor@cityclinic.com', role: 'doctor', status: 'approved' },
          { id: 'USR-2', first_name: 'John', last_name: 'Doe', email: 'john@example.com', role: 'user', status: 'pending' },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      if (isMockMode) {
        setOrders([
          { id: 'ORD-MOCK-001', customer: 'City Clinic', phone: '9876543210', date: new Date().toLocaleDateString(), total: 1540, status: 'In Transit' },
          { id: 'ORD-MOCK-002', customer: 'John Doe', phone: '1234567890', date: new Date(Date.now() - 86400000).toLocaleDateString(), total: 850, status: 'Delivered' },
          { id: 'ORD-MOCK-003', customer: 'Jane Smith', phone: '5556667777', date: new Date(Date.now() - 172800000).toLocaleDateString(), total: 420, status: 'Pending' },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (first_name, last_name, practice_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data.map(order => ({
        id: order.id,
        customer: order.profiles ?
          (order.profiles.practice_name || `${order.profiles.first_name || ''} ${order.profiles.last_name || ''}`.trim() || order.profiles.email)
          : 'Unknown',
        phone: order.phone || order.profiles?.phone || 'N/A',
        date: new Date(order.created_at).toLocaleDateString(),
        total: order.total_amount,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.message?.includes('relation')) {
        const { data: simpleOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (simpleOrders) {
          setOrders(simpleOrders.map(o => ({
            id: o.id,
            customer: 'User ' + o.user_id.slice(0, 4),
            date: new Date(o.created_at).toLocaleDateString(),
            total: o.total_amount,
            status: o.status
          })));
        }
      }
    }
  };

  const fetchStats = async () => {
    try {
      if (isMockMode) {
        setStats({
          revenue: 1540 + 850 + 420,
          orders: 3,
          users: 2
        });
        return;
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status');

      if (ordersError) throw ordersError;

      const totalRevenue = ordersData
        .filter(order => order.status !== 'cancelled' && order.status !== 'Cancelled')
        .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      setStats({
        revenue: totalRevenue,
        orders: ordersData.length,
        users: usersCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (isMockMode) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        toast.success(`Order ${id.length > 12 ? id.slice(0, 12) + '...' : id} → ${newStatus}`);
        return;
      }

      const statusLower = newStatus.toLowerCase();
      const { error } = await supabase
        .from('orders')
        .update({ status: statusLower })
        .eq('id', id);

      if (error) throw error;

      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast.success(`Order ${id.length > 12 ? id.slice(0, 12) + '...' : id} → ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleUserStatusChange = async (id, newStatus) => {
    try {
      if (isMockMode) {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        toast.success(`User marked as ${newStatus}`);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
      toast.success(`User marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockProduct = {
          id: `PROD-${Date.now()}`,
          name: newProduct.name,
          category: newProduct.category,
          stock: parseInt(newProduct.stock) || 0,
          pack_sizes: [{ price: parseFloat(newProduct.price) }],
          manufacturer: { name: newProduct.manufacturer }
        };
        setProducts([mockProduct, ...products]);
        toast.success(`Product "${newProduct.name}" added to catalog!`);
        setNewProduct({
          name: '', price: '', category: '', manufacturer: '', description: '',
          packSize: '', mrp: '', stock: '100', featured: false, image: ''
        });
        setLoading(false);
        return;
      }

      const packSizes = [{
        size: newProduct.packSize || "Standard",
        price: parseFloat(newProduct.price),
        mrp: parseFloat(newProduct.mrp) || parseFloat(newProduct.price) * 1.2,
        discount: 0
      }];

      const { error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          category: newProduct.category,
          manufacturer: { name: newProduct.manufacturer },
          description: newProduct.description,
          pack_sizes: packSizes,
          stock: parseInt(newProduct.stock) || 0,
          featured: newProduct.featured,
          images: newProduct.image ? [newProduct.image] : ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"]
        });

      if (error) throw error;

      toast.success(`Product "${newProduct.name}" added to catalog!`);
      fetchProducts();
      setNewProduct({
        name: '', price: '', category: '', manufacturer: '', description: '',
        packSize: '', mrp: '', stock: '100', featured: false, image: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'catalog', label: 'Catalog', icon: Package, count: products.length },
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'blood-tests', label: 'Blood Tests', icon: Droplet, path: '/admin/blood-tests' },
    { id: 'test-bookings', label: 'Test Bookings', icon: ClipboardList, path: '/admin/test-bookings' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const config = {
      delivered: { variant: 'success', icon: CheckCircle2 },
      pending: { variant: 'warning', icon: AlertCircle },
      'in transit': { variant: 'info', icon: Truck },
      cancelled: { variant: 'error', icon: XCircle },
      processing: { variant: 'default', icon: RefreshCw },
    };
    const { variant, icon: Icon } = config[statusLower] || { variant: 'default', icon: ClipboardList };
    return (
      <Badge variant={variant}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-surface-border shadow-xl lg:shadow-sm flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-surface-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-txt-dark leading-tight">Admin</h2>
                  <p className="text-xs text-txt-secondary font-medium">Control Panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-surface-bg text-txt-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-txt-placeholder uppercase tracking-widest px-3 mb-3">Main Menu</p>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white shadow-lg shadow-brand-primary/25'
                    : 'text-txt-secondary hover:bg-surface-bg hover:text-txt-dark'
                    }`}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else {
                      setActiveTab(item.id);
                    }
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-txt-placeholder group-hover:text-brand-primary'} transition-colors`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-surface-bg text-txt-secondary'
                      }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-surface-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-medical-error hover:bg-medical-error/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-border px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-surface-bg text-txt-secondary transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-black text-txt-dark">
                    {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-xs text-txt-secondary font-medium hidden sm:block">
                    Welcome back, Administrator
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-placeholder w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-60 rounded-xl border border-surface-border bg-surface-bg/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  />
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                  A
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8">
            {/* ======================== OVERVIEW TAB ======================== */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Revenue Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-accent p-6 text-white shadow-xl shadow-brand-primary/15">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <p className="text-blue-100 font-bold uppercase tracking-wider text-[11px] mb-1">Total Revenue</p>
                      <h3 className="text-3xl lg:text-4xl font-black">₹{stats.revenue.toLocaleString()}</h3>
                      <div className="flex items-center gap-1 mt-3 text-blue-200 text-xs font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Lifetime earnings</span>
                      </div>
                    </div>
                  </div>

                  {/* Orders Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-surface-border p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 flex items-center justify-center mb-4">
                        <ShoppingBag className="w-6 h-6 text-brand-secondary" />
                      </div>
                      <p className="text-txt-secondary font-bold uppercase tracking-wider text-[11px] mb-1">Total Orders</p>
                      <h3 className="text-3xl lg:text-4xl font-black text-txt-dark">{stats.orders}</h3>
                      <div className="flex items-center gap-1 mt-3 text-txt-placeholder text-xs font-medium">
                        <ClipboardList className="w-3.5 h-3.5" />
                        <span>All time orders</span>
                      </div>
                    </div>
                  </div>

                  {/* Users Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-surface-border p-6 shadow-sm hover:shadow-lg transition-all duration-300 group sm:col-span-2 lg:col-span-1">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-purple-500" />
                      </div>
                      <p className="text-txt-secondary font-bold uppercase tracking-wider text-[11px] mb-1">Active Users</p>
                      <h3 className="text-3xl lg:text-4xl font-black text-txt-dark">{stats.users}</h3>
                      <div className="flex items-center gap-1 mt-3 text-txt-placeholder text-xs font-medium">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Registered users</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-bold text-txt-dark mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'View Orders', icon: ShoppingBag, tab: 'orders', color: 'text-brand-primary', bg: 'bg-brand-primary/5 hover:bg-brand-primary/10' },
                      { label: 'Add Product', icon: PlusCircle, tab: 'catalog', color: 'text-medical-success', bg: 'bg-medical-success/5 hover:bg-medical-success/10' },
                      { label: 'Manage Lab Tests', icon: Droplet, path: '/admin/blood-tests', color: 'text-medical-error', bg: 'bg-medical-error/5 hover:bg-medical-error/10' },
                      { label: 'Test Bookings', icon: ClipboardList, path: '/admin/test-bookings', color: 'text-blue-500', bg: 'bg-blue-500/5 hover:bg-blue-500/10' },
                      { label: 'Manage Users', icon: Users, tab: 'users', color: 'text-purple-500', bg: 'bg-purple-500/5 hover:bg-purple-500/10' },
                      { label: 'Settings', icon: Settings, tab: 'settings', color: 'text-medical-warning', bg: 'bg-medical-warning/5 hover:bg-medical-warning/10' },
                    ].map(action => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() => action.path ? navigate(action.path) : setActiveTab(action.tab)}
                          className={`flex items-center gap-3 p-4 rounded-2xl ${action.bg} border border-transparent hover:border-surface-border transition-all duration-200 group`}
                        >
                          <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${action.color}`} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-txt-dark">{action.label}</p>
                            <p className="text-xs text-txt-placeholder">Click to open</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-txt-placeholder ml-auto group-hover:translate-x-1 transition-transform" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Orders Preview */}
                {orders.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-txt-dark">Recent Orders</h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-sm text-brand-primary font-semibold hover:underline flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-surface-bg/60">
                              <th className="px-6 py-3.5 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Order ID</th>
                              <th className="px-6 py-3.5 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Customer</th>
                              <th className="px-6 py-3.5 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Amount</th>
                              <th className="px-6 py-3.5 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-surface-border">
                            {orders.slice(0, 3).map(order => (
                              <tr key={order.id} className="hover:bg-surface-bg/30 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-txt-dark font-mono">{order.id.slice(0, 14)}...</td>
                                <td className="px-6 py-4 text-sm text-txt-body">{order.customer}</td>
                                <td className="px-6 py-4 text-sm font-bold text-brand-primary">₹{order.total?.toLocaleString()}</td>
                                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================== ORDERS TAB ======================== */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Orders Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-txt-dark">Manage Orders</h2>
                    <p className="text-sm text-txt-secondary mt-0.5">Track and update order statuses</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-placeholder w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      />
                    </div>
                    <Button variant="outline" onClick={fetchOrders} className="shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-bg/60 border-b border-surface-border">
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</span>
                          </th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border">
                        {orders.length > 0 ? orders.map(order => (
                          <tr key={order.id} className="hover:bg-surface-bg/30 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-txt-dark font-mono bg-surface-bg px-2 py-1 rounded-md">
                                {order.id.length > 14 ? order.id.slice(0, 14) + '...' : order.id}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-txt-dark">{order.customer}</p>
                              <p className="text-xs text-txt-placeholder mt-0.5">{order.date}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-txt-body flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-txt-placeholder" />
                                {order.phone}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-brand-primary">₹{order.total?.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleStatusChange(order.id, 'Delivered')}
                                  className="p-2 hover:bg-medical-success/10 text-medical-success rounded-lg transition-all hover:scale-110"
                                  title="Mark Delivered"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(order.id, 'In Transit')}
                                  className="p-2 hover:bg-medical-info/10 text-medical-info rounded-lg transition-all hover:scale-110"
                                  title="Mark In Transit"
                                >
                                  <Truck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(order.id, 'Cancelled')}
                                  className="p-2 hover:bg-medical-error/10 text-medical-error rounded-lg transition-all hover:scale-110"
                                  title="Cancel Order"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-surface-bg flex items-center justify-center">
                                  <ShoppingBag className="w-8 h-8 text-txt-placeholder" />
                                </div>
                                <p className="text-txt-secondary font-semibold">No orders found</p>
                                <p className="text-sm text-txt-placeholder">Orders will appear here once placed</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================== CATALOG TAB ======================== */}
            {activeTab === 'catalog' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Add Product Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-border overflow-hidden">
                  <div className="p-6 lg:p-8 border-b border-surface-border bg-surface-bg/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-medical-success/10 flex items-center justify-center">
                        <PlusCircle className="w-5 h-5 text-medical-success" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-txt-dark">Add New Medicine</h2>
                        <p className="text-sm text-txt-secondary mt-0.5">Fill in the details to add a new product to your catalog</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleAddProduct} className="p-6 lg:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Medicine Name"
                        placeholder="e.g. Dolo 650mg"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                      <Input
                        label="Category"
                        placeholder="e.g. Fever, Supplements"
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <Input
                        label="Pack Size"
                        placeholder="e.g. 10x10"
                        value={newProduct.packSize}
                        onChange={e => setNewProduct({ ...newProduct, packSize: e.target.value })}
                        required
                      />
                      <Input
                        label="Price (₹)"
                        type="number"
                        placeholder="45.00"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                      <Input
                        label="MRP (₹)"
                        type="number"
                        placeholder="55.00"
                        value={newProduct.mrp}
                        onChange={e => setNewProduct({ ...newProduct, mrp: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Manufacturer"
                        placeholder="e.g. Apex Labs"
                        value={newProduct.manufacturer}
                        onChange={e => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                        required
                      />
                      <Input
                        label="Stock Quantity"
                        type="number"
                        placeholder="100"
                        value={newProduct.stock}
                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                        required
                      />
                    </div>
                    <Input
                      label="Description"
                      placeholder="Brief product description..."
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    />
                    <Input
                      label="Image URL (optional)"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.image}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded-md border-surface-border text-brand-primary focus:ring-brand-primary accent-brand-primary"
                          checked={newProduct.featured}
                          onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                        />
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-medical-warning" />
                          <span className="text-sm font-semibold text-txt-body group-hover:text-txt-dark transition-colors">Mark as Featured Product</span>
                        </div>
                      </label>
                      <Button size="lg" disabled={loading} className="w-full sm:w-auto min-w-[200px]">
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Publishing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <PlusCircle className="w-4 h-4" />
                            Publish to Catalog
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Product List */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-border overflow-hidden">
                  <div className="p-6 lg:p-8 border-b border-surface-border bg-surface-bg/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-txt-dark">Product Catalog</h2>
                        <p className="text-sm text-txt-secondary mt-0.5">{products.length} products listed</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={fetchProducts} className="shrink-0">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-bg/40 border-b border-surface-border">
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Product</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Price</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border">
                        {products.length > 0 ? products.map(product => (
                          <tr key={product.id} className="hover:bg-surface-bg/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0">
                                  <Box className="w-5 h-5 text-brand-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-txt-dark">{product.name}</p>
                                  <p className="text-xs text-txt-placeholder mt-0.5">{product.manufacturer?.name || 'Unknown'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">{product.category}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={product.stock > 50 ? 'success' : product.stock > 0 ? 'warning' : 'error'}>
                                {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-brand-primary">
                                ₹{product.pack_sizes?.[0]?.price || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 hover:bg-medical-error/10 text-medical-error rounded-lg transition-all hover:scale-110"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-surface-bg flex items-center justify-center">
                                  <Package className="w-8 h-8 text-txt-placeholder" />
                                </div>
                                <p className="text-txt-secondary font-semibold">No products in catalog</p>
                                <p className="text-sm text-txt-placeholder">Add your first product using the form above</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================== USERS TAB ======================== */}
            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Users Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-txt-dark">Sellers & Users</h2>
                    <p className="text-sm text-txt-secondary mt-0.5">Manage user accounts and seller approvals</p>
                  </div>
                  <Button variant="outline" onClick={fetchUsers} className="shrink-0">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-bg/60 border-b border-surface-border">
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Name / Practice</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Role</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-txt-placeholder uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border">
                        {users.length > 0 ? users.map(user => (
                          <tr key={user.id} className="hover:bg-surface-bg/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-sm shrink-0">
                                  {(user.practice_name || user.first_name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-txt-dark">
                                    {user.practice_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
                                  </p>
                                  <p className="text-xs text-txt-placeholder mt-0.5">ID: {user.id.slice(0, 8)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-txt-body">{user.email}</span>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={user.role === 'admin' ? 'premium' : user.role === 'doctor' ? 'info' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={user.status === 'approved' ? 'success' : user.status === 'pending' ? 'warning' : 'error'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleUserStatusChange(user.id, 'approved')}
                                  className="p-2 hover:bg-medical-success/10 text-medical-success rounded-lg transition-all hover:scale-110"
                                  title="Approve User"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUserStatusChange(user.id, 'rejected')}
                                  className="p-2 hover:bg-medical-error/10 text-medical-error rounded-lg transition-all hover:scale-110"
                                  title="Reject User"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-surface-bg flex items-center justify-center">
                                  <Users className="w-8 h-8 text-txt-placeholder" />
                                </div>
                                <p className="text-txt-secondary font-semibold">No users found</p>
                                <p className="text-sm text-txt-placeholder">Users will appear here once they register</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================== SETTINGS TAB ======================== */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Page Header */}
                <div>
                  <h2 className="text-xl font-bold text-txt-dark">Application Settings</h2>
                  <p className="text-sm text-txt-secondary mt-0.5">Configure taxes, shipping, and other app-wide settings</p>
                </div>

                {/* Settings Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-border overflow-hidden">
                  {/* Card Header */}
                  <div className="px-6 py-5 border-b border-surface-border bg-surface-bg/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-medical-warning/10 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-medical-warning" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-txt-dark">Tax & Shipping Configuration</h3>
                        <p className="text-xs text-txt-secondary mt-0.5">These settings apply to all orders across the platform</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Body */}
                  <form onSubmit={handleSettingsSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* GST Rate */}
                      <div className="rounded-xl border border-surface-border bg-surface-bg/30 p-5 hover:border-brand-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                            <Percent className="w-4.5 h-4.5 text-brand-primary" />
                          </div>
                          <span className="text-xs font-bold text-txt-placeholder uppercase tracking-wider">GST Rate</span>
                        </div>
                        <Input
                          label="Rate (%)"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 18"
                          value={settingsForm.gstRate}
                          onChange={(e) => setSettingsForm({ ...settingsForm, gstRate: e.target.value })}
                          required
                        />
                        <p className="text-[11px] text-txt-placeholder mt-2 leading-relaxed">Applied to all product prices at checkout</p>
                      </div>

                      {/* Shipping Charge */}
                      <div className="rounded-xl border border-surface-border bg-surface-bg/30 p-5 hover:border-brand-secondary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-lg bg-brand-secondary/10 flex items-center justify-center">
                            <Truck className="w-4.5 h-4.5 text-brand-secondary" />
                          </div>
                          <span className="text-xs font-bold text-txt-placeholder uppercase tracking-wider">Shipping</span>
                        </div>
                        <Input
                          label="Charge (₹)"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 50"
                          value={settingsForm.shippingCharge}
                          onChange={(e) => setSettingsForm({ ...settingsForm, shippingCharge: e.target.value })}
                          required
                        />
                        <p className="text-[11px] text-txt-placeholder mt-2 leading-relaxed">Flat shipping fee added to each order</p>
                      </div>

                      {/* Free Shipping Threshold */}
                      <div className="rounded-xl border border-surface-border bg-surface-bg/30 p-5 hover:border-medical-success/30 transition-colors md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-lg bg-medical-success/10 flex items-center justify-center">
                            <Gift className="w-4.5 h-4.5 text-medical-success" />
                          </div>
                          <span className="text-xs font-bold text-txt-placeholder uppercase tracking-wider">Free Shipping</span>
                        </div>
                        <Input
                          label="Threshold (₹)"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 500"
                          value={settingsForm.freeShippingThreshold}
                          onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: e.target.value })}
                          required
                        />
                        <p className="text-[11px] text-txt-placeholder mt-2 leading-relaxed">Orders above this amount get free shipping</p>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-txt-placeholder">
                        <AlertCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                        Changes will take effect immediately for all new orders
                      </p>
                      <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[220px]">
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
