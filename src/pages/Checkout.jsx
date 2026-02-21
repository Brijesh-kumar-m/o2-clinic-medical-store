import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, CreditCard, Home, MapPin, Package, Smartphone, UploadCloud, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const steps = ['Cart', 'Address', 'Prescription', 'Payment', 'Confirm'];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { items, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const tax = subtotal * 0.12;
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + tax + shipping;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handlePlaceOrder = () => {
    clearCart();
    toast.success('Order placed successfully! 🎉');
    navigate('/orders');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <ReviewCart items={items} subtotal={subtotal} tax={tax} shipping={shipping} total={total} />;
      case 1: return <AddressForm />;
      case 2: return <PrescriptionUpload />;
      case 3: return <PaymentMethod />;
      case 4: return <FinalReview total={total} items={items} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-8 lg:pt-3 lg:pb-12">
      {/* Step Progress Bar */}
      <div className="mb-8 lg:mb-12">
        {/* Desktop Stepper */}
        <div className="hidden sm:flex justify-between items-center relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-surface-border z-0" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-brand-primary z-0 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all duration-300 ${idx < currentStep ? 'bg-medical-success text-white' :
                idx === currentStep ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20' :
                  'bg-white border-2 border-surface-border text-txt-placeholder'
                }`}>
                {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${idx <= currentStep ? 'text-brand-primary' : 'text-txt-placeholder'
                }`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile Stepper */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-txt-dark">Step {currentStep + 1} of {steps.length}</span>
            <Badge className="bg-brand-primary/10 text-brand-primary border-none font-bold">{steps[currentStep]}</Badge>
          </div>
          <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[350px]"
      >
        {renderStep()}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 border-t border-surface-border pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="order-2 sm:order-1 gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </Button>
        <Button
          onClick={currentStep === steps.length - 1 ? handlePlaceOrder : nextStep}
          className="order-1 sm:order-2 px-8 h-12 gap-2 text-base font-bold"
        >
          {currentStep === steps.length - 1 ? '✓ Place Order' : 'Next Step'}
          {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

/* ---- Step Components ---- */

const ReviewCart = ({ items, subtotal, tax, shipping, total }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold flex items-center gap-2"><Package className="text-brand-primary" /> Review Items</h2>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Items List */}
      <div className="lg:col-span-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-txt-secondary text-center py-12">Your cart is empty.</p>
        ) : items.map(item => {
          const pack = item.packSizes?.find(p => p.size === item.selectedPackSize);
          if (!pack) return null;
          return (
            <Card key={`${item.id}-${item.selectedPackSize}`} className="p-4 border-surface-border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-surface-light rounded-xl p-2 shrink-0">
                    <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100&auto=format&fit=crop'} className="w-full h-full object-contain" alt={item.name} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-txt-dark">{item.name}</p>
                    <p className="text-xs text-txt-secondary">{item.selectedPackSize} × {item.quantity}</p>
                  </div>
                </div>
                <p className="font-black text-brand-primary text-lg">₹{(pack.price * item.quantity).toLocaleString()}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <div className="lg:col-span-4">
        <Card className="p-5 border-surface-border bg-surface-bg/50 sticky top-24">
          <h3 className="font-bold text-txt-dark mb-4 pb-3 border-b border-surface-border">Price Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-txt-secondary">Subtotal</span><span className="font-bold">₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-txt-secondary">GST (12%)</span><span className="font-bold">₹{tax.toFixed(0)}</span></div>
            <div className="flex justify-between"><span className="text-txt-secondary">Shipping</span><span className={`font-bold ${shipping === 0 ? 'text-medical-success' : ''}`}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="flex justify-between pt-3 border-t border-surface-border text-lg">
              <span className="font-bold text-txt-dark">Total</span>
              <span className="font-black text-brand-primary">₹{total.toFixed(0)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const AddressForm = () => {
  const [selected, setSelected] = useState(0);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-brand-primary" /> Delivery Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setSelected(0)}
          className={`p-5 rounded-xl flex items-start gap-4 text-left transition-all ${selected === 0 ? 'border-2 border-brand-primary bg-brand-primary/5 shadow-md' : 'border-2 border-surface-border hover:border-brand-primary/40'
            }`}
        >
          <Home className={`shrink-0 mt-0.5 ${selected === 0 ? 'text-brand-primary' : 'text-txt-placeholder'}`} />
          <div>
            <p className="font-bold text-txt-dark">Clinic Primary</p>
            <p className="text-sm text-txt-secondary leading-relaxed mt-1">123 Medical Street, Opp City Hospital, Mumbai, MH 400001</p>
            {selected === 0 && <Badge className="mt-2 bg-brand-primary/10 text-brand-primary border-none text-xs">Selected</Badge>}
          </div>
        </button>
        <button
          onClick={() => setSelected(1)}
          className={`p-5 rounded-xl flex items-start gap-4 text-left transition-all ${selected === 1 ? 'border-2 border-brand-primary bg-brand-primary/5 shadow-md' : 'border-2 border-surface-border hover:border-brand-primary/40'
            }`}
        >
          <Package className={`shrink-0 mt-0.5 ${selected === 1 ? 'text-brand-primary' : 'text-txt-placeholder'}`} />
          <div>
            <p className="font-bold text-txt-dark">Warehouse B</p>
            <p className="text-sm text-txt-secondary leading-relaxed mt-1">Unit 45, Pharma SEZ, Thane West, Mumbai, MH 400601</p>
            {selected === 1 && <Badge className="mt-2 bg-brand-primary/10 text-brand-primary border-none text-xs">Selected</Badge>}
          </div>
        </button>
      </div>

      {/* Add New Address Form */}
      <Card className="p-6 border-surface-border">
        <h3 className="font-bold text-txt-dark mb-4">Or Add New Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="Dr. Ashish Maurya" />
          <Input label="Phone Number" placeholder="+91 98765 43210" />
          <div className="sm:col-span-2">
            <Input label="Street Address" placeholder="123 Medical Street, Building Name" />
          </div>
          <Input label="City" placeholder="Mumbai" />
          <Input label="PIN Code" placeholder="400001" />
        </div>
      </Card>
    </div>
  );
};

const PrescriptionUpload = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold flex items-center gap-2"><UploadCloud className="text-brand-primary" /> Upload Prescriptions</h2>
    <p className="text-sm text-txt-secondary max-w-lg">Some items in your cart may require a valid prescription from a registered medical practitioner.</p>

    <div className="border-2 border-dashed border-surface-border rounded-2xl p-8 sm:p-12 hover:border-brand-primary transition-colors cursor-pointer text-center bg-surface-bg/30">
      <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary mb-4">
        <UploadCloud className="w-8 h-8" />
      </div>
      <p className="text-sm font-bold text-txt-dark mb-1">Drag and drop files here</p>
      <p className="text-sm text-txt-secondary">or <span className="text-brand-primary font-bold cursor-pointer hover:underline">browse files</span></p>
      <p className="text-[10px] uppercase font-black text-txt-placeholder mt-4 tracking-wider">JPG, PNG, PDF — Max 5MB</p>
    </div>

    <Button variant="outline" className="w-full sm:w-auto">Skip for Now</Button>
  </div>
);

const PaymentMethod = () => {
  const [selected, setSelected] = useState(0);
  const methods = [
    { name: 'UPI / GPay / PhonePe', icon: <Smartphone className="w-6 h-6 text-brand-primary" /> },
    { name: 'Credit / Debit Card', icon: <CreditCard className="w-6 h-6 text-brand-secondary" /> },
    { name: 'Net Banking', icon: <CreditCard className="w-6 h-6 text-indigo-500" /> },
    { name: 'Cash on Delivery', icon: <Package className="w-6 h-6 text-txt-secondary" /> },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="text-brand-primary" /> Payment Method</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((method, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`flex items-center gap-4 p-5 rounded-xl transition-all text-left ${selected === idx
              ? 'border-2 border-brand-primary bg-brand-primary/5 shadow-md'
              : 'border-2 border-surface-border hover:border-brand-primary/40'
              }`}
          >
            <div className="w-12 h-12 bg-white rounded-xl border border-surface-border flex items-center justify-center shrink-0">
              {method.icon}
            </div>
            <div>
              <span className="font-bold text-txt-dark block">{method.name}</span>
              {selected === idx && <span className="text-xs text-brand-primary font-bold">Selected</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const FinalReview = ({ total, items }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="text-medical-success" /> Order Confirmation</h2>

    {/* Total Card */}
    <Card className="bg-gradient-primary text-white p-6 sm:p-8 border-none shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Amount Payable</p>
          <p className="text-3xl sm:text-4xl font-black">₹{total.toFixed(2)}</p>
        </div>
        <Badge className="bg-white/20 text-white border-none py-2 px-4 text-xs font-bold">Wholesale Price Applied</Badge>
      </div>
    </Card>

    {/* Order Details */}
    <Card className="p-5 sm:p-6 border-surface-border bg-surface-bg/30">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-1 text-sm">
          <span className="font-bold text-txt-secondary">Delivery To:</span>
          <span className="font-bold text-txt-dark">Clinic Primary, Mumbai</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-1 text-sm">
          <span className="font-bold text-txt-secondary">Estimated Delivery:</span>
          <span className="font-bold text-medical-success">Within 24 Hours</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-1 text-sm">
          <span className="font-bold text-txt-secondary">Payment Method:</span>
          <span className="font-bold text-txt-dark">UPI / GPay / PhonePe</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-1 text-sm">
          <span className="font-bold text-txt-secondary">Items:</span>
          <span className="font-bold text-txt-dark">{items.length} Medicines</span>
        </div>
      </div>
    </Card>
  </div>
);

export default Checkout;
