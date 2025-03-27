import {Card, CardContent} from "@/components/ui/card";
import VehicleFilter from "@/ui/freight/VehicleFilter";
import {cn} from "@/lib/utils";
import * as React from "react";

export const VehicleSelector = ({
                                    className,
                                }: React.HTMLAttributes<HTMLDivElement>)=>{

    return (
        <Card className={cn("", className)}>
            <CardContent className="flex flex-col gap-4">
                <VehicleFilter></VehicleFilter>
            </CardContent>
        </Card>
    )
}
