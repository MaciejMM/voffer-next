import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import TranseuStatusIndicator from "@/ui/dashboard/TranseuStatusIndicator";
import { useRouter } from "next/navigation";

export const TranseuLoginCard = () => {
    const router = useRouter();

    const handleLogin = () => {
        // Generate a random state value
        const state = Math.random().toString(36).substring(2, 15);
        
        // Store state in localStorage to verify it when user returns
        localStorage.setItem('trans_auth_state', state);

        // Construct the authorization URL
        const authUrl = new URL('https://auth.platform.trans.eu/oauth2/auth');
        authUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_TRANS_CLIENT_ID || '');
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('redirect_uri', process.env.NEXT_PUBLIC_TRANS_REDIRECT_URI || '');

        // Redirect to Trans.eu authorization page
        window.location.href = authUrl.toString();
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
