/**
 * Global TypeScript Types for FFDH
 */

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  images?: string[]
  category?: string
  stock?: number
  isSoldOut?: boolean
  isLimited?: boolean
}

export interface CartItem {
  id: string
  variantId: string
  name: string
  priceEUR: number
  quantity: number
  image?: string
}

// Scene/Emotional Content Types
export interface Scene {
  _id: string
  slug: string
  title: string
  description: string
  narrative: string
  image: string
  emotionTags: EmotionTag[]
  commentCount?: number
  viewCount?: number
  createdAt: string
  updatedAt: string
}

export type EmotionTag = 'joy' | 'sadness' | 'anger' | 'love' | 'fear' | 'surprise' | 'peace' | 'nostalgia'

// Character Types
export interface Character {
  _id: string
  slug: string
  name: string
  description: string
  avatar: string
  type: string
  traits: string[]
  emotionTags: EmotionTag[]
}

// Drop/Collection Types
export interface Drop {
  _id: string
  slug: string
  name: string
  description: string
  startDate: string
  endDate: string
  products: Product[]
  image: string
  isActive: boolean
}

// User Types
export interface UserProfile {
  id: string
  email: string
  username?: string
  avatar?: string
  bio?: string
  observerMode: boolean
  createdAt: string
  updatedAt: string
}

// Order Types
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'completed' | 'shipped' | 'delivered' | 'cancelled'
  stripeSessionId?: string
  printfulOrderId?: string
  createdAt: string
  updatedAt: string
}

// Payment Types
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  method: 'stripe' | 'paypal'
  createdAt: string
}

// Comment Types
export interface Comment {
  id: string
  sceneId: string
  userId?: string
  text: string
  emotion?: EmotionTag
  approved: boolean
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Sanity Types
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}
