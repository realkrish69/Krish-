
import React from 'react';
import { useApp } from '../store/AppContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { products, wishlist } = useApp();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-5xl font-heading font-black mb-6 flex items-center gap-4">
            <Heart className="text-red-500" fill="currentColor" size={40} /> 
            MY WISHLIST
          </h1>
          <p className="text-white/40">Your curated collection of future threads.</p>
        </header>

        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-24 glass border border-white/5 rounded-3xl">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={48} className="text-white/10" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4">No favorites yet.</h2>
            <p className="text-white/40 mb-12">Start adding items to your wishlist from the shop.</p>
            <Link to="/shop" className="px-10 py-4 bg-[#00ffcc] text-black font-black rounded-full hover:bg-white transition-all">
              EXPLORE COLLECTIONS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
