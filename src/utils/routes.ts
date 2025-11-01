/**
 * FFDH Typed Routes
 * Centralized route definitions with type safety
 */

export const routes = {
  // Main routes
  home: '/',
  about: '/about',
  contact: '/contact',
  
  // Rewir AI routes
  rewir: '/rewir',
  rewirScene: (sceneId: string) => `/rewir/${sceneId}`,
  
  // Shop routes
  shop: '/shop',
  product: (slug: string) => `/product/${slug}`,
  
  // Checkout flow
  checkout: '/checkout',
  success: '/success',
  cart: '/shop/cart',

  privacy: '/privacy',
  terms: '/terms',
  
  // Admin routes (future)
  admin: '/admin',
} as const

export type RoutePath = typeof routes[keyof typeof routes] | string

/**
 * Navigation helper to ensure type-safe navigation
 */
export function getRewirSceneUrl(sceneId: string): string {
  return `/rewir/${sceneId}`
}

export function getProductUrl(slug: string): string {
  return `/product/${slug}`
}

/**
 * Route metadata for SEO and sitemap generation
 */
export const routeMetadata = {
  home: {
    title: 'Fruits From Da Hood | Premium Streetwear',
    description: 'Discover premium streetwear inspired by urban culture and fruit characters',
  },
  rewir: {
    title: 'Rewir | Emotional AI Scenes',
    description: 'Explore emotional scenes from the streets. AI-generated narratives exploring urban culture and feelings.',
  },
  shop: {
    title: 'Shop | Fruits From Da Hood',
    description: 'Browse our collection of premium streetwear and accessories',
  },
  checkout: {
    title: 'Checkout | Fruits From Da Hood',
    description: 'Complete your order',
  },
} as const

/**
 * Static routes for sitemap generation
 */
export const staticRoutes: Array<{ path: string; priority: number; changefreq: string }> = [
  { path: routes.home, priority: 1.0, changefreq: 'daily' },
  { path: routes.rewir, priority: 0.9, changefreq: 'weekly' },
  { path: routes.shop, priority: 0.9, changefreq: 'weekly' },
  { path: routes.about, priority: 0.5, changefreq: 'monthly' },
  { path: routes.contact, priority: 0.4, changefreq: 'monthly' },
  { path: routes.privacy, priority: 0.3, changefreq: 'yearly' },
  { path: routes.terms, priority: 0.3, changefreq: 'yearly' },
]

/**
 * Validate if a route exists
 */
export function isValidRoute(path: string): boolean {
  return (
    path === routes.home ||
    path === routes.rewir ||
    path === routes.shop ||
    path === routes.checkout ||
    path === routes.success ||
    path.startsWith('/rewir/') ||
    path.startsWith('/product/') ||
    path === routes.about ||
    path === routes.contact ||
    path === routes.privacy ||
    path === routes.terms
  )
}

/**
 * Get route name from path
 */
export function getRouteName(path: string): string {
  if (path === routes.home) return 'Home'
  if (path === routes.rewir) return 'Rewir'
  if (path.startsWith('/rewir/')) return 'Rewir Scene'
  if (path === routes.shop) return 'Shop'
  if (path.startsWith('/product/')) return 'Product'
  if (path === routes.checkout) return 'Checkout'
  if (path === routes.success) return 'Success'
  if (path === routes.about) return 'About'
  if (path === routes.contact) return 'Contact'
  if (path === routes.privacy) return 'Privacy'
  if (path === routes.terms) return 'Terms'
  return 'Unknown'
}

