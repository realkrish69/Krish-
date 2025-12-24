
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { cart, wishlist, isAuthenticated } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Search button logic (isSearchOpen, searchQuery, handleSearchSubmit) was removed here
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Streetwear', path: '/shop?category=Streetwear' },
    { name: 'Techwear', path: '/shop?category=Techwear' },
  ];

  /**
   * CORRECTED: Robust logic to determine active navigation state.
   * Checks both pathname and query parameters to distinguish between Shop, Streetwear, and Techwear.
   */
  const isLinkActive = (path: string) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    // Handle Home specifically
    if (path === '/') return currentPath === '/';

    // Handle categorized shop links (Streetwear / Techwear)
    if (path.includes('category=')) {
      const categoryParam = path.split('?')[1];
      return currentPath === '/shop' && currentSearch.includes(categoryParam);
    }

    // Handle generic Shop link (active if on /shop but NO category is selected)
    if (path === '/shop') {
      return currentPath === '/shop' && !currentSearch.includes('category=');
    }

    return currentPath === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass border-b border-white/5' : 'py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-heading font-black tracking-tighter flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg group-hover:bg-[#00ffcc] transition-colors">
            <span className="text-black text-xs font-black">N</span>
          </div>
          <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">NEO-THREAD</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors ${isLinkActive(link.path) ? 'text-[#00ffcc]' : 'text-white/60 hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* 
            Search button and togglable input logic removed here. 
            The layout remains balanced with the remaining actions.
          */}
          
          <Link to="/wishlist" className="relative group">
            <Heart size={20} className="text-white/60 group-hover:text-red-500 transition-colors" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative group">
            <ShoppingCart size={20} className="text-white/60 group-hover:text-[#00ffcc] transition-colors" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ffcc] text-black text-[10px] flex items-center justify-center rounded-full font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
          <Link to={isAuthenticated ? "/profile" : "/auth"} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <User size={20} className="text-white/80" />
          </Link>
          
          <button 
            className="md:hidden p-2 text-white/60"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-heading font-bold transition-colors ${isLinkActive(link.path) ? 'text-[#00ffcc]' : 'text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
