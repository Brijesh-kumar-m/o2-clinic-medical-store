import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  LayoutDashboard, ShoppingBag, PlusCircle, Users,
  Settings, Search, Filter, MoreVertical, Package,
  CheckCircle2, XCircle, Truck, DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  // Mock Data for Orders
  const [orders, setOrders] = useState([
    { id: 'ORD-8832', customer: 'Dr. Rajesh Kumar', date: 'Feb 16, 2026', total: 12450, status: 'In Transit' },
    { id: 'ORD-8831', customer: 'LifeCare Pharmacy', date: 'Feb 10, 2026', total: 4500, status: 'Delivered' },
    { id: 'ORD-8100', customer: 'Wellness Clinic', date: 'Jan 28, 2026', total: 28900, status: 'Pending' },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${id} marked as ${newStatus}`);
  };

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });

  const handleAddProduct = (e) => {
    e.preventDefault();
    toast.success(`Product "${newProduct.name}" added to catalog!`);
    setNewProduct({ name: '', price: '', category: '' });
  };

  return (
    <div className="min-h-screen bg-surface-bg p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-txt-dark">Admin Portal</h1>
            <p className="text-txt-secondary">Overview and Management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
            <Button><PlusCircle className="w-4 h-4 mr-2" /> New Request</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <Card className="p-4 border-none shadow-lg">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-brand-primary text-white shadow-md' : 'text-txt-secondary hover:bg-surface-bg'}`}
                >
                  <LayoutDashboard className="w-5 h-5" /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-brand-primary text-white shadow-md' : 'text-txt-secondary hover:bg-surface-bg'}`}
                >
                  <ShoppingBag className="w-5 h-5" /> Manage Orders
                </button>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'catalog' ? 'bg-brand-primary text-white shadow-md' : 'text-txt-secondary hover:bg-surface-bg'}`}
                >
                  <Package className="w-5 h-5" /> Add Catalog
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-brand-primary text-white shadow-md' : 'text-txt-secondary hover:bg-surface-bg'}`}
                >
                  <Users className="w-5 h-5" /> Sellers & Users
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-txt-dark">Recent Orders</h2>
                  <div className="relative w-64">
                    <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-surface-border" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-placeholder w-4 h-4" />
                  </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-surface-border">
                  <table className="w-full text-left">
                    <thead className="bg-surface-bg text-txt-secondary text-xs uppercase tracking-wider font-semibold border-b border-surface-border">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-surface-bg/30">
                          <td className="px-6 py-4 font-bold text-txt-dark">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-txt-body">{order.customer}</td>
                          <td className="px-6 py-4 font-bold text-brand-primary">₹{order.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Pending' ? 'warning' : 'default'}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleStatusChange(order.id, 'Delivered')} className="p-2 hover:bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></button>
                              <button onClick={() => handleStatusChange(order.id, 'Cancelled')} className="p-2 hover:bg-red-100 text-red-600 rounded-lg"><XCircle className="w-4 h-4" /></button>
                              <button onClick={() => handleStatusChange(order.id, 'In Transit')} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"><Truck className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-8 animate-in fade-in">
                <h2 className="text-2xl font-bold text-txt-dark mb-6">Add New Medicine</h2>
                <form onSubmit={handleAddProduct} className="space-y-6 max-w-2xl">
                  <Input
                    label="Medicine Name"
                    placeholder="e.g. Dolo 650mg"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Category"
                      placeholder="e.g. Fever"
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
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
                  </div>
                  <Input label="Manufacturer" placeholder="e.g. Apex Labs" />
                  <div className="pt-4">
                    <Button size="lg" className="w-full">Publish to Catalog</Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-xl">
                  <DollarSign className="w-8 h-8 mb-4 opacity-80" />
                  <p className="text-blue-100 font-bold uppercase tracking-wider text-xs">Total Revenue</p>
                  <h3 className="text-3xl font-black">₹4.2M</h3>
                </Card>
                <Card className="p-6 bg-white border-surface-border shadow-sm">
                  <ShoppingBag className="w-8 h-8 mb-4 text-brand-secondary" />
                  <p className="text-txt-secondary font-bold uppercase tracking-wider text-xs">Total Orders</p>
                  <h3 className="text-3xl font-black text-txt-dark">1,245</h3>
                </Card>
                <Card className="p-6 bg-white border-surface-border shadow-sm">
                  <Users className="w-8 h-8 mb-4 text-purple-500" />
                  <p className="text-txt-secondary font-bold uppercase tracking-wider text-xs">Active Clinics</p>
                  <h3 className="text-3xl font-black text-txt-dark">850+</h3>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
