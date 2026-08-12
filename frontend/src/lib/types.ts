export interface Category {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  image: string;
  icon: string;
}

export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortBenefits: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  bestSeller: boolean;
  featured: boolean;
  inStock: boolean;
  stock: number;
  tags: string[];
  ingredients: string[];
  usage: string[];
  benefits: string[];
  warnings: string[];
  reviews: ProductReview[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  content: { heading: string; body: string; list?: string[] }[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  product?: string;
  verified: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  delivery: {
    address: string;
    region: string;
    district: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentRef?: string;
  status: OrderStatus;
  createdAt: string;
  history: { status: OrderStatus; at: string }[];
}

export interface Coupon {
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  minOrder: number;
  active: boolean;
  expiresAt?: string;
}

export interface Region {
  name: string;
  districts: string[];
  deliveryFee: number;
  eta: string;
}
