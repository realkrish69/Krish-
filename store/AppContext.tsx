
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, Review, ReviewComment } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  isAuthenticated: boolean;
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  login: (phone: string, email?: string, name?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearCart: () => void;
  placeOrder: () => void;
  addReview: (productId: string, review: Review) => void;
  addReviewComment: (productId: string, reviewId: string, comment: ReviewComment) => void;
  toggleReviewLike: (productId: string, reviewId: string, userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('neo_products');
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('neo_user');
    const storedCart = localStorage.getItem('neo_cart');
    const storedWishlist = localStorage.getItem('neo_wishlist');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('neo_cart', JSON.stringify(cart));
    localStorage.setItem('neo_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('neo_products', JSON.stringify(products));
    if (user) localStorage.setItem('neo_user', JSON.stringify(user));
    else localStorage.removeItem('neo_user');
  }, [cart, wishlist, user, products]);

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
      ? prev.filter(id => id !== productId) 
      : [...prev, productId]
    );
  };

  const login = (phone: string, email?: string, name?: string) => {
    const mockUser: User = {
      id: 'u-' + Math.random().toString(36).substr(2, 5),
      name: name || 'Cyber Nomad',
      phone,
      email: email || 'nomad@future.io',
      address: 'Sector 7, Neo-Tokyo Dist. B',
      profileImage: `https://picsum.photos/200?random=${Math.random()}`,
      wishlist: [],
      orders: []
    };
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('neo_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) setUser({ ...user, ...userData });
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    if (!user || cart.length === 0) return;
    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Pending'
    };
    setUser({ ...user, orders: [newOrder, ...user.orders] });
    clearCart();
  };

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [review, ...(p.reviews || [])];
        return { ...p, reviews: updatedReviews };
      }
      return p;
    }));
  };

  const addReviewComment = (productId: string, reviewId: string, comment: ReviewComment) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviews: (p.reviews || []).map(r => {
            if (r.id === reviewId) {
              return { ...r, comments: [...(r.comments || []), comment] };
            }
            return r;
          })
        };
      }
      return p;
    }));
  };

  const toggleReviewLike = (productId: string, reviewId: string, userId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviews: (p.reviews || []).map(r => {
            if (r.id === reviewId) {
              const likedBy = r.likedBy || [];
              const isLiked = likedBy.includes(userId);
              return {
                ...r,
                likedBy: isLiked ? likedBy.filter(id => id !== userId) : [...likedBy, userId],
                likes: isLiked ? Math.max(0, (r.likes || 1) - 1) : (r.likes || 0) + 1
              };
            }
            return r;
          })
        };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      products, cart, wishlist, user, isAuthenticated,
      addToCart, removeFromCart, updateCartQuantity, toggleWishlist,
      login, logout, updateUser, clearCart, placeOrder, addReview, addReviewComment, toggleReviewLike
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
