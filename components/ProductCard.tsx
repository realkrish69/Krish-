
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../store/AppContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  return (
    <motion.div
      layout
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden glass transition-colors duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        </Link>
        
        {product.isNew && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-[#00ffcc] text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
            New Arrival
          </span>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button
            onClick={handleWishlistClick}
            className={`p-3 rounded-full glass transition-colors duration-200 ${isWishlisted ? 'text-red-500 bg-red-500/10' : 'hover:bg-white/10'}`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleCartClick}
            className="p-3 rounded-full glass hover:bg-[#00ffcc] hover:text-black transition-all"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center gap-1 text-[#00ffcc] text-xs">
            <span className="font-bold">★</span>
            <span>{product.rating}</span>
          </div>
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-heading font-bold mb-1 group-hover:text-[#00ffcc] transition-colors">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold font-heading text-white">${product.price}</span>
          <Link 
            to={`/product/${product.id}`} 
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
          >
            Details <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
