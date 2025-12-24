
export type Category = 'Men' | 'Women' | 'Streetwear' | 'Accessories' | 'Techwear';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviews: Review[];
  isNew?: boolean;
  isPopular?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  comment: string;
  rating: number;
  date: string;
  media?: { type: 'image' | 'video'; url: string }[];
  comments: ReviewComment[];
  likes: number;
  likedBy: string[]; // User IDs who liked this review
}

export interface ReviewComment {
  id: string;
  userName: string;
  text: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  profileImage: string;
  wishlist: string[]; // Product IDs
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

export interface AppState {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  wishlist: string[];
  isAuthenticated: boolean;
}