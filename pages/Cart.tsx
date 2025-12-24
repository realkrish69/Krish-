
import React from 'react';
import { useApp } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, placeOrder } = useApp();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-heading font-black mb-12">SHOPPING CORE</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 glass border border-white/5 rounded-3xl">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={48} className="text-white/20" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4">Your core is empty.</h2>
            <p className="text-white/40 mb-12">Future threads are waiting for you in the shop.</p>
            <Link to="/shop" className="px-10 py-4 bg-[#00ffcc] text-black font-black rounded-full hover:bg-white transition-all">
              GO TO SHOP
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 glass border border-white/5 rounded-3xl"
                  >
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                        <h3 className="text-xl font-heading font-bold">{item.name}</h3>
                        <p className="text-xl font-heading font-bold">${item.price}</p>
                      </div>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-6">
                        <span className="text-xs font-bold px-3 py-1 bg-white/5 rounded-full text-white/40">SIZE: {item.selectedSize}</span>
                        <span className="text-xs font-bold px-3 py-1 bg-white/5 rounded-full text-white/40 uppercase">COLOR: {item.selectedColor}</span>
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-between">
                        <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-2">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="text-white/40 hover:text-[#00ffcc] transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="text-white/40 hover:text-[#00ffcc] transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/20 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="p-8 glass border border-[#00ffcc]/20 rounded-3xl sticky top-32">
                <h3 className="text-2xl font-heading font-bold mb-8">ORDER SUMMARY</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Tax (Estimated)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between text-xl font-heading font-bold">
                    <span>Total</span>
                    <span className="text-[#00ffcc]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block w-full">
                  <button className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-[#00ffcc] transition-all flex items-center justify-center gap-2 group">
                    PROCEED TO CHECKOUT <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                
                <p className="text-[10px] text-center text-white/20 mt-6 uppercase tracking-widest leading-relaxed">
                  Encryption active. Secure checkout via decentral-gateway.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
