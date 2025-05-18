'use client'

import {GenerateTokenDialog} from "@/ui/dashboard/GenerateTokenDialog";
import {useSearchParams} from "next/navigation";
import {Suspense, useEffect, useState} from "react";
import {CreateFreightLinkButton} from "@/ui/freight/CreateFreightLinkButton";
import {TranseuLoginCard} from "@/ui/dashboard/TranseuLoginCard";
function Search() {
    const [showDialog, setShowDialog] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.has('code')) {
            setShowDialog(true);
        } else {
            setShowDialog(false);
        }
    }, [searchParams]);

    return (
        <div className="container flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Panel Główny
            </h3>
            <CreateFreightLinkButton/>
            <TranseuLoginCard/>
            <GenerateTokenDialog open={showDialog} onOpenChange={setShowDialog}/>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Search/>
        </Suspense>
    );
}
