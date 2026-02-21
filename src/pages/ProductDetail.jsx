import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicines } from '../data/medicines';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import {
  Plus, Minus, ShoppingCart, Heart, ShieldCheck,
  Truck, Info, AlertCircle, ChevronRight, Star,
  Package, FlaskConical, Pill, Thermometer,
  Shield, CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import ProductCard from '../components/features/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const product = useMemo(() => medicines.find(m => m.id === id), [id]);
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedPack, setSelectedPack] = useState(product?.packSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const relatedProducts = useMemo(() =>
    product ? medicines.filter(m => m.category === product.category && m.id !== product.id).slice(0, 4) : [],
    [product]
  );

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4 text-txt-dark">Medicine not found</h2>
        <Link to="/products">
          <Button>Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedPack.size);
    toast.success(`Added ${quantity} ${selectedPack.size} of ${product.name} to cart`);
  };

  const tabs = [
    { id: 'description', label: 'Description', content: product.description, icon: <Info className="w-4 h-4" /> },
    { id: 'composition', label: 'Composition', content: product.composition, icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'indications', label: 'Indications', content: product.indications?.join(', ') || 'N/A', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'sideEffects', label: 'Side Effects', content: product.sideEffects?.join(', ') || 'N/A', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'storage', label: 'Storage', content: product.storage || 'Store in a cool dry place', icon: <Thermometer className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-8 lg:pt-3 lg:pb-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-txt-placeholder uppercase tracking-wider mb-8">
        <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-brand-primary transition-colors">Catalog</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-txt-dark truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-6 sticky top-24 self-start">
          <div className="aspect-[4/3] bg-white rounded-3xl border border-surface-border p-8 flex items-center justify-center overflow-hidden group shadow-sm relative">
            <div className="absolute top-4 right-4 z-10">
              <button className="p-3 rounded-full bg-white border border-surface-border text-txt-secondary hover:text-medical-error hover:border-medical-error/30 transition-all shadow-sm">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white border border-surface-border rounded-xl p-2 cursor-pointer hover:border-brand-primary/50 hover:shadow-md transition-all">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=150&auto=format&fit=crop'}
                  className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity mix-blend-multiply"
                />
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="flex flex-col items-center text-center p-3 bg-surface-bg rounded-xl">
              <ShieldCheck className="w-6 h-6 text-medical-success mb-1" />
              <span className="text-[10px] font-bold text-txt-dark">100% Genuine</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-surface-bg rounded-xl">
              <Truck className="w-6 h-6 text-brand-primary mb-1" />
              <span className="text-[10px] font-bold text-txt-dark">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-surface-bg rounded-xl">
              <Shield className="w-6 h-6 text-brand-secondary mb-1" />
              <span className="text-[10px] font-bold text-txt-dark">Secure Pack</span>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="border-brand-primary text-brand-primary bg-brand-primary/5">
                {product.category}
              </Badge>
              {product.prescriptionRequired &&
                <Badge variant="warning" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Rx Required
                </Badge>
              }
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-txt-dark mb-4 tracking-tight leading-tight">{product.name}</h1>
            <p className="text-xl text-txt-secondary font-medium mb-6 flex items-center gap-2">
              <Pill className="w-5 h-5 text-txt-placeholder" /> {product.genericName}
            </p>

            <div className="flex items-center flex-wrap gap-4 py-6 border-y border-surface-border">
              <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-medical-warning fill-medical-warning' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold ml-1 text-txt-dark">{product.rating}</span>
                <span className="text-xs text-txt-placeholder ml-1">({product.reviewCount})</span>
              </div>
              <div className="h-8 w-px bg-surface-border"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medical-success animate-pulse"></div>
                <span className="text-sm font-bold text-medical-success">In Stock & Ready to Ship</span>
              </div>
            </div>
          </div>

          {/* Pricing & Selection */}
          <div className="bg-white p-8 rounded-3xl border border-surface-border shadow-lg shadow-surface-border/50 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-gradient-radial from-brand-primary/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-bold text-txt-dark tracking-tight">₹{selectedPack.price}</span>
                <span className="text-xl text-txt-placeholder line-through font-medium">₹{selectedPack.mrp}</span>
                <Badge variant="error" className="text-sm px-3 py-1 font-bold shadow-sm">
                  {selectedPack.discount}% OFF
                </Badge>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-bold text-txt-dark uppercase tracking-wider flex items-center gap-2">
                      <Package className="w-4 h-4 text-brand-primary" /> Pack Size
                    </p>
                    <p className="text-xs font-bold text-marine-600">Wholesale Price</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {product.packSizes.map((pack) => (
                      <button
                        key={pack.size}
                        onClick={() => setSelectedPack(pack)}
                        className={`px-4 py-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer hover:shadow-md relative overflow-hidden ${selectedPack.size === pack.size ? 'border-brand-primary bg-brand-primary text-white shadow-md transform scale-105' : 'border-surface-border bg-surface-bg/50 hover:bg-white text-txt-dark'}`}
                      >
                        <span className="font-bold text-sm">{pack.size}</span>
                        <span className={`text-xs ${selectedPack.size === pack.size ? 'text-white/90' : 'text-txt-secondary'}`}>₹{pack.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-surface-border rounded-xl p-1 bg-surface-bg/30">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-4 hover:text-brand-primary transition-colors hover:bg-white rounded-lg active:scale-95"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-16 text-center font-bold bg-transparent outline-none text-txt-dark text-lg"
                    />
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-4 hover:text-brand-primary transition-colors hover:bg-white rounded-lg active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <Button
                    size="lg"
                    className="flex-1 w-full rounded-xl shadow-lg shadow-brand-primary/25 h-auto py-4 text-lg font-bold group relative overflow-hidden"
                    onClick={handleAddToCart}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center justify-center gap-3">
                      <ShoppingCart className="w-6 h-6 group-hover:animate-bounce-slow" />
                      Add to Wholesale Cart
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Manufacturer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-surface-border rounded-2xl bg-surface-light/30 flex items-center gap-4 hover:border-brand-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white border border-surface-border flex items-center justify-center text-brand-primary shadow-sm">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-txt-placeholder tracking-widest mb-0.5">Manufacturer</p>
                <p className="text-sm font-bold text-txt-dark truncate">{product.manufacturer.name}</p>
              </div>
            </div>
            <div className="p-4 border border-surface-border rounded-2xl bg-surface-light/30 flex items-center gap-4 hover:border-brand-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white border border-surface-border flex items-center justify-center text-brand-secondary shadow-sm">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-txt-placeholder tracking-widest mb-0.5">Batch No</p>
                <p className="text-sm font-bold text-txt-dark">PCM-{id.toUpperCase()}-001</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-24">
        <div className="flex border-b border-surface-border gap-8 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-brand-primary' : 'text-txt-placeholder hover:text-txt-secondary'}`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
        <div className="bg-white p-8 rounded-3xl border border-surface-border min-h-[200px] leading-relaxed text-txt-body shadow-sm">
          {tabs.find(t => t.id === activeTab)?.content}
        </div>
      </div>

      {/* Related Products */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-txt-dark mb-2">Alternative Medicines</h2>
            <p className="text-txt-secondary">Clinically equivalent substitutes and related products</p>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="group text-brand-primary">
              View Complete Catalog <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
