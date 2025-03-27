'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CountrySelect} from "@/ui/freight/CountrySelect";
import {Input} from "@/components/ui/input";
import {DateRangePicker} from "@/ui/freight/DateRangePicker";
import TimeSelect from "@/ui/freight/TimeSelect";
import * as React from "react";
import {State} from "@/lib/action";

export enum Key {
    Loading = 'loading',
    Unloading = 'unloading',

}


interface LocationCardProps extends React.HTMLAttributes<HTMLDivElement> {
    state: State;
    locationKey: string;
}


export const LocationCard =({
    className,
                                 state,
                                 ...props
                             }: LocationCardProps) => {

    const title = props.locationKey === Key.Loading ? "Miejsce załadunku" : "Miejsce rozładunku";



    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-9 grid-rows-2 gap-4">
                    <div className="col-span-9 grid gap-4 grid-cols-12 row-span-1">
                        <CountrySelect state={state}  locationKey={props.locationKey} className="w-full col-span-3"/>
                        <Input name={`${props.locationKey}PostalCode`} className="col-span-3" placeholder="Kod pocztowy"/>
                        <Input name={`${props.locationKey}Place`} className="col-span-6" placeholder={title}/>
                    </div>
                    <div className="col-span-9 grid gap-4 grid-cols-12 row-span-1">
                        <DateRangePicker className="col-span-6 w-full"/>
                        <TimeSelect className="col-span-6"/>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
