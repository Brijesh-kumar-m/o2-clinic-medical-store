import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { toast } from 'react-hot-toast';

// Demo wishlist data
const wishlistItems = [
  {
    id: 'med_001',
    name: 'Dolo 650mg',
    genericName: 'Paracetamol',
    manufacturer: 'Micro Labs',
    price: 35,
    mrp: 42,
    discount: 17,
    rating: 4.5,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'med_003',
    name: 'Azithromycin 500mg',
    genericName: 'Azithromycin',
    manufacturer: 'Cipla',
    price: 89,
    mrp: 120,
    discount: 26,
    rating: 4.3,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'med_005',
    name: 'Pantoprazole 40mg',
    genericName: 'Pantoprazole',
    manufacturer: 'Sun Pharma',
    price: 65,
    mrp: 85,
    discount: 24,
    rating: 4.6,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=300&auto=format&fit=crop',
  },
];

const Wishlist = () => {
  const [items, setItems] = React.useState(wishlistItems);

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Removed from wishlist');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-txt-dark flex items-center gap-3">
            <Heart className="w-7 h-7 text-medical-error fill-medical-error" /> My Wishlist
          </h1>
          <p className="text-txt-secondary mt-1">{items.length} saved medicines</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" className="text-sm" onClick={() => { setItems([]); toast.success('Wishlist cleared'); }}>
            Clear All
          </Button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-txt-placeholder" />
          </div>
          <h2 className="text-xl font-bold text-txt-dark mb-2">Your wishlist is empty</h2>
          <p className="text-txt-secondary mb-6 max-w-sm mx-auto">Save medicines you're interested in to quickly access them later.</p>
          <Link to="/products">
            <Button className="rounded-full px-8">Browse Medicines</Button>
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden border-surface-border hover:shadow-xl transition-all duration-300 group">
              {/* Image */}
              <Link to={`/product/${item.id}`}>
                <div className="relative aspect-[4/3] bg-surface-bg p-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-medical-error text-white border-none font-bold shadow-sm">
                      {item.discount}% OFF
                    </Badge>
                  )}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <Badge className="bg-txt-primary text-white border-none text-sm px-4 py-1">Out of Stock</Badge>
                    </div>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary mb-1">{item.manufacturer}</p>
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-bold text-txt-dark text-base leading-tight mb-1 hover:text-brand-primary transition-colors">{item.name}</h3>
                </Link>
                <p className="text-xs text-txt-secondary mb-3">{item.genericName}</p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex bg-yellow-50 px-1.5 py-0.5 rounded text-medical-warning">
                    <Star className="w-3 h-3 fill-medical-warning mr-1" />
                    <span className="text-xs font-bold">{item.rating}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-black text-txt-dark">₹{item.price}</span>
                  {item.discount > 0 && (
                    <span className="text-sm text-txt-placeholder line-through">₹{item.mrp}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 h-10 rounded-xl text-sm font-bold gap-2"
                    disabled={!item.inStock}
                  >
                    <ShoppingCart className="w-4 h-4" /> {item.inStock ? 'Add to Cart' : 'Unavailable'}
                  </Button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 rounded-xl border border-surface-border text-txt-placeholder hover:text-medical-error hover:border-medical-error/30 hover:bg-medical-error/5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
