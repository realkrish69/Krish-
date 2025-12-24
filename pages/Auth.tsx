
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Smartphone, ArrowRight, CheckCircle2, Mail, MailQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  // Auth Steps: 1 (Initial Method Select), 2 (Email Input), 3 (Phone Required), 4 (OTP Verification)
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | 'email'>('phone');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInitialAction = () => {
    if (authMethod === 'phone') {
      if (phone.length < 5) return;
      setStep(4); // Straight to OTP
    }
  };

  const handleGoogleAuth = async () => {
    setIsVerifying(true);
    // Simulate Google OAuth Delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
    setAuthMethod('google');
    setStep(3); // Phone Required step
  };

  const handleEmailAuthStart = () => {
    setAuthMethod('email');
    setStep(2); // Email Input step
  };

  const handleEmailNext = () => {
    if (email.includes('@') && password.length > 5) {
      setStep(3); // Phone Required step
    }
  };

  const handlePhoneSubmit = () => {
    if (phone.length > 5) {
      setStep(4); // Final OTP step
    }
  };

  const handleAuthorize = () => {
    // Finalizing login with the verified phone number
    const mockEmail = authMethod === 'email' ? email : (authMethod === 'google' ? 'google.user@gmail.com' : undefined);
    const mockName = authMethod === 'google' ? 'Google User' : (authMethod === 'email' ? 'Email Nomad' : undefined);
    
    login(phone, mockEmail, mockName);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto glass border border-white/5 rounded-[40px] overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-[#00ffcc]/10 text-[#00ffcc] rounded-3xl flex items-center justify-center mx-auto mb-8">
               <Shield size={40} />
            </div>
            
            <h1 className="text-4xl font-heading font-black mb-4 uppercase">Access Protocol</h1>
            <p className="text-white/40 mb-12">Initialize your connection to the Neo-Thread ecosystem.</p>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 px-8 py-6 bg-white/5 border border-white/10 rounded-3xl focus-within:border-[#00ffcc] transition-colors">
                        <Smartphone size={24} className="text-white/20" />
                        <input 
                          type="tel" 
                          placeholder="ENTER PHONE NUMBER" 
                          className="bg-transparent focus:outline-none w-full text-xl font-bold tracking-widest placeholder:text-white/10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    
                    <button 
                      onClick={handleInitialAction}
                      disabled={phone.length < 5}
                      className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-[#00ffcc] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      REQUEST ACCESS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-xs uppercase tracking-[0.3em] text-white/20"><span className="bg-[#0a0a0a] px-4">OR CONTINUE WITH</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleGoogleAuth}
                      disabled={isVerifying}
                      className="flex items-center justify-center gap-3 py-4 glass border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                      {isVerifying ? (
                        <div className="w-4 h-4 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      Google
                    </button>
                    <button 
                      onClick={handleEmailAuthStart}
                      className="flex items-center justify-center gap-3 py-4 glass border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                      <Mail size={16} className="text-white/40" />
                      Email
                    </button>
                  </div>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Phone number required for account activation</p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus-within:border-[#00ffcc] transition-colors">
                        <Mail size={20} className="text-white/20" />
                        <input 
                          type="email" 
                          placeholder="COM-LINK (EMAIL)" 
                          className="bg-transparent focus:outline-none w-full font-bold placeholder:text-white/10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus-within:border-[#00ffcc] transition-colors">
                        <Shield size={20} className="text-white/20" />
                        <input 
                          type="password" 
                          placeholder="ACCESS KEY (PASSWORD)" 
                          className="bg-transparent focus:outline-none w-full font-bold placeholder:text-white/10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                  </div>
                  <button 
                    onClick={handleEmailNext}
                    disabled={!email || password.length < 6}
                    className="w-full py-5 bg-white text-black font-black rounded-3xl hover:bg-[#00ffcc] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    CONTINUE <ArrowRight size={20} />
                  </button>
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-white/30 uppercase hover:text-white transition-colors">Back to methods</button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="space-y-6"
                >
                   <div className="p-6 bg-[#00ffcc]/5 border border-[#00ffcc]/20 rounded-3xl mb-4">
                     <p className="text-[#00ffcc] text-xs font-bold uppercase tracking-widest mb-1">MANDATORY LINK</p>
                     <p className="text-white/60 text-sm">A verified phone number is required to activate your neo-account.</p>
                   </div>
                   <div className="flex items-center gap-4 px-8 py-6 bg-white/5 border border-white/10 rounded-3xl focus-within:border-[#00ffcc] transition-colors">
                      <Smartphone size={24} className="text-white/20" />
                      <input 
                        type="tel" 
                        placeholder="ENTER PHONE NUMBER" 
                        className="bg-transparent focus:outline-none w-full text-xl font-bold tracking-widest placeholder:text-white/10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                   </div>
                   <button 
                    onClick={handlePhoneSubmit}
                    disabled={phone.length < 5}
                    className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-[#00ffcc] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    LINK PHONE <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="space-y-8"
                >
                   <div className="flex justify-center gap-4">
                     {[1, 2, 3, 4].map(i => (
                       <input 
                         key={i}
                         type="text" 
                         maxLength={1}
                         placeholder="•"
                         className="w-16 h-20 bg-white/5 border border-white/10 rounded-2xl text-center text-3xl font-black focus:outline-none focus:border-[#00ffcc] transition-colors placeholder:text-white/10"
                       />
                     ))}
                   </div>
                   <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Enter the 4-digit code sent to {phone}</p>
                   <button 
                    onClick={handleAuthorize}
                    className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-[#00ffcc] transition-all flex items-center justify-center gap-2 group"
                  >
                    AUTHORIZE CONNECTION <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-white/30 uppercase hover:text-white transition-colors">Cancel</button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8 flex justify-center gap-8 border-t border-white/5 mt-8">
               <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                 <CheckCircle2 size={12} className="text-[#00ffcc]" /> Encrypted
               </div>
               <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                 <CheckCircle2 size={12} className="text-[#00ffcc]" /> Verified
               </div>
               <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                 <CheckCircle2 size={12} className="text-[#00ffcc]" /> 2FA Active
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
