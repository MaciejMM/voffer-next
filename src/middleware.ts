import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {NextResponse} from 'next/server';

export default async function middleware(req: Request) {

    const {isAuthenticated} = getKindeServerSession();

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    return withAuth(req);
}

export const config = {

};
