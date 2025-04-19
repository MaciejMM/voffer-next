import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label"
import * as React from "react";
import {cn} from "@/lib/utils";
import {State} from "@/lib/action";

type TruckLoadRadioSelectorProps = {
    state: State;
    className?: string;
}

export const TruckLoadRadioSelector = ({
                                           className,
                                           state,
                                           ...props
                                       }: TruckLoadRadioSelectorProps) => {
    return (
        <RadioGroup
            defaultValue={state?.inputs?.isFullTruck === false ? "false" : "true"}
            name="isFullTruck"
            className={cn("flex flex-row", className)}>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="ftl"/>
                <Label htmlFor="ftl">FTL</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="ltl"/>
                <Label htmlFor="ltl">LTL</Label>
            </div>
        </RadioGroup>
    );
}
