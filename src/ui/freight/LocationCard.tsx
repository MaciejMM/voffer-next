'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CountrySelect} from "@/ui/freight/CountrySelect";
import {Input} from "@/components/ui/input";
import {DateRangePicker} from "@/ui/freight/DateRangePicker";
import TimeSelect from "@/ui/freight/TimeSelect";
import * as React from "react";
import {State} from "@/lib/action";
import {Search} from "lucide-react";

import {SearchLocationDialog} from "@/ui/freight/SearchLocationDialog";

export enum Key {
    Loading = 'loading',
    Unloading = 'unloading',
}


interface LocationCardProps extends React.HTMLAttributes<HTMLDivElement> {
    state: State;
    locationKey: string;
}


export const LocationCard = ({
                                 className,
                                 state,
                                 ...props
                             }: LocationCardProps) => {

    const title = props.locationKey === Key.Loading ? "Miejsce załadunku" : "Miejsce rozładunku";

    const postalCodeKey = `${props.locationKey}PostalCode` as keyof State['errors'];
    const place = `${props.locationKey}Place` as keyof State['errors'];
    const country = `${props.locationKey}Country` as keyof State['errors'];
    const [open, setOpen] = React.useState(false);



    const errorList = [
        {
            key: postalCodeKey as keyof State['errors'],
            id: `${props.locationKey}PostalCode-error`
        },
        {
            key: place as keyof State['errors'],
            id: `${props.locationKey}Place-error`
        },
        {
            key: country as keyof State['errors'],
            id: `${props.locationKey}Country-error`
        },
        {
            key: `${props.locationKey}StartTime` as keyof State['errors'],
            id: `${props.locationKey}StartTime-error`
        },
        {
            key: `${props.locationKey}EndTime` as keyof State['errors'],
            id: `${props.locationKey}EndTime-error`
        },
        {
            key: `${props.locationKey}EndDate` as keyof State['errors'],
            id: `${props.locationKey}EndDate-error`
        }

    ]

    // @ts-ignore
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-9 grid-rows-2 gap-4">
                    <div className="col-span-9 grid gap-4 grid-cols-12 row-span-1">
                        <CountrySelect
                            defaultValue={state.inputs?.[`${props.locationKey}Country` as keyof State['inputs']]}
                            state={state}
                            locationKey={props.locationKey}
                            className="w-full col-span-3"/>
                        <Input aria-invalid={!!state.errors?.[postalCodeKey]}
                               defaultValue={state.inputs?.[postalCodeKey]}
                               name={`${props.locationKey}PostalCode`}
                               className="col-span-3"
                               placeholder="Kod pocztowy"
                               aria-describedby={`${props.locationKey}PostalCode`}/>
                        <Input aria-invalid={!!state.errors?.[place]}
                               defaultValue={state.inputs?.[place]}
                               name={`${props.locationKey}Place`}
                               className="col-span-5"
                               placeholder={title}
                               aria-describedby={`${props.locationKey}Place`}/>
                      <Search size={24} onClick={() => setOpen(true)}></Search>
                    </div>
                    <div className="col-span-9 grid gap-4 grid-cols-12 row-span-1">
                        <DateRangePicker state={state} locationKey={props.locationKey}  className="col-span-6 w-full"/>
                        <TimeSelect locationKey={props.locationKey} state={state} className="col-span-6"/>

                    </div>
                </div>

                <SearchLocationDialog locationKey={props.locationKey}
                                      state={state}
                                      open={open}
                                      onOpenChange={setOpen}
                ></SearchLocationDialog>
                <div>
                    {errorList.map(({key, id}) => (
                        <div id={id} aria-live="polite" aria-atomic="true" key={id}>
                            {/*// @ts-ignore*/}
                            {state?.errors?.[key]?.map((error: string) => (
                                <p className="mt-2 text-xs text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                        </div>
                    ))}

                </div>
            </CardContent>
        </Card>
    )
}
