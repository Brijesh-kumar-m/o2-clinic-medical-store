import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Package, Truck, CheckCircle2, Clock, ChevronRight, Search, Filter, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Dummy order data
  const orders = [
    {
      id: 'ORD-2024-8832',
      date: 'Feb 16, 2026',
      total: 12450,
      status: 'In Transit',
      items: 8,
      estimatedDelivery: 'Feb 18, 2026',
    },
    {
      id: 'ORD-2024-8831',
      date: 'Feb 10, 2026',
      total: 4500,
      status: 'Delivered',
      items: 3,
      estimatedDelivery: 'Feb 12, 2026',
    },
    {
      id: 'ORD-2024-8100',
      date: 'Jan 28, 2026',
      total: 28900,
      status: 'Delivered',
      items: 12,
      estimatedDelivery: 'Jan 30, 2026',
    },
    {
      id: 'ORD-2024-7554',
      date: 'Jan 15, 2026',
      total: 1560,
      status: 'Cancelled',
      items: 1,
      estimatedDelivery: 'N/A',
    }
  ];

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
        {['all', 'delivered', 'in transit', 'cancelled'].map((tab) => (
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
            <motion.div
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
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-surface-bg/50 rounded-3xl border-2 border-dashed border-surface-border">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-txt-placeholder mx-auto mb-4 shadow-sm">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-txt-dark mb-2">No orders found</h3>
            <p className="text-txt-secondary mb-6 max-w-sm mx-auto">It looks like you haven't placed any orders in this category yet.</p>
            <Link to="/products">
              <Button>Start Shopping <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
