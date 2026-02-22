import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product:products (
            id,
            name,
            generic_name,
            manufacturer,
            pack_sizes,
            rating,
            stock,
            images,
            description
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const mappedItems = data.map(item => {
        const product = item.product;
        const mainPack = product.pack_sizes && product.pack_sizes.length > 0 ? product.pack_sizes[0] : { price: 0, mrp: 0, discount: 0 };
        return {
          id: product.id,
          wishlistId: item.id,
          name: product.name,
          genericName: product.generic_name,
          manufacturer: product.manufacturer?.name || 'Unknown',
          price: mainPack.price,
          mrp: mainPack.mrp,
          discount: mainPack.discount,
          rating: product.rating || 0,
          inStock: product.stock > 0,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop',
          // Additional fields for cart
          brand: product.brand,
          category: product.category,
          packSizes: product.pack_sizes || [],
          rawManufacturer: product.manufacturer
        };
      });

      setItems(mappedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      generic_name: item.genericName,
      brand: item.brand,
      manufacturer: item.rawManufacturer || { name: item.manufacturer },
      category: item.category,
      pack_sizes: item.packSizes,
      images: [item.image]
    }, 1, item.packSizes?.[0]?.size || "Standard");
    toast.success(`Added ${item.name} to cart`);
  };

  const removeItem = async (productId) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearAll = async () => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-8 lg:pt-3 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-txt-dark flex items-center gap-3">
            <Heart className="w-7 h-7 text-medical-error fill-medical-error" /> My Wishlist
          </h1>
          <p className="text-txt-secondary mt-1">{items.length} saved medicines</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" className="text-sm" onClick={clearAll}>
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
          <p className="text-txt-secondary mb-6 max-w-md mx-auto px-4">
            Save medicines you're interested in to quickly access them later.
          </p>
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
                    onClick={() => handleAddToCart(item)}
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
