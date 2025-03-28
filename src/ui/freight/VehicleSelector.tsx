import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import * as React from "react";
import {State} from "@/lib/action";
import { VehicleFilter } from "./VehicleFilter";
interface VehicleSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
    state: State;
}


export const VehicleSelector = ({
                                    className,
                                    state,
                                    ...props
                                }: VehicleSelectorProps)=>{

    return (
        <Card className={cn("", className)}>
            <CardContent className="flex flex-col gap-4">
                <VehicleFilter state={state}></VehicleFilter>
            </CardContent>
        </Card>
    )
}
