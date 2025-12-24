
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, placeOrder } = useApp();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (subtotal > 500 ? 0 : 25);

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="pt-40 text-center">
        <h2 className="text-3xl font-heading font-bold mb-6">Checkout is empty.</h2>
        <Link to="/shop" className="text-[#00ffcc] font-bold hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    placeOrder();
    navigate('/profile');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-heading font-black mb-12">SECURE CHECKOUT</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-8">
            <div className="glass border border-white/5 rounded-3xl p-8">
              <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-[#00ffcc]" /> PAYMENT METHOD
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-[#00ffcc] bg-[#00ffcc]/5 rounded-2xl flex items-center justify-between">
                  <span className="font-bold">Neural-Pay (Mock)</span>
                  <CheckCircle2 size={20} className="text-[#00ffcc]" />
                </div>
                <div className="p-4 border border-white/10 glass rounded-2xl flex items-center opacity-40">
                  <span className="font-bold">Crypto Transfer</span>
                </div>
              </div>
            </div>

            <div className="glass border border-white/5 rounded-3xl p-8">
              <h3 className="text-xl font-heading font-bold mb-6">SHIPPING PROTOCOL</h3>
              <div className="space-y-4 text-white/60">
                <p>Delivery to standard Geo-Coordinates</p>
                <div className="flex items-center gap-2 text-xs font-bold text-[#00ffcc]">
                  <ShieldCheck size={14} /> ENCRYPTED CONNECTION ACTIVE
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass border border-[#00ffcc]/20 rounded-3xl p-8 h-fit">
            <h3 className="text-xl font-heading font-bold mb-8">ORDER TOTAL</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-white/60">
                <span>Items Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span>{subtotal > 500 ? 'FREE' : '$25.00'}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between text-2xl font-heading font-bold">
                <span>Total</span>
                <span className="text-[#00ffcc]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-[#00ffcc] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
            >
              {isProcessing ? 'AUTHORIZING...' : 'AUTHORIZE PAYMENT'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
