import { z } from 'zod';

const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(25)
  .regex(/^\+?[\d\s().-]+$/)
  .refine((value) => value.replace(/\D/g, '').length >= 7 && value.replace(/\D/g, '').length <= 15);

const emailSchema = z.string().trim().email().max(254);

export const reservationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  email: emailSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^(0[8-9]|1[0-9]):00$/),
  guests: z.coerce.number().int().min(1).max(12),
  message: z.string().trim().max(2000).optional().default(''),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(5000),
});

export const reviewSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(3000),
});

export const orderSchema = z
  .object({
    customerName: z.string().trim().min(2).max(120),
    phone: phoneSchema,
    email: emailSchema.optional().or(z.literal('')),
    type: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY']),
    paymentMethod: z.enum(['PAY_AT_CAFE', 'CASH_ON_DELIVERY']),
    deliveryAddress: z.string().trim().max(1000).optional().default(''),
    notes: z.string().trim().max(2000).optional().default(''),
    items: z
      .array(
        z.object({
          menuItemId: z.string().min(1).max(30),
          quantity: z.coerce.number().int().min(1).max(20),
        })
      )
      .min(1)
      .max(30),
  })
  .refine((order) => order.type === 'DELIVERY' || !order.deliveryAddress, {
    path: ['deliveryAddress'],
    message: 'A delivery address is only accepted for delivery orders.',
  })
  .refine((order) => order.type !== 'DELIVERY' || order.deliveryAddress.length >= 5, {
    path: ['deliveryAddress'],
    message: 'Enter a delivery address.',
  })
  .refine((order) => order.type === 'DELIVERY' || order.paymentMethod === 'PAY_AT_CAFE', {
    path: ['paymentMethod'],
    message: 'Cash on delivery is only available for delivery orders.',
  })
  .refine(
    (order) => new Set(order.items.map((item) => item.menuItemId)).size === order.items.length,
    { path: ['items'], message: 'Each menu item can only appear once in the order.' }
  );

export function formatValidationError(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}
