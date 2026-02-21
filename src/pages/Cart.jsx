import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Trash2, Plus, Minus, ArrowRight, ShoppingBag,
  ShieldCheck, AlertCircle, Trash, Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getSubtotal, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const tax = subtotal * 0.12; // 12% GST
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-md py-4xl text-center">
        <div className="w-24 h-24 bg-surface-light rounded-full flex items-center justify-center text-txt-placeholder mx-auto mb-xl">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-txt-dark mb-4">Your Wholesale Cart is Empty</h2>
        <p className="text-txt-secondary mb-xl max-w-lg mx-auto px-4">
          Add medical supplies to your cart to proceed with procurement. Verified practices get bulk discounts.
        </p>
        <Link to="/products">
          <Button size="lg" className="rounded-full px-12">Browse Medicines</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-md sm:px-lg lg:px-xl pt-sm pb-xl">
      <div className="flex justify-between items-end mb-2xl">
        <div>
          <h1 className="text-3xl font-extrabold text-txt-dark mb-2">Shopping Cart</h1>
          <p className="text-txt-secondary">You have {items.length} unique medicines in your cart</p>
        </div>
        <Button
          variant="ghost"
          className="text-medical-error hover:bg-medical-error/10"
          onClick={() => {
            if (window.confirm('Clear entire cart?')) {
              clearCart();
              toast.success('Cart cleared');
            }
          }}
        >
          <Trash className="w-4 h-4 mr-2" /> Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-md">
          {items.map((item) => {
            const pack = item.packSizes.find(p => p.size === item.selectedPackSize);
            if (!pack) return null; // Skip invalid items
            return (
              <Card key={`${item.id}-${item.selectedPackSize}`} className="overflow-hidden p-0 border-surface-border hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row items-center gap-md p-md">
                    <div className="w-24 h-24 shrink-0 bg-surface-light rounded-xl p-3">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-md text-center sm:text-left">
                      <div>
                        <h3 className="font-bold text-txt-dark text-lg mb-1">{item.name}</h3>
                        <p className="text-xs text-brand-primary font-bold mb-2 uppercase tracking-tighter">{item.manufacturer.name}</p>
                        <Badge variant="secondary" className="text-[10px]">{item.selectedPackSize}</Badge>
                      </div>

                      <div className="flex flex-col items-center sm:items-end gap-md">
                        <div className="flex items-center border border-surface-border rounded-lg bg-surface-light p-0.5">
                          <button
                            className="p-1.5 hover:text-brand-primary transition-colors"
                            onClick={() => updateQuantity(item.id, item.selectedPackSize, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                          <button
                            className="p-1.5 hover:text-brand-primary transition-colors"
                            onClick={() => updateQuantity(item.id, item.selectedPackSize, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-black text-txt-dark">₹{pack.price * item.quantity}</span>
                          <span className="text-[10px] text-txt-placeholder font-medium">₹{pack.price} per unit</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="p-2 text-txt-placeholder hover:text-medical-error transition-colors hover:bg-medical-error/5 rounded-full"
                      onClick={() => removeFromCart(item.id, item.selectedPackSize)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Sidebar */}
        <aside className="lg:col-span-4">
          <Card className="sticky top-24 border-2 border-surface-border shadow-xl">
            <CardContent className="p-xl space-y-xl">
              <h3 className="text-xl font-bold text-txt-dark border-b border-surface-border pb-md">Order Summary</h3>

              <div className="space-y-md">
                <div className="flex justify-between text-txt-secondary font-medium">
                  <span>Subtotal</span>
                  <span className="text-txt-dark font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-txt-secondary font-medium">
                  <span>Wholesale GST (12%)</span>
                  <span className="text-txt-dark font-bold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-txt-secondary font-medium">
                  <span>Shipping Charges</span>
                  <span className={shipping === 0 ? "text-medical-success font-bold" : "text-txt-dark font-bold"}>
                    {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 p-2 rounded-lg flex items-center gap-2 tracking-tight">
                    <Info className="w-3 h-3" /> Add ₹{(5000 - subtotal).toFixed(2)} more for FREE shipping
                  </p>
                )}
              </div>

              <div className="pt-xl border-t border-surface-border">
                <div className="flex justify-between items-end mb-xl">
                  <span className="font-bold text-txt-secondary">Estimated Total</span>
                  <span className="text-3xl font-black text-brand-primary tracking-tighter">₹{total.toFixed(2)}</span>
                </div>

                <Link to="/checkout">
                  <Button className="w-full h-14 rounded-xl text-lg group shadow-lg" size="lg">
                    Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4 pt-md">
                <div className="flex items-center gap-3 text-sm text-txt-secondary font-medium">
                  <ShieldCheck className="w-5 h-5 text-medical-success" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-txt-secondary font-medium">
                  <AlertCircle className="w-5 h-5 text-medical-info" />
                  <span>GST Invoice Provided</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
