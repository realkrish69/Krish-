
import React, { useState, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { motion } from 'framer-motion';
import { User, Package, Heart, LogOut, Edit2, Settings, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, logout, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states to ensure syncing
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || ''
  });

  if (!isAuthenticated || !user) return <Navigate to="/auth" />;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    updateUser(formData);
    alert('Profile updated in the local database.');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-8 glass border border-white/5 rounded-3xl text-center">
              <div className="relative inline-block mb-6">
                <img src={user.profileImage} alt={user.name} className="w-32 h-32 rounded-full border-4 border-[#00ffcc]/20 p-1 object-cover" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#00ffcc] text-black rounded-full hover:bg-white transition-all shadow-lg"
                >
                   <Edit2 size={16} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-1">{user.name}</h2>
              <p className="text-[#00ffcc] text-[10px] font-bold uppercase tracking-widest mb-8 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> Verified Member
              </p>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'orders' ? 'bg-[#00ffcc] text-black' : 'hover:bg-white/5 text-white/60'}`}
                >
                  <Package size={18} /> My Orders
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'settings' ? 'bg-[#00ffcc] text-black' : 'hover:bg-white/5 text-white/60'}`}
                >
                  <Settings size={18} /> Settings
                </button>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all font-bold text-sm mt-4"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="p-8 glass border border-white/5 rounded-3xl min-h-[600px]">
              {activeTab === 'orders' && (
                <div>
                   <h3 className="text-3xl font-heading font-black mb-12 uppercase tracking-tighter">Order Archive</h3>
                   {user.orders.length === 0 ? (
                     <div className="text-center py-24 text-white/20">
                        <Package size={64} className="mx-auto mb-4 opacity-10" />
                        <p className="text-lg">No orders found in the database.</p>
                     </div>
                   ) : (
                     <div className="space-y-6">
                        {user.orders.map(order => (
                          <div key={order.id} className="p-6 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                             <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                               <div>
                                 <p className="text-xs font-bold text-[#00ffcc] uppercase tracking-widest mb-1">{order.id}</p>
                                 <p className="text-sm text-white/40">{new Date(order.date).toLocaleDateString()}</p>
                               </div>
                               <div className="text-right">
                                 <p className="text-xl font-heading font-bold">${order.total.toFixed(2)}</p>
                                 <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold rounded-full uppercase">{order.status}</span>
                               </div>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-2xl">
                   <h3 className="text-3xl font-heading font-black mb-12 uppercase tracking-tighter">Account Protocol</h3>
                   
                   <div className="mb-10 p-6 bg-[#00ffcc]/5 border border-[#00ffcc]/20 rounded-3xl">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00ffcc] mb-4">Security Verification</h4>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Phone size={20} className="text-[#00ffcc]" />
                            <div>
                               <p className="text-sm font-bold">{user.phone}</p>
                               <p className="text-[10px] text-white/30 uppercase">Primary Verification Device</p>
                            </div>
                         </div>
                         <span className="px-3 py-1 bg-[#00ffcc] text-black text-[9px] font-black rounded-full uppercase">Verified</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Identity Marker (Name)</label>
                        <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                           <User size={18} className="text-white/20" />
                           <input 
                            type="text" 
                            name="name"
                            value={formData.name} 
                            onChange={handleInputChange}
                            className="bg-transparent focus:outline-none w-full" 
                           />
                        </div>
                      </div>
                      <div className="space-y-2 opacity-50 cursor-not-allowed">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Phone Frequency (Locked)</label>
                        <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/20 rounded-2xl">
                           <Phone size={18} className="text-white/10" />
                           <input 
                            type="text" 
                            disabled
                            value={user.phone} 
                            className="bg-transparent focus:outline-none w-full cursor-not-allowed" 
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Com-Link (Email)</label>
                        <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                           <Mail size={18} className="text-white/20" />
                           <input 
                            type="text" 
                            name="email"
                            value={formData.email} 
                            onChange={handleInputChange}
                            className="bg-transparent focus:outline-none w-full" 
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Geo-Coords (Address)</label>
                        <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                           <MapPin size={18} className="text-white/20" />
                           <input 
                            type="text" 
                            name="address"
                            value={formData.address} 
                            onChange={handleInputChange}
                            className="bg-transparent focus:outline-none w-full" 
                           />
                        </div>
                      </div>
                   </div>
                   <button 
                    onClick={handleSaveProfile}
                    className="px-10 py-5 bg-white text-black font-black rounded-full hover:bg-[#00ffcc] transition-all uppercase tracking-widest text-xs"
                   >
                      Update Identity
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
