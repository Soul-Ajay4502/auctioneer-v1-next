// middleware.ts
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const isAuthenticated = request.cookies.get('auth_session')?.value

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && request.nextUrl.pathname === '/sign-up') {
        return NextResponse.redirect(new URL('/app', request.url))
    }
    if (isAuthenticated && request.nextUrl.pathname === '/sign-in') {
        return NextResponse.redirect(new URL('/app', request.url))
    }
    if (isAuthenticated && request.nextUrl.pathname === '/verify-otp') {
        return NextResponse.redirect(new URL('/app', request.url))
    }

    // Redirect unauthenticated users trying to access protected routes
    if (!isAuthenticated && request.nextUrl.pathname.startsWith('/app')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/app/:path*', // This will match all dashboard routes including /app/chat
        '/sign-in',
        '/sign-up',
        '/verify-otp',
    ],
}
