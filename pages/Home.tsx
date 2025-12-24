
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../store/AppContext';
import ProductCard from '../components/ProductCard';
import FeaturedShowcase from '../components/FeaturedShowcase';
import { ArrowRight, Sparkles, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Home = () => {
  const { products } = useApp();
  // Get 2 products for the grid and others for the showcase
  const staticFeatured = products.filter(p => p.isPopular).slice(0, 2);
  const showcaseProducts = products.filter(p => p.isPopular).slice(2, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* 3D Hero Object Removed Here */}
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[#00ffcc] text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <Sparkles size={14} /> New Season Collection
              </span>
              <h1 className="text-6xl md:text-8xl font-heading font-black mb-6 leading-[0.9] tracking-tighter">
                WEAR THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] via-white to-[#4a00e0]">FUTURE</span>
              </h1>
              <p className="text-lg text-white/50 mb-10 max-w-lg leading-relaxed">
                Elevate your presence with neo-futuristic threads designed for the digital nomad. Ultra-premium materials, tech-infused fabrics, and timeless aesthetics.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-[#00ffcc] transition-all flex items-center gap-2 group">
                  EXPLORE SHOP <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/shop?category=Techwear" className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-all">
                  VIEW COLLECTIONS
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent"></div>
        </motion.div>
      </section>

      {/* Stats / Features */}
      <section className="py-24 border-y border-white/5 glass">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-[#00ffcc]">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-heading font-bold mb-2">Global Shipping</h3>
            <p className="text-white/40 text-sm">Next-day delivery to major cyberpunk hubs worldwide.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-[#00ffcc]">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-heading font-bold mb-2">Smart Fabrics</h3>
            <p className="text-white/40 text-sm">Materials that react to your environment and heart rate.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-[#00ffcc]">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-heading font-bold mb-2">Exclusive Drops</h3>
            <p className="text-white/40 text-sm">NFT-backed garments with guaranteed authenticity.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-5xl font-heading font-black mb-4 uppercase tracking-tight">FEATURED DROPS</h2>
              <p className="text-white/40 text-lg">Handpicked selections from our latest season curated for the elite.</p>
            </div>
            <Link to="/shop" className="text-[#00ffcc] font-bold text-sm tracking-widest uppercase hover:underline flex items-center gap-2">
              View All Arrivals <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left side: Static Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              {staticFeatured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Right side: Animated Showcase Slider */}
            <div className="lg:col-span-5">
              <FeaturedShowcase products={showcaseProducts} />
              <div className="mt-8 p-8 glass border border-white/5 rounded-3xl">
                <h4 className="text-[#00ffcc] text-[10px] font-black uppercase tracking-widest mb-2">Next Gen Tech</h4>
                <p className="text-white/40 text-sm leading-relaxed">
                  Our showcase cycles through limited availability items. These drops are updated in real-time based on global inventory sensors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-4xl font-heading font-black mb-16 uppercase">SHOP BY CORE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/shop?category=Men" className="relative h-[500px] group overflow-hidden rounded-3xl">
              <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" alt="Men" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <h3 className="text-3xl font-heading font-bold text-white mb-2 uppercase">NEO-MEN</h3>
                <span className="text-white/60 font-bold uppercase tracking-widest text-xs">Explore 42 Items</span>
              </div>
            </Link>
            <div className="grid grid-rows-2 gap-6">
              <Link to="/shop?category=Women" className="relative group overflow-hidden rounded-3xl">
                <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" alt="Women" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-heading font-bold text-white uppercase">NEO-WOMEN</h3>
                </div>
              </Link>
              <Link to="/shop?category=Techwear" className="relative group overflow-hidden rounded-3xl">
                <img src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" alt="Techwear" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-heading font-bold text-white uppercase">TECH-COUTS</h3>
                </div>
              </Link>
            </div>
            <Link to="/shop?category=Streetwear" className="relative h-[500px] group overflow-hidden rounded-3xl">
              <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" alt="Streetwear" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <h3 className="text-3xl font-heading font-bold text-white mb-2 uppercase">STREET-X</h3>
                <span className="text-white/60 font-bold uppercase tracking-widest text-xs">Explore 128 Items</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#4a00e0]/10 -z-10 blur-3xl rounded-full translate-y-1/2"></div>
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-5xl font-heading font-black mb-6 uppercase">JOIN THE ECOSYSTEM</h2>
          <p className="text-white/50 text-lg mb-12">Get early access to exclusive drops and neo-fashion updates. Join 50k+ fashion futurists.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="ENTER YOUR COM-LINK (EMAIL)" 
              className="flex-1 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ffcc] transition-colors font-bold uppercase"
            />
            <button className="px-10 py-4 bg-white text-black font-black rounded-full hover:bg-[#00ffcc] transition-all whitespace-nowrap uppercase">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
             <Link to="/" className="text-3xl font-heading font-black mb-4 inline-block uppercase tracking-tighter">NEO-THREAD</Link>
             <p className="text-white/40 max-w-xs">Building the aesthetic of the 22nd century, today.</p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#00ffcc]">Support</h4>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">FAQ</a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Shipping</a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Returns</a>
            </div>
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#00ffcc]">Social</h4>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Instagram</a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Twitter</a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Discord</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-24 pt-12 border-t border-white/5 text-center text-white/20 text-[10px] uppercase tracking-widest font-bold">
          © 2025 NEO-THREAD CORP. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default Home;
