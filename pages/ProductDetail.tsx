
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Heart, Star, ShieldCheck, Truck, RotateCcw, 
  Plus, MessageSquare, ChevronLeft, ChevronRight, X, Image as ImageIcon, Video, Send, 
  Package, Info, Flame, ArrowRight
} from 'lucide-react';
import { Review, ReviewComment } from '../types';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, addReview, addReviewComment, toggleReviewLike, user } = useApp();
  const product = products.find(p => p.id === id);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [enlargedMedia, setEnlargedMedia] = useState<{ type: 'image' | 'video'; url: string } | null>(null);
  
  // Review Form State
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMedia, setReviewMedia] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Reply State
  const [replyText, setReplyText] = useState('');

  // Gallery images (mock additional images if missing)
  const images = product ? [
    product.image,
    `https://picsum.photos/800/1000?random=${product.id}1`,
    `https://picsum.photos/800/1000?random=${product.id}2`,
    `https://picsum.photos/800/1000?random=${product.id}3`,
  ] : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="pt-40 text-center min-h-screen bg-[#050505]">
        <h2 className="text-2xl font-heading font-bold mb-4 text-[#00ffcc]">Glitch in the matrix: Product not found.</h2>
        <Link to="/shop" className="text-white/50 hover:text-white underline">Back to Collections</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0]);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0]);
    navigate('/checkout');
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const submitReview = () => {
    if (!reviewText.trim() || isSubmittingReview) return;
    
    setIsSubmittingReview(true);
    
    const newReview: Review = {
      id: 'rev-' + Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest-' + Math.random().toString(36).substr(2, 4),
      userName: user?.name || 'Anonymous Rebel',
      userImage: user?.profileImage || `https://picsum.photos/100?random=${Math.random()}`,
      comment: reviewText,
      rating: reviewRating,
      date: new Date().toISOString(),
      media: reviewMedia,
      comments: [],
      likes: 0,
      likedBy: []
    };

    addReview(product.id, newReview);
    
    // Reset form
    setReviewText('');
    setReviewRating(5);
    setReviewMedia([]);
    setIsWritingReview(false);
    setIsSubmittingReview(false);
  };

  const submitReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    const newComment: ReviewComment = {
      id: 'com-' + Math.random().toString(36).substr(2, 9),
      userName: user?.name || 'Anonymous Rebel',
      text: replyText,
      date: new Date().toISOString(),
    };

    addReviewComment(product.id, reviewId, newComment);
    setReplyText('');
    setReplyingTo(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const type: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image';
      const url = URL.createObjectURL(file);
      setReviewMedia(prev => [...prev, { type, url }]);
    });
  };

  const handleHelpfulClick = (reviewId: string) => {
    const userId = user?.id || 'guest-session';
    toggleReviewLike(product.id, reviewId, userId);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#050505]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
          {/* Image Gallery with Swipe/Controls */}
          <div className="space-y-6 lg:sticky lg:top-32">
            <div className="relative group aspect-[4/5] rounded-[2rem] overflow-hidden glass border border-white/10 touch-pan-y">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) handlePrevImage();
                    else if (info.offset.x < -100) handleNextImage();
                  }}
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

              {/* Arrow Controls */}
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 backdrop-blur-md rounded-full text-white/80 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 backdrop-blur-md rounded-full text-white/80 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight size={24} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`h-1 rounded-full transition-all ${i === currentImageIndex ? 'w-8 bg-[#00ffcc]' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentImageIndex(i)}
                  className={`aspect-square rounded-2xl overflow-hidden glass border transition-all ${i === currentImageIndex ? 'border-[#00ffcc] scale-95' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                >
                   <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info & Integrated Sections */}
          <div className="flex flex-col space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                 <span className="text-[#00ffcc] text-xs font-bold uppercase tracking-[0.2em] bg-[#00ffcc]/10 px-3 py-1 rounded-full">
                   {product.category}
                 </span>
                 <div className="flex items-center gap-1 text-yellow-500 bg-white/5 px-3 py-1 rounded-full">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold">{product.rating}</span>
                 </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-heading font-black mb-4 leading-none">{product.name}</h1>
              <p className="text-3xl font-heading font-bold text-[#00ffcc]">${product.price}</p>
            </div>
            
            <p className="text-white/50 leading-relaxed text-lg max-w-xl">
              {product.description} Engineered for the urban nomad, featuring our patented reactive thermal weave and modular kinetic structure.
            </p>

            {/* Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Color Protocol</h4>
                <div className="flex gap-4">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-[#00ffcc] scale-110 shadow-[0_0_15px_rgba(0,255,204,0.3)]' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Fit Matrix (Size)</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 rounded-xl border font-bold text-xs transition-all ${selectedSize === size ? 'bg-[#00ffcc] text-black border-[#00ffcc]' : 'glass border-white/10 hover:border-white/30'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Matrix */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleBuyNow}
                className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-[#00ffcc] transition-all flex items-center justify-center gap-2 group text-lg"
              >
                BUY NOW <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 py-5 glass border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag size={20} /> ADD TO CART
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`p-5 rounded-2xl border transition-all ${isWishlisted ? 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'glass border-white/10 hover:border-white/30'}`}
                >
                  <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Integrated Trust & Info Sections */}
            <div className="space-y-6 pt-10 border-t border-white/5">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 text-center p-4 glass border border-white/5 rounded-2xl">
                   <ShieldCheck size={20} className="text-[#00ffcc]" />
                   <span className="text-[9px] font-bold uppercase tracking-tighter text-white/40">SECURE PAY</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center p-4 glass border border-white/5 rounded-2xl">
                   <Truck size={20} className="text-[#00ffcc]" />
                   <span className="text-[9px] font-bold uppercase tracking-tighter text-white/40">GLOBAL FAST</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center p-4 glass border border-white/5 rounded-2xl">
                   <RotateCcw size={20} className="text-[#00ffcc]" />
                   <span className="text-[9px] font-bold uppercase tracking-tighter text-white/40">EASY RETURN</span>
                </div>
              </div>

              {/* Detailed Sections */}
              <div className="space-y-4">
                <div className="p-6 glass border border-white/5 rounded-3xl">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-4 text-[#00ffcc]">
                    <Info size={16} /> CORE DETAILS
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Designed for maximum mobility in urban environments. Integrated moisture-wicking tech and stealth pockets for high-value gear.
                  </p>
                </div>

                <div className="p-6 glass border border-white/5 rounded-3xl">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-4 text-[#00ffcc]">
                    <Flame size={16} /> MATERIAL TECH
                  </h3>
                  <ul className="text-white/40 text-xs space-y-2 list-disc list-inside">
                    <li>80% Bio-Polymer Mesh</li>
                    <li>Graphene-Infused Coating</li>
                    <li>Silver-Thread Antimicrobial Lining</li>
                    <li>Reflective Nano-Inks</li>
                  </ul>
                </div>

                <div className="p-6 glass border border-white/5 rounded-3xl">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-4 text-[#00ffcc]">
                    <Package size={16} /> LOGISTICS
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">
                    Standard delivery (3-5 cycles). Hyper-express available in Neo-Tokyo, Sector 4, and London Hub. Recyclable vacuum-sealed packaging.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standalone Review Section (Bottom) */}
        <section className="border-t border-white/5 pt-16 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
               <h2 className="text-4xl font-heading font-black mb-2">COMMUNITY INTEL</h2>
               <p className="text-white/40">Real-time feedback from the collective.</p>
             </div>
             <button 
              onClick={() => setIsWritingReview(true)}
              className="flex items-center gap-2 px-8 py-4 bg-[#00ffcc] text-black rounded-full hover:bg-white transition-all text-xs font-bold uppercase tracking-widest"
             >
               <Plus size={18} /> WRITE REVIEW
             </button>
          </div>

          {/* Write Review Modal/Form */}
          <AnimatePresence>
            {isWritingReview && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6"
              >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsWritingReview(false)}></div>
                <div className="relative w-full max-w-2xl glass border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-[0_0_100px_rgba(0,255,204,0.1)]">
                  <button onClick={() => setIsWritingReview(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                  
                  <h3 className="text-3xl font-heading font-black mb-8">LOG INTEL</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button 
                            key={star} 
                            onClick={() => setReviewRating(star)}
                            className={`p-2 transition-all ${reviewRating >= star ? 'text-yellow-500 scale-110' : 'text-white/10'}`}
                          >
                            <Star size={24} fill={reviewRating >= star ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Intel Data (Comment)</label>
                      <textarea 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Transmission details..."
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-[#00ffcc] transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Attach Visuals</label>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-xs font-bold"
                        >
                          <ImageIcon size={18} /> GALLERY
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          multiple 
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                        />
                      </div>
                      
                      {reviewMedia.length > 0 && (
                        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                          {reviewMedia.map((m, i) => (
                            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden glass border border-white/10 shrink-0">
                               {m.type === 'image' ? (
                                 <img src={m.url} className="w-full h-full object-cover" alt="preview" />
                               ) : (
                                 <video src={m.url} className="w-full h-full object-cover" />
                               )}
                               <button 
                                onClick={() => setReviewMedia(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white/50 hover:text-white"
                               >
                                 <X size={12} />
                               </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={submitReview}
                      disabled={isSubmittingReview}
                      className="w-full py-5 bg-[#00ffcc] text-black font-black rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'LOGGING...' : 'TRANSMIT INTEL'} <Send size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Media Enlarged View Modal */}
          <AnimatePresence>
            {enlargedMedia && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12"
              >
                <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setEnlargedMedia(null)}></div>
                <div className="relative w-full max-w-5xl h-full flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto w-full h-full flex items-center justify-center">
                    {enlargedMedia.type === 'image' ? (
                      <motion.img 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={enlargedMedia.url} 
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10" 
                        alt="Enlarged review" 
                      />
                    ) : (
                      <motion.video 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={enlargedMedia.url} 
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10" 
                        controls 
                        autoPlay 
                      />
                    )}
                  </div>
                  <button 
                    onClick={() => setEnlargedMedia(null)} 
                    className="absolute top-0 right-0 p-4 text-white/60 hover:text-white transition-colors pointer-events-auto"
                  >
                    <X size={32} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-12 mb-24">
            {(product.reviews || []).map(review => {
              const isLiked = review.likedBy?.includes(user?.id || 'guest-session');
              return (
                <div key={review.id} className="glass border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffcc]/5 blur-[60px] rounded-full"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full border-2 border-[#00ffcc]/20 p-1">
                        <img src={review.userImage || `https://picsum.photos/100?random=${review.id}`} className="w-full h-full rounded-full object-cover" alt="user" />
                      </div>
                      <div>
                        <p className="text-xl font-heading font-bold">{review.userName}</p>
                        <div className="flex text-yellow-500 gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={review.rating > i ? "currentColor" : "none"} stroke={review.rating > i ? "none" : "currentColor"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-white/20 text-xs font-bold uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</span>
                  </div>

                  <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-3xl">
                    {review.comment}
                  </p>

                  {review.media && review.media.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-10">
                       {review.media.map((m, i) => (
                         <div 
                           key={i} 
                           onClick={() => setEnlargedMedia(m)}
                           className="relative w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden glass border border-white/5 group/media cursor-zoom-in"
                         >
                            {m.type === 'image' ? (
                              <img src={m.url} className="w-full h-full object-cover opacity-60 group-hover/media:opacity-100 transition-opacity" alt="review visual" />
                            ) : (
                              <div className="relative w-full h-full">
                                <video src={m.url} className="w-full h-full object-cover opacity-60 group-hover/media:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white/80 group-hover/media:text-[#00ffcc] transition-colors">
                                  <Video size={32} />
                                </div>
                              </div>
                            )}
                         </div>
                       ))}
                    </div>
                  )}

                  <div className="flex items-center gap-8 pt-8 border-t border-white/5">
                    <button 
                      onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${replyingTo === review.id ? 'text-[#00ffcc]' : 'text-white/30 hover:text-white'}`}
                    >
                       <MessageSquare size={16} /> {replyingTo === review.id ? 'CANCEL REPLY' : 'REPLY'}
                    </button>
                    <button 
                      onClick={() => handleHelpfulClick(review.id)}
                      className={`flex items-center gap-2 text-xs font-bold transition-colors uppercase tracking-widest ${isLiked ? 'text-red-500' : 'text-white/30 hover:text-white'}`}
                    >
                       <Heart size={16} fill={isLiked ? "currentColor" : "none"} /> Helpful ({review.likes || 0})
                    </button>
                  </div>

                  {/* Reply Form */}
                  <AnimatePresence>
                    {replyingTo === review.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-8 overflow-hidden"
                      >
                        <div className="flex flex-col gap-4">
                           <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Add your transmission..."
                            className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[#00ffcc] transition-colors resize-none"
                           />
                           <div className="flex justify-end">
                             <button 
                              onClick={() => submitReply(review.id)}
                              className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-[#00ffcc] transition-all text-[10px] uppercase tracking-widest"
                             >
                               TRANSMIT REPLY
                             </button>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Existing Comments/Replies */}
                  {review.comments && review.comments.length > 0 && (
                    <div className="mt-8 space-y-4 ml-8 border-l-2 border-white/5 pl-8">
                       {review.comments.map(comment => (
                         <div key={comment.id} className="p-4 bg-white/5 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                               <p className="text-sm font-bold text-[#00ffcc]">{comment.userName}</p>
                               <span className="text-[10px] text-white/20">{new Date(comment.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-white/60 text-sm">{comment.text}</p>
                         </div>
                       ))}
                    </div>
                  )}
                </div>
              );
            })}

            {(product.reviews || []).length === 0 && (
              <div className="text-center py-24 glass border border-white/5 rounded-[3rem]">
                 <MessageSquare size={48} className="mx-auto mb-6 text-white/10" />
                 <h3 className="text-xl font-heading font-bold mb-2">No transmissions logged.</h3>
                 <p className="text-white/30">Be the first to provide intel on this drop.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
