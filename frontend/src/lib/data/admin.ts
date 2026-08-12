import type { Order, OrderStatus } from "@/lib/types";

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  location: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  lowStock: boolean;
  status: "active" | "draft" | "archived";
  sales: number;
  revenue: number;
}

export const adminOrders: Order[] = [
  {
    id: "o1",
    orderNumber: "AP-483920",
    customer: { name: "Juma Mwakideu", phone: "0712345678", email: "juma@example.com" },
    delivery: { address: "Plot 12, Mikocheni", region: "Dar es Salaam", district: "Kinondoni" },
    items: [
      { productId: "p1", title: "Vital Man Herbal Capsules", price: 45000, quantity: 2, image: "" },
      { productId: "p3", title: "ImmunoGuard Vitamin C & Zinc", price: 25000, quantity: 1, image: "" },
    ],
    subtotal: 115000,
    shipping: 0,
    discount: 0,
    total: 115000,
    paymentMethod: "mpesa",
    paymentRef: "SEL-88312",
    status: "dispatched",
    createdAt: "2026-07-28T09:24:00.000Z",
    history: [
      { status: "pending", at: "2026-07-28T09:24:00.000Z" },
      { status: "paid", at: "2026-07-28T09:25:00.000Z" },
      { status: "processing", at: "2026-07-28T10:02:00.000Z" },
      { status: "dispatched", at: "2026-07-29T08:15:00.000Z" },
    ],
  },
  {
    id: "o2",
    orderNumber: "AP-483921",
    customer: { name: "Zainabu Omar", phone: "0754555123", email: "zainab@example.com" },
    delivery: { address: "Mabatini", region: "Mwanza", district: "Ilemela" },
    items: [
      { productId: "p2", title: "GlucoTrim Weight Loss Capsules", price: 50000, quantity: 1, image: "" },
    ],
    subtotal: 50000,
    shipping: 6000,
    discount: 0,
    total: 56000,
    paymentMethod: "tigo-pesa",
    paymentRef: "TIG-99145",
    status: "paid",
    createdAt: "2026-07-29T13:10:00.000Z",
    history: [
      { status: "pending", at: "2026-07-29T13:10:00.000Z" },
      { status: "paid", at: "2026-07-29T13:11:00.000Z" },
    ],
  },
  {
    id: "o3",
    orderNumber: "AP-483922",
    customer: { name: "Grace Mushi", phone: "0762456890", email: "grace@example.com" },
    delivery: { address: "Njiro", region: "Arusha", district: "Arusha City" },
    items: [
      { productId: "p4", title: "Royal Women Collagen + Glow", price: 48000, quantity: 1, image: "" },
      { productId: "p9", title: "MenoBalance Women 40+", price: 52000, quantity: 1, image: "" },
    ],
    subtotal: 100000,
    shipping: 6000,
    discount: 10000,
    total: 96000,
    paymentMethod: "mpesa",
    paymentRef: "SEL-88344",
    status: "delivered",
    createdAt: "2026-07-26T10:45:00.000Z",
    history: [
      { status: "pending", at: "2026-07-26T10:45:00.000Z" },
      { status: "paid", at: "2026-07-26T10:46:00.000Z" },
      { status: "processing", at: "2026-07-26T12:00:00.000Z" },
      { status: "dispatched", at: "2026-07-27T09:00:00.000Z" },
      { status: "delivered", at: "2026-07-28T14:30:00.000Z" },
    ],
  },
  {
    id: "o4",
    orderNumber: "AP-483923",
    customer: { name: "Hassan Ramadhani", phone: "0789555012", email: "hassan@example.com" },
    delivery: { address: "Chumbageni", region: "Tanga", district: "Tanga City" },
    items: [
      { productId: "p8", title: "Omega 3 Fish Oil 1000mg", price: 40000, quantity: 2, image: "" },
    ],
    subtotal: 80000,
    shipping: 7000,
    discount: 0,
    total: 87000,
    paymentMethod: "airtel-money",
    paymentRef: "AIR-55720",
    status: "pending",
    createdAt: "2026-07-30T08:05:00.000Z",
    history: [{ status: "pending", at: "2026-07-30T08:05:00.000Z" }],
  },
  {
    id: "o5",
    orderNumber: "AP-483924",
    customer: { name: "Peter Ngowi", phone: "0733661109", email: "peter@example.com" },
    delivery: { address: "Iringa Road", region: "Mbeya", district: "Mbeya City" },
    items: [
      { productId: "p6", title: "DetoxPro Gentle Cleansing Formula", price: 35000, quantity: 1, image: "" },
      { productId: "p3", title: "ImmunoGuard Vitamin C & Zinc", price: 25000, quantity: 1, image: "" },
    ],
    subtotal: 60000,
    shipping: 7000,
    discount: 0,
    total: 67000,
    paymentMethod: "crdb",
    paymentRef: "CRDB-10442",
    status: "processing",
    createdAt: "2026-07-29T16:20:00.000Z",
    history: [
      { status: "pending", at: "2026-07-29T16:20:00.000Z" },
      { status: "paid", at: "2026-07-29T16:21:00.000Z" },
      { status: "processing", at: "2026-07-30T09:00:00.000Z" },
    ],
  },
  {
    id: "o6",
    orderNumber: "AP-483925",
    customer: { name: "Neema Rutaihwa", phone: "0744552789", email: "neema@example.com" },
    delivery: { address: "Makumbusho", region: "Dodoma", district: "Dodoma City" },
    items: [
      { productId: "p5", title: "MindZen Nootropic Brain Boost", price: 55000, quantity: 1, image: "" },
    ],
    subtotal: 55000,
    shipping: 6000,
    discount: 5500,
    total: 55500,
    paymentMethod: "nmb",
    paymentRef: "NMB-88210",
    status: "cancelled",
    createdAt: "2026-07-27T11:30:00.000Z",
    history: [
      { status: "pending", at: "2026-07-27T11:30:00.000Z" },
      { status: "paid", at: "2026-07-27T11:31:00.000Z" },
      { status: "cancelled", at: "2026-07-27T15:00:00.000Z" },
    ],
  },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "c1", name: "Juma Mwakideu", phone: "0712345678", email: "juma@example.com", orders: 6, spent: 480000, joined: "2026-01-12", location: "Dar es Salaam" },
  { id: "c2", name: "Zainabu Omar", phone: "0754555123", email: "zainab@example.com", orders: 4, spent: 310000, joined: "2026-02-03", location: "Mwanza" },
  { id: "c3", name: "Grace Mushi", phone: "0762456890", email: "grace@example.com", orders: 3, spent: 255000, joined: "2026-03-15", location: "Arusha" },
  { id: "c4", name: "Hassan Ramadhani", phone: "0789555012", email: "hassan@example.com", orders: 5, spent: 390000, joined: "2026-01-28", location: "Tanga" },
  { id: "c5", name: "Peter Ngowi", phone: "0733661109", email: "peter@example.com", orders: 2, spent: 142000, joined: "2026-04-02", location: "Mbeya" },
  { id: "c6", name: "Neema Rutaihwa", phone: "0744552789", email: "neema@example.com", orders: 1, spent: 55500, joined: "2026-05-20", location: "Dodoma" },
  { id: "c7", name: "Baraka Tibaigana", phone: "0790123456", email: "baraka@example.com", orders: 7, spent: 640000, joined: "2025-12-10", location: "Dar es Salaam" },
  { id: "c8", name: "Amina Haji", phone: "0771234567", email: "amina@example.com", orders: 3, spent: 187000, joined: "2026-03-08", location: "Zanzibar" },
];

