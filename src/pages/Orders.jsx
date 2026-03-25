import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isMockMode } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Package, Truck, CheckCircle2, Clock, ChevronRight, Search, Filter, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const MotionDiv = motion.div;

  const fetchOrders = useCallback(async () => {
    try {
      let data;
      
      if (isMockMode) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        data = [
          {
            id: 'ORD-MOCK-001',
            created_at: new Date().toISOString(),
            total_amount: 1540,
            status: 'in transit',
            prescription_url: null,
            order_items: new Array(2)
          },
          {
            id: 'ORD-MOCK-002',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            total_amount: 850,
            status: 'delivered',
            prescription_url: 'mock-url',
            order_items: new Array(1)
          },
          {
            id: 'ORD-MOCK-003',
            created_at: new Date().toISOString(),
            total_amount: 450,
            status: 'pending',
            prescription_url: null,
            order_items: new Array(1)
          }
        ];
      } else {
        const { data: supabaseData, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        data = supabaseData;
      }

      const formattedOrders = data.map(order => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        total: order.total_amount,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        items: order.order_items.length,
        hasPrescription: !!order.prescription_url,
        estimatedDelivery: new Date(new Date(order.created_at).setDate(new Date(order.created_at).getDate() + 3)).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }),
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, fetchOrders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'In Transit': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'In Transit': return <Truck className="w-4 h-4" />;
      case 'Cancelled': return <Package className="w-4 h-4" />; // Or XCircle
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleCancelOrder = async (e, orderId) => {
    e.stopPropagation(); // Prevent card click
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      if (isMockMode) {
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, status: 'Cancelled' } : o
        ));
        toast.success('Order cancelled successfully');
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: 'Cancelled' } : o
      ));
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status.toLowerCase().replace(' ', '') === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-8 lg:pt-3 lg:pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-txt-dark mb-2">My Orders</h1>
          <p className="text-txt-secondary">Track and manage your recent purchases</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Order ID"
              className="pl-9 pr-4 py-2 border border-surface-border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-txt-placeholder" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['all', 'pending', 'delivered', 'in transit', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium text-sm capitalize transition-all whitespace-nowrap ${activeTab === tab
              ? 'bg-brand-primary text-white shadow-md'
              : 'bg-white border border-surface-border text-txt-secondary hover:bg-surface-light'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order.id}
            >
              <Card className="p-6 hover:shadow-md transition-shadow border-surface-border group cursor-pointer">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-bg flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-txt-dark text-lg">{order.id}</h3>
                      <div className="flex items-center gap-3 text-sm text-txt-secondary mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {order.date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{order.items} Items</span>
                        {order.hasPrescription && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1 text-brand-primary font-medium"><FileText className="w-3 h-3" /> Prescription</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-txt-secondary uppercase tracking-wider font-bold mb-1">Total Amount</p>
                      <p className="text-lg font-bold text-txt-dark">₹{order.total.toLocaleString()}</p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xs text-txt-secondary uppercase tracking-wider font-bold mb-1">Status</p>
                      <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1.5 pl-1.5 pr-2.5">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>

                    {order.status === 'Pending' && (
                        <Button 
                            variant="destructive" 
                            size="sm"
                            className="text-xs px-3 h-8 bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
                            onClick={(e) => handleCancelOrder(e, order.id)}
                        >
                            Cancel
                        </Button>
                    )}

                    <ChevronRight className="w-5 h-5 text-txt-placeholder group-hover:text-brand-primary group-hover:translate-x-1 transition-all hidden md:block" />
                  </div>
                </div>

                {/* Progress Bar for In Transit */}
                {order.status === 'In Transit' && (
                  <div className="mt-6 pt-6 border-t border-surface-border">
                    <div className="flex justify-between text-xs font-bold text-txt-secondary mb-2">
                      <span>Shipped</span>
                      <span className="text-brand-primary">Out for Delivery</span>
                      <span>Delivered</span>
                    </div>
                    <div className="h-2 bg-surface-bg rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary w-2/3 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_1s_infinite] -skew-x-12"></div>
                      </div>
                    </div>
                    <p className="text-xs text-brand-primary mt-2 font-medium flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Estimated Delivery: <span className="text-txt-dark">{order.estimatedDelivery}</span>
                    </p>
                  </div>
                )}
              </Card>
            </MotionDiv>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-dashed border-surface-border">
            <div className="w-20 h-20 bg-surface-bg rounded-full flex items-center justify-center text-txt-placeholder mb-6">
              <Package className="w-10 h-10 opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-txt-dark mb-2">No orders found</h2>
            <p className="text-txt-secondary mb-8 max-w-sm mx-auto">
              It looks like you haven't placed any orders in this category yet. Start shopping to see your orders here.
            </p>
            <Link to="/products">
              <Button className="rounded-full px-8 flex items-center gap-2">
                Start Shopping <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
