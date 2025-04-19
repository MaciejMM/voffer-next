import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"

import {Button} from "@/components/ui/button";
import TranseuStatusIndicator from "@/ui/dashboard/TranseuStatusIndicator";

export const TranseuLoginCard = () => {

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Trans.EU</CardTitle>
                <CardDescription>Zaloguj się do Trans.EU</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter className=" flex justify-between">
                <Button className="cursor-pointer">Zaloguj</Button>
                <TranseuStatusIndicator></TranseuStatusIndicator>
            </CardFooter>
        </Card>
    )
}