export const adminProducts: AdminProduct[] = [
  { id: "p1", title: "Vital Man Herbal Capsules", category: "mens-health", price: 45000, stock: 86, lowStock: false, status: "active", sales: 214, revenue: 9630000 },
  { id: "p2", title: "GlucoTrim Weight Loss Capsules", category: "weight-management", price: 50000, stock: 54, lowStock: false, status: "active", sales: 189, revenue: 9450000 },
  { id: "p3", title: "ImmunoGuard Vitamin C & Zinc", category: "energy-immunity", price: 25000, stock: 120, lowStock: false, status: "active", sales: 342, revenue: 8550000 },
  { id: "p4", title: "Royal Women Collagen + Glow", category: "womens-wellness", price: 48000, stock: 42, lowStock: false, status: "active", sales: 156, revenue: 7488000 },
  { id: "p5", title: "MindZen Nootropic Brain Boost", category: "brain-focus", price: 55000, stock: 12, lowStock: true, status: "active", sales: 98, revenue: 5390000 },
  { id: "p6", title: "DetoxPro Gentle Cleansing Formula", category: "detox-digestion", price: 35000, stock: 65, lowStock: false, status: "active", sales: 77, revenue: 2695000 },
  { id: "p7", title: "Power Protein Mass Gainer", category: "mens-health", price: 90000, stock: 8, lowStock: true, status: "active", sales: 121, revenue: 10890000 },
  { id: "p8", title: "Omega 3 Fish Oil 1000mg", category: "energy-immunity", price: 40000, stock: 90, lowStock: false, status: "active", sales: 203, revenue: 8120000 },
  { id: "p9", title: "MenoBalance Women 40+", category: "womens-wellness", price: 52000, stock: 37, lowStock: false, status: "active", sales: 88, revenue: 4576000 },
  { id: "p10", title: "SleepWell Melatonin Softgels", category: "brain-focus", price: 30000, stock: 73, lowStock: false, status: "draft", sales: 132, revenue: 3960000 },
];

