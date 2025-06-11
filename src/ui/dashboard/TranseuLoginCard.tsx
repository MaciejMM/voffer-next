'use client';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import {handleTransEuLogin} from "@/lib/actions/auth";
import {useTransition} from "react";
import TranseuStatusIndicator from "@/ui/dashboard/TranseuStatusIndicator";

export function TranseuLoginCard() {
    const [isPending, startTransition] = useTransition();

    const handleLogin = () => {
        startTransition(() => {
            handleTransEuLogin();
        });
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Trans.eu Integration</CardTitle>
                <CardDescription>
                    Connect your Trans.eu account to manage your freight offers
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button 
                    onClick={handleLogin}
                    disabled={isPending}
                >
                    {isPending ? 'Connecting...' : 'Zaloguj'}
                </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
                <TranseuStatusIndicator />
            </CardFooter>
        </Card>
    )
}
