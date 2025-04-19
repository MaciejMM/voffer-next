"use client";
import {KindeProvider} from "@kinde-oss/kinde-auth-nextjs";
import {ReactNode, useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import {refreshTranseuAccessToken} from "@/utils/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const prevPathRef = useRef<string | null>(null);

    useEffect(() => {
        if (prevPathRef.current !== pathname) {
            prevPathRef.current = pathname;
            refreshTranseuAccessToken();
        }
    }, [pathname]);

    return <KindeProvider>{children}</KindeProvider>;
};
