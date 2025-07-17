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

    const [postalCode, setPostalCode] = React.useState<string>(state.inputs?.[postalCodeKey as keyof typeof state.inputs] as string || '');
    const [placeValue, setPlaceValue] = React.useState<string>(state.inputs?.[place as keyof typeof state.inputs] as string || '');
    const [countryValue, setCountryValue] = React.useState<string>(state.inputs?.[`${props.locationKey}Country` as keyof typeof state.inputs] as string || '');

    React.useEffect(() => {
        setPostalCode(state.inputs?.[postalCodeKey as keyof typeof state.inputs] as string || '');
        setPlaceValue(state.inputs?.[place as keyof typeof state.inputs] as string || '');
        setCountryValue(state.inputs?.[`${props.locationKey}Country` as keyof typeof state.inputs] as string || '');
    }, [state.inputs, postalCodeKey, place, props.locationKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPostalCode(value);
        if (state.inputs) {
            (state.inputs as any)[postalCodeKey] = value;
        }
    };

    const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPlaceValue(value);
        if (state.inputs) {
            (state.inputs as any)[place] = value;
        }
    };

    const handleLocationSelect = (postalCode: string, city: string, countryCode: string) => {
        setPostalCode(postalCode);
        setPlaceValue(city);
        setCountryValue(countryCode);
        if (state.inputs) {
            (state.inputs as any)[postalCodeKey] = postalCode;
            (state.inputs as any)[place] = city;
            (state.inputs as any)[`${props.locationKey}Country`] = countryCode;
        }
    };

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
            key: `${props.locationKey}StartDate` as keyof State['errors'],
            id: `${props.locationKey}StartDate-error`
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
                            state={state}
                            locationKey={props.locationKey}
                            className="w-full col-span-3"/>
                        <Input aria-invalid={!!state.errors?.[postalCodeKey]}
                               value={postalCode}
                               onChange={handlePostalCodeChange}
                               name={`${props.locationKey}PostalCode`}
                               className="col-span-3"
                               placeholder="Kod pocztowy"
                               aria-describedby={`${props.locationKey}PostalCode`}/>
                        <Input aria-invalid={!!state.errors?.[place]}
                               value={placeValue}
                               onChange={handlePlaceChange}
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
                                      onLocationSelect={handleLocationSelect}
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
