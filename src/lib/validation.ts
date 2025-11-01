import { z } from 'zod'

// User validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  age: z.number().min(16, 'Must be at least 16 years old').max(120, 'Invalid age'),
})

// Product validation schemas
export const productSchema = z.object({
  id: z.string().min(1, 'Product ID required'),
  name: z.string().min(1, 'Product name required').max(200, 'Product name too long'),
  priceEUR: z.number().positive('Price must be positive'),
  description: z.string().max(1000, 'Description too long').optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  isLimited: z.boolean().optional(),
  isSoldOut: z.boolean().optional(),
})

// Cart validation schemas
export const cartItemSchema = z.object({
  id: z.string().min(1, 'Item ID required'),
  variantId: z.string().min(1, 'Variant ID required'),
  name: z.string().min(1, 'Item name required'),
  priceEUR: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  image: z.string().url('Invalid image URL').optional(),
})

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  total: z.number().min(0, 'Total cannot be negative'),
  itemCount: z.number().int().min(0, 'Item count cannot be negative'),
})

// Checkout validation schemas
export const shippingAddressSchema = z.object({
  name: z.string().min(2, 'Name required').max(100, 'Name too long'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  address: z.string().min(5, 'Address required').max(200, 'Address too long'),
  city: z.string().min(2, 'City required').max(100, 'City too long'),
  postalCode: z.string().min(3, 'Postal code required').max(20, 'Postal code too long'),
  country: z.string().length(2, 'Country code must be 2 characters'),
})

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'At least one item required'),
  shipping: shippingAddressSchema,
  total: z.number().positive('Total must be positive'),
  paymentMethod: z.enum(['stripe', 'paypal']).optional(),
})

// Order validation schemas
export const orderSchema = z.object({
  id: z.string().min(1, 'Order ID required'),
  userId: z.string().min(1, 'User ID required'),
  items: z.array(cartItemSchema),
  shipping: shippingAddressSchema,
  total: z.number().positive('Total must be positive'),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
  stripeSessionId: z.string().optional(),
  printfulOrderId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// API request validation schemas
export const createCheckoutSessionSchema = z.object({
  items: z.array(z.object({
    variantId: z.string().min(1, 'Variant ID required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  })).min(1, 'At least one item required'),
  shipping: shippingAddressSchema,
  successUrl: z.string().url('Invalid success URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
})

// Comment validation schemas
export const commentSchema = z.object({
  content: z.string()
    .min(2, 'Comment must be at least 2 characters')
    .max(500, 'Comment must not exceed 500 characters'),
  authorId: z.string().min(1, 'Author ID required'),
  authorName: z.string().min(2, 'Author name required'),
  parentId: z.string().optional(),
})

// Webhook validation schemas
export const stripeWebhookSchema = z.object({
  id: z.string(),
  object: z.string(),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
  created: z.number(),
})

export const printfulWebhookSchema = z.object({
  type: z.string(),
  created: z.number(),
  data: z.any(),
})

// Utility validation functions
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  errors: z.ZodError['errors']
} {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error.errors }
}

export function validateApiRequest<T>(
  schema: z.ZodSchema<T>,
  request: Request
): Promise<{
  success: true
  data: T
} | {
  success: false
  errors: z.ZodError['errors']
}> {
  return request.json()
    .then(data => validateData(schema, data))
    .catch(() => ({
      success: false as const,
      errors: [{ 
        message: 'Invalid JSON', 
        path: [] as z.ZodIssue['path'],
        code: 'custom' as z.ZodIssueCode,
      }] as z.ZodError['errors'],
    }))
}

// Type exports
export type User = z.infer<typeof userSchema>
export type Product = z.infer<typeof productSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = z.infer<typeof cartSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type CheckoutData = z.infer<typeof checkoutSchema>
export type Order = z.infer<typeof orderSchema>
export type CreateCheckoutSessionRequest = z.infer<typeof createCheckoutSessionSchema>
export type Comment = z.infer<typeof commentSchema>
