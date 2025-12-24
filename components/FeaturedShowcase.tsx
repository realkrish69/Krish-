
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../store/AppContext';
import { Link } from 'react-router-dom';

interface FeaturedShowcaseProps {
  products: Product[];
}

const FeaturedShowcase: React.FC<FeaturedShowcaseProps> = ({ products }) => {
  const { addToCart } = useApp();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    })
  };

  const product = products[index];

  return (
    <div 
      className="relative w-full h-[540px] rounded-[2.5rem] overflow-hidden glass border border-white/10 group/slider select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={product.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Parallax Hint */}
          <div className="absolute inset-0">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-[5s] ease-linear scale-100 group-hover/slider:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="px-4 py-2 bg-[#00ffcc] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,255,204,0.4)]">
                Exclusive Drop
              </span>
              <div className="glass p-3 rounded-2xl border border-white/20">
                <ShoppingBag 
                  size={20} 
                  className="text-white cursor-pointer hover:text-[#00ffcc] transition-colors"
                  onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                />
              </div>
            </div>

            <div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#00ffcc] text-xs font-bold uppercase tracking-[0.3em] mb-3"
              >
                {product.category} Collection
              </motion.p>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-heading font-black text-white mb-6 leading-none"
              >
                {product.name}
              </motion.h3>
              
              <div className="flex items-center gap-6">
                <Link 
                  to={`/product/${product.id}`}
                  className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-[#00ffcc] transition-all flex items-center gap-2 group/btn text-sm"
                >
                  VIEW DROP <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <span className="text-2xl font-heading font-bold text-white/80">${product.price}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Controls */}
      <div className="absolute bottom-10 right-10 flex gap-3 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
        >
          <ArrowRight size={18} className="rotate-180" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
        <motion.div 
          className="h-full bg-[#00ffcc]"
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "0%" : "100%" }}
          key={index + (isHovered ? "-paused" : "-running")}
          transition={{ duration: isHovered ? 0 : 5, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default FeaturedShowcase;
