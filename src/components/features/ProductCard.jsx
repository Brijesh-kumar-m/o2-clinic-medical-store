import React from 'react';
import { Heart, ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, isWishlisted, onToggleWishlist }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const mainPack = product.packSizes?.[0] || { price: 0, mrp: 0, discount: 0, size: 'Standard' };
  const discount = mainPack.discount || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.packSizes?.length) {
      toast.error('Product currently unavailable');
      return;
    }
    addToCart(product, 1, mainPack.size);
    toast.success(`${product.name} added to cart!`, {
      style: {
        borderRadius: '10px',
        background: '#fff',
        color: '#333',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      iconTheme: {
        primary: '#0284C7',
        secondary: '#fff',
      },
    });
  };

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-surface-border bg-white hover:border-brand-primary/50 hover:shadow-xl transition-all duration-300 ease-in-out rounded-2xl">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
        {discount > 0 && (
          <Badge className="bg-medical-error text-white border-none font-bold shadow-sm">
            {discount}% OFF
          </Badge>
        )}
        {product.prescriptionRequired && (
          <Badge className="bg-medical-warning/90 text-white border-none shadow-sm text-[10px] backdrop-blur-md">
            Rx Required
          </Badge>
        )}
      </div>

      <button 
        onClick={onToggleWishlist}
        className={`absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white hover:text-medical-error hover:bg-red-50 transition-all shadow-md duration-300 ${
          isWishlisted 
            ? 'text-medical-error opacity-100 translate-y-0' 
            : 'text-txt-secondary opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-medical-error' : ''}`} />
      </button>

      {/* Link Wrapper for Content */}
      <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-bg p-6 flex items-center justify-center">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-multiply"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-5">
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
              {product.manufacturer.name}
            </p>
            <h3 className="font-bold text-txt-dark text-lg leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-txt-secondary mt-1 font-medium">
              {product.genericName}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex bg-yellow-50 px-1.5 py-0.5 rounded text-medical-warning">
              <Star className="w-3 h-3 fill-medical-warning mr-1" />
              <span className="text-xs font-bold">{product.rating}</span>
            </div>
            <span className="text-xs text-txt-placeholder">
              ({product.reviewCount} Reviews)
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-surface-bg">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-bold text-txt-dark">₹{mainPack.price}</span>
              {mainPack.discount > 0 && (
                <span className="text-sm text-txt-placeholder line-through decoration-slate-400">₹{mainPack.mrp}</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Button Outside Link */}
      <div className="px-5 pb-5 mt-auto">
        <Button
          onClick={handleAddToCart}
          className="w-full h-11 rounded-xl shadow-none border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 relative overflow-hidden group/btn font-semibold"
          variant="outline"
        >
          <span className="flex items-center justify-center gap-2 relative z-10 transition-transform duration-300 group-hover/btn:-translate-y-10">
            Add to Cart
          </span>
          <span className="absolute inset-0 flex items-center justify-center gap-2 translate-y-10 group-hover/btn:translate-y-0 transition-transform duration-300 z-10">
            <ShoppingCart className="w-4 h-4" /> Add Now
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
