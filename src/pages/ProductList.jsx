
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, isMockMode } from '../lib/supabase';
import { mockProducts } from '../lib/mockData';
import ProductCard from '../components/features/ProductCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Filter, Search, X, LayoutGrid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

import { useDebounce } from '../hooks/useDebounce';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [viewType, setViewType] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { user } = useAuthStore();
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // Filter States
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Fetch wishlist IDs
  useEffect(() => {
    if (user) {
      const fetchWishlistIds = async () => {
        if (isMockMode) {
          const storedWishlist = JSON.parse(localStorage.getItem('mock_wishlist') || '[]');
          const userWishlist = storedWishlist
            .filter(item => item.userId === user.id)
            .map(item => item.productId);
          setWishlistIds(new Set(userWishlist));
          return;
        }

        const { data, error } = await supabase
          .from('wishlist')
          .select('product_id')
          .eq('user_id', user.id);
        
        if (!error && data) {
          setWishlistIds(new Set(data.map(item => item.product_id)));
        }
      };
      fetchWishlistIds();
    } else {
      setWishlistIds(new Set());
    }
  }, [user]);

  const toggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to manage wishlist');
      return;
    }

    if (isMockMode) {
      const storedWishlist = JSON.parse(localStorage.getItem('mock_wishlist') || '[]');
      
      if (wishlistIds.has(productId)) {
        // Remove
        const newWishlist = storedWishlist.filter(
          item => !(item.userId === user.id && item.productId === productId)
        );
        localStorage.setItem('mock_wishlist', JSON.stringify(newWishlist));
        
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Removed from wishlist');
      } else {
        // Add
        const newWishlist = [...storedWishlist, { userId: user.id, productId }];
        localStorage.setItem('mock_wishlist', JSON.stringify(newWishlist));
        
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          newSet.add(productId);
          return newSet;
        });
        toast.success('Added to wishlist');
      }
      return;
    }

    if (wishlistIds.has(productId)) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (!error) {
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Removed from wishlist');
      } else {
        toast.error('Failed to remove from wishlist');
      }
    } else {
      const { error } = await supabase
        .from('wishlist')
        .insert([{ user_id: user.id, product_id: productId }]);
      
      if (!error) {
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          newSet.add(productId);
          return newSet;
        });
        toast.success('Added to wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    }
  };

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;
        
        // Inner try-catch for Supabase fetching with fallback
        try {
          let error = null;
          if (isMockMode) {
            console.log('Using mock data for ProductList');
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (debouncedSearchQuery && debouncedSearchQuery.length > 2) {
              const q = debouncedSearchQuery.toLowerCase();
              data = mockProducts.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.generic_name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q)
              );
            } else {
              data = mockProducts;
            }
          } else {
            if (debouncedSearchQuery && debouncedSearchQuery.length > 2) {
              const result = await supabase.rpc('search_medicines', { search_query: debouncedSearchQuery });
              data = result.data;
              error = result.error;
            } else {
              const result = await supabase.from('products').select('*');
              data = result.data;
              error = result.error;
            }
          }

          if (error) throw error;
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to mock data:', err);
          // Fallback to mock data on error
          if (debouncedSearchQuery && debouncedSearchQuery.length > 2) {
              const q = debouncedSearchQuery.toLowerCase();
              data = mockProducts.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.generic_name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q)
              );
          } else {
              data = mockProducts;
          }
        }

        // Map snake_case to camelCase for frontend components
        const mappedProducts = (data || []).map(p => ({
            id: p.id,
            name: p.name,
            genericName: p.generic_name,
            brand: p.brand,
            manufacturer: p.manufacturer, // Assuming JSONB stores { name, logo }
            category: p.category,
            subCategory: p.sub_category,
            composition: p.composition,
            dosageForm: p.dosage_form,
            packSizes: p.pack_sizes || [],
            prescriptionRequired: p.prescription_required,
            schedule: p.schedule,
            stock: p.stock,
            expiryDate: p.expiry_date,
            rating: p.rating,
            reviewCount: p.review_count,
            featured: p.featured,
            description: p.description,
            images: p.images,
            indications: p.indications,
            sideEffects: p.side_effects,
            storage: p.storage
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Only show toast if it's not a connection error to avoid spamming on load
        if (error.message !== 'Failed to fetch') {
          toast.error('Failed to load products. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery]);

  const categories = useMemo(() => ['All', ...new Set(products.map(m => m.category))], [products]);
  const manufacturers = useMemo(() => ['All', ...new Set(products.map(m => m.manufacturer?.name).filter(Boolean))], [products]);

  const filteredMedicines = useMemo(() => {
    return products
      .filter(m => {
        const q = searchQuery.toLowerCase();
        
        let matchesClientSearch = true;
        if (!debouncedSearchQuery || debouncedSearchQuery.length <= 2) {
             matchesClientSearch = searchQuery === '' ||
              m.name.toLowerCase().includes(q) ||
              (m.genericName && m.genericName.toLowerCase().includes(q)) || 
              (m.brand && m.brand.toLowerCase().includes(q)) ||
              (m.composition && m.composition.toLowerCase().includes(q));
        }

        const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
        const matchesMfr = selectedManufacturer === 'All' || m.manufacturer?.name === selectedManufacturer;

        return matchesClientSearch && matchesCategory && matchesMfr;
      })
      .sort((a, b) => {
        const priceA = a.packSizes?.[0]?.price || 0;
        const priceB = b.packSizes?.[0]?.price || 0;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // popular/default
      });
  }, [searchQuery, selectedCategory, selectedManufacturer, sortBy, products, debouncedSearchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-txt-dark mb-2 tracking-tight">Medicine Catalog</h1>
          <p className="text-txt-secondary">
            Showing <span className="font-bold text-txt-dark">{filteredMedicines.length}</span> verified pharmaceutical products
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-surface-border p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-md transition-all ${viewType === 'grid' ? 'bg-surface-light text-brand-primary shadow-sm' : 'text-txt-placeholder hover:text-txt-dark'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-md transition-all ${viewType === 'list' ? 'bg-surface-light text-brand-primary shadow-sm' : 'text-txt-placeholder hover:text-txt-dark'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 pl-4 pr-10 rounded-xl border border-surface-border bg-white text-sm font-semibold text-txt-dark focus:ring-2 focus:ring-brand-primary outline-none appearance-none cursor-pointer shadow-sm hover:border-brand-primary/50 transition-colors w-48"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-placeholder pointer-events-none" />
          </div>

          <Button
            variant="outline"
            className="md:hidden border-surface-border"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex gap-8 relative items-start">
        {/* Sidebar Filters */}
        <aside className={`w-72 shrink-0 flex flex-col gap-8 ${isFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:flex'} sticky top-24`}>
          {isFilterOpen && (
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold text-txt-dark">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-surface-light rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
          )}

          {/* Search */}
          <div className="glass p-5 rounded-2xl border border-white/20 shadow-sm bg-white/50">
            <h3 className="font-bold text-txt-dark flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
              <Search className="w-4 h-4 text-brand-primary" /> Search
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-placeholder" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-border bg-white text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-txt-placeholder"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="glass p-5 rounded-2xl border border-white/20 shadow-sm bg-white/50">
            <h3 className="font-bold text-txt-dark mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all flex justify-between items-center group ${selectedCategory === cat ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-txt-secondary hover:bg-surface-light hover:text-txt-dark'}`}
                >
                  {cat}
                  {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Manufacturers */}
          <div className="glass p-5 rounded-2xl border border-white/20 shadow-sm bg-white/50">
            <h3 className="font-bold text-txt-dark mb-4 text-sm uppercase tracking-wider">Manufacturers</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {manufacturers.slice(0, 15).map((mfr) => (
                <button
                  key={mfr}
                  onClick={() => setSelectedManufacturer(mfr)}
                  className={`px-3 py-1.5 rounded-full border transition-all ${selectedManufacturer === mfr
                    ? 'bg-brand-secondary text-white border-brand-secondary font-medium shadow-sm'
                    : 'bg-white border-surface-border text-txt-secondary hover:border-brand-secondary/50 hover:text-brand-secondary'
                    }`}
                >
                  {mfr}
                </button>
              ))}
            </div>
          </div>

          {isFilterOpen && (
            <Button className="mt-8 w-full py-6 text-lg" onClick={() => setIsFilterOpen(false)}>
              Show {filteredMedicines.length} Results
            </Button>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
             <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
             </div>
          ) : filteredMedicines.length > 0 ? (
            <div className={`grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredMedicines.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isWishlisted={wishlistIds.has(product.id)}
                  onToggleWishlist={(e) => toggleWishlist(e, product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-dashed border-surface-border">
              <div className="w-20 h-20 bg-surface-bg rounded-full flex items-center justify-center text-txt-placeholder mb-6">
                <Search className="w-10 h-10 opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-txt-dark mb-2">No medicines found</h3>
              <p className="text-txt-secondary mb-8 max-w-sm mx-auto">We couldn't find any items matching your filters. Try checking spelling or clearing filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedManufacturer('All');
                }}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
