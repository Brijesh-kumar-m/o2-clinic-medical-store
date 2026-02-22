import React, { useState, useEffect } from 'react';
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
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    manufacturer: '', 
    description: '', 
    packSize: '',
    stock: '100',
    featured: false,
    image: ''
  });

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
      toast.success('Settings updated successfully');
    } else {
      toast.error('Failed to update settings');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      // Note: This requires a foreign key relationship between orders.user_id and profiles.id
      // Check supabase_schema.sql for the correct constraint
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
      // Fallback if join fails
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
      // Fetch orders count and revenue (excluding cancelled)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status');
      
      if (ordersError) throw ordersError;

      const totalRevenue = ordersData
        .filter(order => order.status !== 'cancelled' && order.status !== 'Cancelled')
        .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
      
      // Fetch users count
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
      const statusLower = newStatus.toLowerCase();
      const { error } = await supabase
        .from('orders')
        .update({ status: statusLower })
        .eq('id', id);

      if (error) throw error;

      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast.success(`Order ${id} marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleUserStatusChange = async (id, newStatus) => {
    try {
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
      // Create a default pack size based on the price
      const packSizes = [{
        size: newProduct.packSize || "Standard",
        price: parseFloat(newProduct.price),
        mrp: parseFloat(newProduct.price) * 1.2, // Default MRP calculation
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
          images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"] // Default image
        });

      if (error) throw error;

      toast.success(`Product "${newProduct.name}" added to catalog!`);
      fetchProducts();
      setNewProduct({ 
        name: '', 
        price: '', 
        category: '', 
        manufacturer: '', 
        description: '', 
        packSize: '',
        mrp: '',
        stock: '100',
        featured: false
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
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
            <Button variant="outline" className="bg-white" onClick={() => setActiveTab('settings')}><Settings className="w-4 h-4 mr-2" /> Settings</Button>
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
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-brand-primary text-white shadow-md' : 'text-txt-secondary hover:bg-surface-bg'}`}
                >
                  <Settings className="w-5 h-5" /> Settings
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
                          <td className="px-6 py-4 text-sm text-txt-body">{order.phone}</td>
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
              <div className="space-y-8 animate-in fade-in">
                {/* Add Product Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-8">
                  <h2 className="text-2xl font-bold text-txt-dark mb-6">Add New Medicine</h2>
                  <form onSubmit={handleAddProduct} className="space-y-6 max-w-2xl">
                    <Input
                      label="Medicine Name"
                      placeholder="e.g. Dolo 650mg"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Category"
                      placeholder="e.g. Fever"
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
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
                    <Input 
                      label="Manufacturer" 
                      placeholder="e.g. Apex Labs" 
                      value={newProduct.manufacturer}
                      onChange={e => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                      required
                    />
                    <Input
                      label="Description"
                      placeholder="Product description..."
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    />
                    <Input
                      label="Image URL"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.image}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Stock Quantity"
                        type="number"
                        value={newProduct.stock}
                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                        required
                      />
                      <div className="flex items-center h-full pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-surface-border text-brand-primary focus:ring-brand-primary"
                            checked={newProduct.featured}
                            onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                          />
                          <span className="text-sm font-medium text-txt-secondary">Featured Product</span>
                        </label>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button size="lg" className="w-full" disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish to Catalog'}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Product List Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-8">
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-txt-dark">Product Catalog</h2>
                      <Button variant="outline" onClick={() => fetchProducts()}>Refresh List</Button>
                   </div>
                   
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-surface-bg text-txt-secondary text-xs uppercase tracking-wider font-semibold border-b border-surface-border">
                          <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                          {products.map(product => (
                            <tr key={product.id} className="hover:bg-surface-bg/30">
                              <td className="px-6 py-4 font-bold text-txt-dark">{product.name}</td>
                              <td className="px-6 py-4 text-sm text-txt-body">{product.category}</td>
                              <td className="px-6 py-4">
                                <Badge variant={product.stock > 50 ? 'success' : product.stock > 0 ? 'warning' : 'destructive'}>
                                  {product.stock}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-brand-primary font-bold">
                                ₹{product.pack_sizes?.[0]?.price || 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    title="Delete Product"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {products.length === 0 && (
                            <tr>
                              <td colSpan="5" className="px-6 py-8 text-center text-txt-secondary">
                                No products found. Add some products above!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-8 animate-in fade-in">
                <h2 className="text-2xl font-bold text-txt-dark mb-6">Sellers & Users</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-bg text-txt-secondary text-xs uppercase tracking-wider font-semibold border-b border-surface-border">
                            <tr>
                                <th className="px-6 py-4">Name/Practice</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-surface-bg/30">
                            <td className="px-6 py-4 font-bold text-txt-dark">
                                {user.practice_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm text-txt-body">{user.email}</td>
                            <td className="px-6 py-4 text-sm text-txt-body capitalize">{user.role}</td>
                            <td className="px-6 py-4">
                                <Badge variant={user.status === 'approved' ? 'success' : user.status === 'pending' ? 'warning' : 'default'}>
                                    {user.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button onClick={() => handleUserStatusChange(user.id, 'approved')} className="p-2 hover:bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleUserStatusChange(user.id, 'rejected')} className="p-2 hover:bg-red-100 text-red-600 rounded-lg"><XCircle className="w-4 h-4" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                    </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-8 animate-in fade-in">
                <h2 className="text-2xl font-bold text-txt-dark mb-6">Application Settings</h2>
                <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-xl">
                  <Input
                    label="GST Rate (%)"
                    type="number"
                    step="0.01"
                    value={settingsForm.gstRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gstRate: e.target.value })}
                    required
                  />
                  <Input
                    label="Shipping Charge (₹)"
                    type="number"
                    step="0.01"
                    value={settingsForm.shippingCharge}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shippingCharge: e.target.value })}
                    required
                  />
                  <Input
                    label="Free Shipping Threshold (₹)"
                    type="number"
                    step="0.01"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: e.target.value })}
                    required
                  />
                  <Button type="submit">
                    Save Settings
                  </Button>
                </form>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-xl">
                  <DollarSign className="w-8 h-8 mb-4 opacity-80" />
                  <p className="text-blue-100 font-bold uppercase tracking-wider text-xs">Total Revenue</p>
                  <h3 className="text-3xl font-black">₹{stats.revenue.toLocaleString()}</h3>
                </Card>
                <Card className="p-6 bg-white border-surface-border shadow-sm">
                  <ShoppingBag className="w-8 h-8 mb-4 text-brand-secondary" />
                  <p className="text-txt-secondary font-bold uppercase tracking-wider text-xs">Total Orders</p>
                  <h3 className="text-3xl font-black text-txt-dark">{stats.orders}</h3>
                </Card>
                <Card className="p-6 bg-white border-surface-border shadow-sm">
                  <Users className="w-8 h-8 mb-4 text-purple-500" />
                  <p className="text-txt-secondary font-bold uppercase tracking-wider text-xs">Active Users</p>
                  <h3 className="text-3xl font-black text-txt-dark">{stats.users}</h3>
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
