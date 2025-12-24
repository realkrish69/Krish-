
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const { products } = useApp();
  const location = useLocation();
  
  // Memoize query params to avoid unnecessary re-renders
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  const initialCategory = queryParams.get('category');
  const initialSearch = queryParams.get('q') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('Newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Synchronize internal state with URL parameter changes (fixes Header navigation)
  useEffect(() => {
    const q = queryParams.get('q');
    const cat = queryParams.get('category');
    
    // Update category from URL. If category is null in URL, it resets to 'All'
    setCategory(cat);
    
    // Update search if present in URL
    if (q !== null) {
      setSearch(q);
    }
  }, [queryParams]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? p.category === category : true;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Popularity') return b.rating - a.rating;
      return 0; // Default newest
    });
  }, [products, search, category, priceRange, sortBy]);

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClearFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling that could trigger parent toggle behaviors
    setCategory(null);
    setPriceRange([0, 1000]);
    setSearch('');
    // Explicitly maintain isFilterOpen state as per user request
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          {/* Active category state reflected visually in the title */}
          <h1 className="text-5xl font-heading font-black mb-6 uppercase tracking-tight">
            {category ? `${category} Drop` : 'ALL COLLECTIONS'}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <form onSubmit={handleSearchFormSubmit} className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input 
                type="text" 
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-[#00ffcc] transition-colors font-medium"
              />
            </form>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-6 py-4 rounded-full border transition-all ${isFilterOpen ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
              >
                <SlidersHorizontal size={18} /> Filters
              </button>
              
              <div className="relative group flex-1 md:flex-none">
                <button className="w-full md:w-48 flex items-center justify-between gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all font-bold text-sm">
                  {sortBy} <ChevronDown size={18} />
                </button>
                <div className="absolute top-full right-0 w-full mt-2 glass border border-white/10 rounded-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-20 overflow-hidden">
                  {['Newest', 'Popularity', 'Price: Low to High', 'Price: High to Low'].map(option => (
                    <button 
                      key={option}
                      onClick={() => setSortBy(option)}
                      className="w-full text-left px-6 py-3 text-sm hover:text-[#00ffcc] hover:bg-white/5 transition-colors font-medium"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="p-8 glass rounded-3xl border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#00ffcc] mb-6">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setCategory(null)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${!category ? 'bg-[#00ffcc] text-black border-[#00ffcc]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                      >
                        All
                      </button>
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${category === cat ? 'bg-[#00ffcc] text-black border-[#00ffcc]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#00ffcc] mb-6">Price Range</h4>
                    <div className="space-y-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full accent-[#00ffcc]"
                      />
                      <div className="flex justify-between text-xs font-bold text-white/50">
                        <span>$0</span>
                        <span>Up to ${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end">
                    <button 
                      onClick={handleClearFilters}
                      className="text-xs font-bold text-red-500 uppercase tracking-widest hover:underline flex items-center gap-2 w-fit"
                    >
                      <X size={14} /> Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="mb-12">
          <p className="text-white/40 text-sm mb-8">Showing {filteredProducts.length} results</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 glass border border-white/5 rounded-3xl">
              <h3 className="text-2xl font-heading font-bold mb-4">No glitches found.</h3>
              <p className="text-white/40 mb-8">Try adjusting your filters to find your future look.</p>
              <button 
                onClick={handleClearFilters}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
