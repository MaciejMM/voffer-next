import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label"
import * as React from "react";
import {cn} from "@/lib/utils";

export const TruckLoadRadioSelector = ({
                                           className,
                                       }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <RadioGroup defaultValue="FTL" className={cn("flex flex-row", className)}>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="FTL" id="ftl"/>
                <Label htmlFor="ftl">FTL</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="LTL" id="ltl"/>
                <Label htmlFor="ltl">LTL</Label>
            </div>
        </RadioGroup>
    );
}
