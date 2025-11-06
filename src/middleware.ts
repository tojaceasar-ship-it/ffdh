import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Middleware for FFDH
 * Handles:
 * - Route protection (NextAuth compatible)
 * - Request logging
 * - CORS headers
 * - Security headers
 */

// Routes that require authentication
const protectedRoutes = ['/profile', '/orders', '/wishlist', '/admin']

// Routes that should redirect if already authenticated
const authRoutes = ['/auth/login', '/auth/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get NextAuth session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Log request
  console.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`)

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url))
  }

  // Redirect to home if accessing auth route with auth
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Create response
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  return response
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
