
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './store/AppContext';
import Header from './components/Header';
import CustomCursor from './components/CustomCursor';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';

/**
 * PageTransition component wraps routes to provide animation on navigation.
 */
const PageTransition: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#050505] text-white">
          <CustomCursor />
          <Header />
          <main>
            <Suspense fallback={
              <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
                <div className="w-16 h-16 border-4 border-[#00ffcc] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <AppRoutes />
            </Suspense>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
