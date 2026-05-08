import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/'];

// Role-based route patterns
const ROLE_ROUTES: Record<string, RegExp> = {
  SUPER_ADMIN: /^\/dashboard\/admin/,
  WORKSHOP_ADMIN: /^\/dashboard\/workshop/,
  MASTER: /^\/dashboard\/master/,
  DRIVER: /^\/dashboard\/driver/,
  STORE_OWNER: /^\/dashboard\/shop/,
};

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Allow public routes and Next.js internals
    if (
        PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Check for authentication token
    const token = request.cookies.get('access_token')?.value;
    const userRole = request.cookies.get('user_role')?.value;

    if (!token && pathname.startsWith('/dashboard')) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based access control
    if (token && userRole && pathname.startsWith('/dashboard')) {
        const rolePattern = ROLE_ROUTES[userRole];
        if (rolePattern && !rolePattern.test(pathname)) {
            // Redirect to role's dashboard
            const defaultPath = {
              SUPER_ADMIN: '/dashboard/admin',
              WORKSHOP_ADMIN: '/dashboard/workshop',
              MASTER: '/dashboard/master',
              DRIVER: '/dashboard/driver',
              STORE_OWNER: '/dashboard/shop',
            }[userRole] || '/dashboard';
            return NextResponse.redirect(new URL(defaultPath, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
