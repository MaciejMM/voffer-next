import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {NextRequest, NextResponse} from 'next/server';

interface KindeValue {
    value: KindeRole[];
}

interface KindeRole {
    id: string;
    key: string;
    name: string;
}

export default async function middleware(req: NextRequest) {
    const {isAuthenticated, getUser, getClaim} = getKindeServerSession();

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    // Check if the route starts with /admin
    if (req.nextUrl.pathname.startsWith('/dashboard/admin')) {
        const rolesClaim = await getClaim('roles');
        const roles = rolesClaim as unknown as KindeValue;
        
        // If user doesn't have ADMIN role, redirect to not-found page
        if (!roles.value?.some(role => role.key !== 'ADMIN')) {
            return NextResponse.redirect(new URL('/not-found', req.url));
        }
    }

    return withAuth(req);
}

// Configure which routes to run middleware on
export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*']
}
