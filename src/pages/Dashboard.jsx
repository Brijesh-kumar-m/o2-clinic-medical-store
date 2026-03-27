import React, { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Package, ShoppingBag, CreditCard, MapPin,
  Settings, Bell, LogOut, ChevronRight, User,
  TrendingUp, Clock, AlertCircle, ShieldCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isMockMode } from '../lib/supabase';
import ProfileEditModal from '../components/features/ProfileEditModal';

const Dashboard = () => {
  const { user, profile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [stats, setStats] = useState({
    purchasedToday: 0,
    activeOrders: 0,
    totalSaved: 0,
    creditLimit: '1.5L'
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      let orders = [];

      if (isMockMode) {
        // Simulate a network delay and return demo data
        await new Promise(resolve => setTimeout(resolve, 600));
        orders = [
          { id: 'ORD-DEMO-001', created_at: new Date().toISOString(), total_amount: 4200, status: 'pending', order_items: [{ id: 1 }, { id: 2 }] },
          { id: 'ORD-DEMO-002', created_at: new Date(Date.now() - 86400000).toISOString(), total_amount: 8750, status: 'delivered', order_items: [{ id: 3 }] },
          { id: 'ORD-DEMO-003', created_at: new Date(Date.now() - 86400000 * 3).toISOString(), total_amount: 2300, status: 'delivered', order_items: [{ id: 4 }, { id: 5 }, { id: 6 }] },
        ];
      } else {
        // Real Supabase fetch
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items (id)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        orders = data || [];
      }

      // Calculate stats
      const today = new Date().toDateString();
      const todaysOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
      const purchasedToday = todaysOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const activeOrdersCount = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;
      const estimatedSavings = orders.reduce((sum, o) => sum + (Number(o.total_amount) * 0.2), 0);

      setStats(prev => ({
        ...prev,
        purchasedToday,
        activeOrders: activeOrdersCount,
        totalSaved: Math.round(estimatedSavings)
      }));

      const mappedOrders = orders.map(order => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: order.order_items?.length || 0,
        total: `₹${Number(order.total_amount).toLocaleString()}`,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }));

      setRecentOrders(mappedOrders);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user, fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
      </div>
    );
  }

  const statCards = [
    { label: 'Purchased Today', value: `₹${stats.purchasedToday.toLocaleString()}`, icon: TrendingUp, color: 'text-medical-success' },
    { label: 'Active Orders', value: stats.activeOrders.toString().padStart(2, '0'), icon: Clock, color: 'text-brand-primary' },
    { label: 'Total Saved', value: `₹${stats.totalSaved.toLocaleString()}`, icon: ShoppingBag, color: 'text-brand-accent' },
    { label: 'Credit Limit', value: stats.creditLimit, icon: CreditCard, color: 'text-medical-info' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-md sm:px-lg lg:px-xl pt-sm pb-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-xl mb-2xl">
        <div>
          <h1 className="text-3xl font-black text-txt-dark mb-1">Welcome, Dr. {profile?.last_name || 'User'}</h1>
          <div className="text-txt-secondary font-medium flex items-center gap-2">
            <Badge variant="success" className="h-2 w-2 p-0 animate-pulse"></Badge>
            Practice ID: {user?.id?.slice(0, 8)} • {profile?.practice_name || 'Medical Store'}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-2" onClick={() => setIsEditProfileOpen(true)}>
            <Settings className="w-5 h-5 mr-2" /> Practice Settings
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl text-medical-error hover:bg-medical-error/10"
            onClick={() => { logout(); navigate('/login'); }}
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-none shadow-xl bg-white overflow-hidden group">
              <CardContent className="p-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-txt-placeholder tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-txt-dark group-hover:text-brand-primary transition-colors">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-surface-light flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
        {/* Recent Orders */}
        <div className="lg:col-span-8 space-y-xl">
          <Card className="border-2 border-surface-border shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-border mb-0 pb-xl">
              <CardTitle className="text-xl font-black">Recent Procurement Orders</CardTitle>
              <Button variant="ghost" size="sm">View All Orders <ChevronRight className="ml-1 w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-light text-[10px] font-black uppercase text-txt-placeholder tracking-widest">
                      <th className="px-xl py-lg">Order ID</th>
                      <th className="px-xl py-lg">Date</th>
                      <th className="px-xl py-lg">Items</th>
                      <th className="px-xl py-lg">Total</th>
                      <th className="px-xl py-lg">Status</th>
                      <th className="px-xl py-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-surface-light/50 transition-colors">
                        <td className="px-xl py-xl font-bold text-brand-primary">{order.id}</td>
                        <td className="px-xl py-xl font-medium text-txt-secondary">{order.date}</td>
                        <td className="px-xl py-xl font-bold">{order.items} Items</td>
                        <td className="px-xl py-xl font-black">{order.total}</td>
                        <td className="px-xl py-xl">
                          <Badge variant={order.status === 'Delivered' ? 'success' : 'info'}>{order.status}</Badge>
                        </td>
                        <td className="px-xl py-xl text-right">
                          <Button variant="outline" size="sm" className="rounded-lg font-bold">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-medical-warning/5 p-xl flex items-center gap-6">
            <div className="w-16 h-16 bg-medical-warning/10 rounded-2xl flex items-center justify-center text-medical-warning">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-txt-dark mb-1">Verify Professional Account</h4>
              <p className="text-txt-secondary text-sm">Your medical certificate is pending verification. Full features like credit period and bulk tier-2 pricing will be unlocked shortly.</p>
            </div>
            <Button className="bg-medical-warning text-white hover:bg-medical-warning/90">Retry Upload</Button>
          </Card>
        </div>

        {/* Side Info */}
        <div className="lg:col-span-4 space-y-xl">
          <Card className="border-2 border-surface-border shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-black">Practice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-surface-light rounded-xl flex items-center justify-center text-txt-placeholder">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-txt-placeholder">Specialist</p>
                  <p className="font-bold text-txt-dark">{profile?.specialization || 'General Practitioner'}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-surface-light rounded-xl flex items-center justify-center text-txt-placeholder">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-txt-placeholder">Primary Location</p>
                  <p className="font-bold text-txt-dark truncate max-w-[200px]">{profile?.address || 'No address set'}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-surface-light rounded-xl flex items-center justify-center text-txt-placeholder">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-txt-placeholder">License No.</p>
                  <p className="font-bold text-txt-dark">{profile?.license_number || 'Pending'}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 border-2" onClick={() => setIsEditProfileOpen(true)}>Edit Practice Profile</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-premium text-white border-none p-xl">
            <h4 className="text-xl font-black mb-2">Rewards Program</h4>
            <p className="text-white/80 text-sm mb-xl">You have earned 1,240 points. Use them to get discounts on your next procurement.</p>
            <Button className="bg-white text-brand-accent hover:bg-surface-light border-none w-full font-black">Redeem Points</Button>
          </Card>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditProfileOpen && (
        <ProfileEditModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
