import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, X, LogIn, ChevronDown, Package, LayoutDashboard, Settings, LogOut, ShieldCheck, UserCircle } from 'lucide-react';
import Logo from '../ui/Logo';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const cartItemCount = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-border shadow-sm">
      <div className="max-w-7xl mx-auto px-md sm:px-lg lg:px-xl">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <Logo className="w-10 h-10 transition-transform group-hover:scale-105" />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Search medicines, generic names..."
              className="w-full pl-11 pr-4 py-sm rounded-full border border-surface-border bg-surface-light focus:bg-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-placeholder w-5 h-5" />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/wishlist" className="p-2 text-txt-secondary hover:text-brand-primary transition-colors hover:bg-surface-light rounded-full">
              <Heart className="w-6 h-6" />
            </Link>

            <Link to="/cart" className="p-2 text-txt-secondary hover:text-brand-primary transition-colors hover:bg-surface-light rounded-full relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-medical-error text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                {/* Profile Button */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-surface-border hover:bg-surface-light hover:border-brand-primary/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-sm">
                    {user?.profile?.firstName?.[0] || 'U'}
                  </div>
                  <span className="hidden lg:block text-sm font-semibold text-txt-primary mr-1 max-w-[100px] truncate">
                    {user?.profile?.firstName || 'Account'}
                  </span>
                  <ChevronDown className={`hidden lg:block w-4 h-4 text-txt-secondary transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-surface-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="p-5 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border-b border-surface-border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user?.profile?.firstName?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-txt-dark truncate">
                            {user?.profile?.firstName} {user?.profile?.lastName}
                          </p>
                          <p className="text-xs text-txt-secondary truncate">{user?.profile?.email}</p>
                          {user?.role === 'admin' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full mt-1">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-txt-body hover:bg-surface-light transition-all group"
                      >
                        <UserCircle className="w-5 h-5 text-txt-placeholder group-hover:text-brand-primary transition-colors" />
                        <div>
                          <span className="font-semibold text-sm block">My Profile</span>
                          <span className="text-[11px] text-txt-placeholder">View & edit profile details</span>
                        </div>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-txt-body hover:bg-surface-light transition-all group"
                      >
                        <Package className="w-5 h-5 text-txt-placeholder group-hover:text-brand-primary transition-colors" />
                        <div>
                          <span className="font-semibold text-sm block">My Orders</span>
                          <span className="text-[11px] text-txt-placeholder">Track, return, or re-order</span>
                        </div>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-txt-body hover:bg-surface-light transition-all group"
                      >
                        <Heart className="w-5 h-5 text-txt-placeholder group-hover:text-medical-error transition-colors" />
                        <div>
                          <span className="font-semibold text-sm block">Wishlist</span>
                          <span className="text-[11px] text-txt-placeholder">Your saved medicines</span>
                        </div>
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-txt-body hover:bg-surface-light transition-all group"
                        >
                          <LayoutDashboard className="w-5 h-5 text-txt-placeholder group-hover:text-brand-secondary transition-colors" />
                          <div>
                            <span className="font-semibold text-sm block">Admin Panel</span>
                            <span className="text-[11px] text-txt-placeholder">Manage orders & catalog</span>
                          </div>
                        </Link>
                      )}

                      <div className="border-t border-surface-border my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-medical-error hover:bg-medical-error/5 transition-all group"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold text-sm">Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-full font-semibold shadow-md hover:scale-105 transition-all text-sm">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            <button
              className="md:hidden p-2 text-txt-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-md pb-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full pl-11 pr-4 py-2 rounded-full border border-surface-border bg-surface-light outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-placeholder w-5 h-5" />
        </form>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-surface-border shadow-xl p-md flex flex-col gap-1 animate-in slide-in-from-top duration-300 z-50">

          {/* Mobile User Info */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold">
                {user?.profile?.firstName?.[0] || 'U'}
              </div>
              <div>
                <p className="font-bold text-sm text-txt-dark">{user?.profile?.firstName} {user?.profile?.lastName}</p>
                <p className="text-xs text-txt-secondary">{user?.profile?.email}</p>
              </div>
            </div>
          )}

          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-txt-dark font-semibold hover:bg-surface-light transition-colors">
            Home
          </Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-txt-dark font-semibold hover:bg-surface-light transition-colors">
            Browse Medicines
          </Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-txt-dark font-semibold hover:bg-surface-light transition-colors">
            Cart {cartItemCount > 0 && <span className="ml-auto bg-medical-error text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartItemCount}</span>}
          </Link>
          {isAuthenticated ? (
            <>
              <div className="border-t border-surface-border my-1" />
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-txt-dark font-semibold hover:bg-surface-light transition-colors">
                <UserCircle className="w-5 h-5 text-txt-placeholder" /> My Profile
              </Link>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-txt-dark font-semibold hover:bg-surface-light transition-colors">
                <Package className="w-5 h-5 text-txt-placeholder" /> My Orders
              </Link>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-txt-dark font-semibold hover:bg-surface-light transition-colors">
                <Heart className="w-5 h-5 text-txt-placeholder" /> Wishlist
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-primary font-semibold hover:bg-brand-primary/5 transition-colors">
                  <LayoutDashboard className="w-5 h-5" /> Admin Panel
                </Link>
              )}
              <div className="border-t border-surface-border my-1" />
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-medical-error font-semibold hover:bg-medical-error/5 transition-colors text-left w-full">
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-primary font-bold hover:bg-brand-primary/5 transition-colors">
              <LogIn className="w-5 h-5" /> Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
