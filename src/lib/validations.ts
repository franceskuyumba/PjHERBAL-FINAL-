import { z } from "zod";

export const phoneRegex = /^(\+?[0-9]{9,15})$/;

export const registerSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(80),
  email: z.string().email("Please enter a valid email address").max(120),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters").max(64),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export const addressSchema = z.object({
  label: z.string().min(1).max(40).optional(),
  recipientName: z.string().min(2, "Recipient name is required"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
  street: z.string().min(3, "Street / address is required"),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name").max(80),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  region: z.string().min(1, "Please select a region"),
  district: z.string().min(1, "Please enter your district"),
  address: z.string().min(3, "Please enter your delivery address"),
  notes: z.string().max(500).optional(),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and dashes"),
  categoryId: z.string().min(1),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().nonnegative().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  status: z.string().min(1),
  shortDescription: z.string().min(10).max(200),
  description: z.string().min(20),
  ingredients: z.string().optional(),
  usage: z.string().optional(),
  benefits: z.string().optional(),
  precautions: z.string().optional(),
  isBestSeller: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
});

export const couponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(30)
    .transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().positive(),
  minOrder: z.coerce.number().nonnegative().default(0),
  maxDiscount: z.coerce.number().nonnegative().optional().nullable(),
  maxUses: z.coerce.number().int().positive().optional().nullable(),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const blogSchema = z.object({
  title: z.string().min(5).max(160),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(20).max(300),
  content: z.string().min(50),
  coverImage: z.string().min(1),
  category: z.string().min(1).max(60),
  author: z.string().min(2).max(80),
  authorRole: z.string().max(80).optional().nullable(),
  isPublished: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  seoTitle: z.string().max(160).optional().nullable(),
  seoDescription: z.string().max(300).optional().nullable(),
  readingTime: z.coerce.number().int().min(1).max(60).optional(),
  scheduledFor: z.string().datetime().optional().nullable(),
});

const financeDocumentItemSchema = z.object({
  description: z.string().min(2, "Please enter an item description").max(200),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().nonnegative("Unit price cannot be negative"),
});

export const financeDocumentSchema = z.object({
  type: z.enum(["RECEIPT", "INVOICE"]),
  category: z.enum(["EXTERNAL", "INTERNAL"]),
  title: z.string().max(160).optional().nullable(),
  partyName: z.string().min(2, "Please enter the party name").max(120),
  partyPhone: z.string().max(40).optional().nullable(),
  partyEmail: z.string().max(120).optional().nullable(),
  orderNumber: z.string().max(40).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  discount: z.coerce.number().nonnegative("Discount cannot be negative").default(0),
  tax: z.coerce.number().nonnegative("Tax cannot be negative").default(0),
  status: z.enum(["DRAFT", "ISSUED", "PAID", "CANCELLED"]).default("ISSUED"),
  issueDate: z.coerce.date({ invalid_type_error: "Please enter a valid issue date" }),
  dueDate: z.coerce.date({ invalid_type_error: "Please enter a valid due date" }).optional().nullable(),
  items: z.array(financeDocumentItemSchema).min(1, "Add at least one item"),
});