export const monthlyRevenue = [
  { month: "Feb", revenue: 8.2, orders: 180 },
  { month: "Mar", revenue: 10.4, orders: 220 },
  { month: "Apr", revenue: 9.8, orders: 205 },
  { month: "May", revenue: 12.1, orders: 260 },
  { month: "Jun", revenue: 14.6, orders: 310 },
  { month: "Jul", revenue: 16.3, orders: 345 },
  { month: "Aug", revenue: 18.9, orders: 402 },
];

export const trafficSources = [
  { source: "WhatsApp", pct: 42, color: "#25D366" },
  { source: "Direct", pct: 24, color: "#2d965e" },
  { source: "Facebook / Instagram", pct: 18, color: "#d9a83d" },
  { source: "Google Search", pct: 11, color: "#1f7a4b" },
  { source: "TikTok", pct: 5, color: "#0a2418" },
];

export const salesByCategory = [
  { name: "Men's Health", value: 26, color: "#2d965e" },
  { name: "Weight Management", value: 22, color: "#d9a83d" },
  { name: "Energy & Immunity", value: 20, color: "#4fb27b" },
  { name: "Women's Wellness", value: 14, color: "#e2c064" },
  { name: "Brain & Focus", value: 10, color: "#1f7a4b" },
  { name: "Detox & Digestion", value: 8, color: "#83cfa3" },
];

export const whatsappCampaigns = [
  { id: "w1", name: "New Year Health Reset", audience: "All customers", sent: 4800, delivered: 4621, replies: 612, conversions: 143, status: "sent" },
  { id: "w2", name: "Weight Loss Special", audience: "Weight category buyers", sent: 2100, delivered: 2010, replies: 388, conversions: 96, status: "sent" },
  { id: "w3", name: "Abandoned Cart Recovery", audience: "Cart abandoners (24h)", sent: 342, delivered: 331, replies: 88, conversions: 41, status: "active" },
  { id: "w4", name: "Winter Immunity Boost", audience: "Dar es Salaam customers", sent: 0, delivered: 0, replies: 0, conversions: 0, status: "draft" },
];

export const orderStatusMeta: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: { label: "Pending", className: "bg-gold-100 text-gold-700" },
  paid: { label: "Paid", className: "bg-brand-100 text-brand-700" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700" },
  dispatched: { label: "Dispatched", className: "bg-violet-100 text-violet-700" },
  delivered: { label: "Delivered", className: "bg-brand-900 text-brand-50" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export function formatTZS(amount: number): string {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMillions(millions: number): string {
  return `${millions.toFixed(1)}M`;
}
