
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cyber-Knit V1',
    description: 'Ultra-breathable techwear knit with integrated LED fiber optics.',
    price: 129.99,
    category: 'Techwear',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800',
    colors: ['#000000', '#ffffff', '#00ffcc'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    isNew: true,
    isPopular: true,
    reviews: []
  },
  {
    id: '2',
    name: 'Neon Streets Oversized',
    description: 'Heavyweight cotton hoodie with reflective cyberpunk patterns.',
    price: 89.99,
    category: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    colors: ['#1a1a1a', '#4a00e0', '#8e2de2'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.5,
    isPopular: true,
    reviews: []
  },
  {
    id: '3',
    name: 'Prism Utility Jacket',
    description: 'Weatherproof shell with iridescent finish and modular pockets.',
    price: 249.99,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    colors: ['#2c3e50', '#7f8c8d'],
    sizes: ['S', 'M', 'L'],
    rating: 4.9,
    isNew: true,
    reviews: []
  },
  {
    id: '4',
    name: 'Void Runner Cargo',
    description: 'Tapered fit cargo pants with magnetic buckles and water resistance.',
    price: 159.99,
    category: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    colors: ['#050505'],
    sizes: ['28', '30', '32', '34'],
    rating: 4.7,
    reviews: []
  },
  {
    id: '5',
    name: 'Aura Silk Dress',
    description: 'Fluid silk dress with reactive dye that changes shade with movement.',
    price: 199.99,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1539109132374-348058a130a0?auto=format&fit=crop&q=80&w=800',
    colors: ['#ff99cc', '#cc99ff'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.9,
    isNew: true,
    reviews: []
  },
  {
    id: '6',
    name: 'Quantum Sneakers',
    description: 'Gravity-defying cushioning with auto-lacing technology.',
    price: 299.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    colors: ['#ffffff', '#000000'],
    sizes: ['7', '8', '9', '10', '11'],
    rating: 5.0,
    isPopular: true,
    reviews: []
  }
];

export const CATEGORIES = ['Men', 'Women', 'Streetwear', 'Accessories', 'Techwear'];
