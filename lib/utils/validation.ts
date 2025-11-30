import { z } from 'zod';

// ============================================
// ORDER VALIDATION
// ============================================

export const orderItemSchema = z.object({
  wrapId: z.string().min(1, 'Wrap selection is required'),
  wrapName: z.string(),
  basePrice: z.number().positive(),
  ingredients: z.array(z.object({
    id: z.string(),
    name: z.string(),
    priceAdd: z.number(),
  })).max(10, 'Maximum 10 ingredients allowed'),
  addOns: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  })),
  quantity: z.number().int().positive().max(20, 'Maximum 20 items per order'),
  itemTotal: z.number().positive(),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().positive(),
  tax: z.number().nonnegative(),
  total: z.number().positive(),
});

// ============================================
// RESERVATION VALIDATION
// ============================================

export const reservationSchema = z.object({
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  userEmail: z.string().email('Invalid email address'),
  userPhone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  partySize: z.number().int().min(1, 'At least 1 person required').max(20, 'Maximum party size is 20'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

// ============================================
// USER PROFILE VALIDATION
// ============================================

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2, 'State must be 2 characters').optional(),
    zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits').optional(),
  }).optional(),
});

// ============================================
// AUTH VALIDATION
// ============================================

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
