"use client";

import {useEffect} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {refreshTranseuAccessToken} from "@/utils/auth";
import {CheckCircle2, XCircle} from "lucide-react";
import useStore from "@/store/store";

export default function TranseuStatusIndicator() {
    const {status, setStatus} = useStore();

    useEffect(() => {
        const checkToken = async () => {
            setStatus("loading");

            const existingToken = sessionStorage.getItem("transeuAccessToken");

            if (existingToken) {
                setStatus("logged-in");
                return;
            }

            const newToken = await refreshTranseuAccessToken();
            if (newToken) {
                setStatus("logged-in");
            } else {
                setStatus("logged-out");
            }
        };

        checkToken();
    }, [setStatus]);

    useEffect(() => {
        const handleStorageChange = () => {
            const existingToken = sessionStorage.getItem("transeuAccessToken");
            if (existingToken) {
                setStatus("logged-in");
            } else {
                setStatus("logged-out");
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [setStatus]);

    if (status === "loading") {
        return <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full"/>
            <Skeleton className="h-4 w-[150px]"/>
        </div>
            ;
    }

    return (
        <div className="flex items-center gap-2">
            {status === "logged-in" ? (
                <CheckCircle2 className="text-green-500" size={16}/>
            ) : (
                <XCircle className="text-red-500" size={16}/>
            )}
            <span className="text-sm">
                {status === "logged-in" ? "Zalogowany do Transeu" : "Nie zalogowany"}
            </span>
        </div>
    );
}
