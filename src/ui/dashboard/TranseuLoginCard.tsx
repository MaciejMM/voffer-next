import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import TranseuStatusIndicator from "@/ui/dashboard/TranseuStatusIndicator";
import { useRouter } from "next/navigation";

export const TranseuLoginCard = () => {

    const handleLogin = async () => {

        //get code from url
        const code = new URLSearchParams(window.location.search).get('code');

        //add call to api/trans/auth as POSt with body {code: code, redirect_uri: process.env.NEXT_PUBLIC_TRANS_REDIRECT_URI}
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trans/auth`, {
            method: 'POST',
            body: JSON.stringify({code: code})
        });

        if (!response.ok) {
            console.error('Failed to fetch access token');
            return;
        }

        const data = await response.json();
        console.log(data);

        //save data to local storage
        localStorage.setItem('transeuAccessToken', data.access_token);

    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Trans.EU</CardTitle>
                <CardDescription>Zaloguj się do Trans.EU</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button 
                    className="cursor-pointer"
                    onClick={handleLogin}
                >
                    Zaloguj
                </Button>
                <TranseuStatusIndicator />
            </CardFooter>
        </Card>
    )
}
