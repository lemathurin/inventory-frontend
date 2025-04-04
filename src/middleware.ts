import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that don't require authentication
const publicPaths = ['/', '/login', '/signup']
const protectedApiPaths = ['/api/']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  // Allow access to public paths even without a token
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if the request is to a protected API endpoint
  const isProtectedApi = protectedApiPaths.some(apiPath => pathname.startsWith(apiPath))

  // If it's a protected API endpoint and no token, return 401
  if (isProtectedApi && !token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    // Add a redirect parameter to the login URL
    if (!publicPaths.includes(pathname)) {
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // If there's a token, allow the request
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 