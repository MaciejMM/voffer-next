import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import * as React from "react";
import {cn} from "@/lib/utils";
import {State} from "@/lib/action";

interface CountrySelectProps extends React.HTMLAttributes<HTMLDivElement> {
    locationKey: string;
    state: State;
}

export const CountrySelect = ({
                                  className,
                                  state,
                                  ...props
                              }: CountrySelectProps) => {

    const countries = [
        {name: "Austria", code: "AT"},
        {name: "Belgium", code: "BE"},
        {name: "France", code: "FR"},
        {name: "Germany", code: "DE"},
        {name: "Italy", code: "IT"},
        {name: "Luxembourg", code: "LU"},
        {name: "Netherlands", code: "NL"},
        {name: "Poland", code: "PL"},
        {name: "Portugal", code: "PT"},
        {name: "Romania", code: "RO"},
        {name: "Spain", code: "ES"},
        {name: "Switzerland", code: "CH"},
        {name: "United Kingdom", code: "GB"},
        {name: "Albania", code: "AL"},
        {name: "Andorra", code: "AD"},
        {name: "Belarus", code: "BY"},
        {name: "Bosnia and Herzegovina", code: "BA"},
        {name: "Bulgaria", code: "BG"},
        {name: "Cyprus", code: "CY"},
        {name: "Czech Republic", code: "CZ"},
        {name: "Denmark", code: "DK"},
        {name: "Estonia", code: "EE"},
        {name: "Finland", code: "FI"},
        {name: "Greece", code: "GR"},
        {name: "Hungary", code: "HU"},
        {name: "Croatia", code: "HR"},
        {name: "Iceland", code: "IS"},
        {name: "Ireland", code: "IE"},
        {name: "Latvia", code: "LV"},
        {name: "Liechtenstein", code: "LI"},
        {name: "Lithuania", code: "LT"},
        {name: "Macedonia, Republic of", code: "MK"},
        {name: "Malta", code: "MT"},
        {name: "Moldova", code: "MD"},
        {name: "Monaco", code: "MC"},
        {name: "Montenegro", code: "ME"},
        {name: "Norway", code: "NO"},
        {name: "San Marino", code: "SM"},
        {name: "Serbia", code: "RS"},
        {name: "Slovakia", code: "SK"},
        {name: "Slovenia", code: "SI"},
        {name: "Sweden", code: "SE"},
        {name: "Turkey", code: "TR"},
        {name: "Ukraine", code: "UA"},
        {name: "Gibraltar", code: "GI"},
        {name: "Russian Federation", code: "RU"},
    ];



    return (
            <Select name={`${props.locationKey}Country`}  >
                <SelectTrigger className={cn("", className)}>
                    <SelectValue placeholder="Kraj"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel  >Wybierz Kraj</SelectLabel>
                        {
                            countries.sort((a: { name: string, code: string }, b: {
                                name: string,
                                code: string
                            }) => a.code.localeCompare(b.code))
                                .map((country) => (
                                    <SelectItem  className="" key={country.code} value={country.code}>{country.name}</SelectItem>
                                ))
                        }

                    </SelectGroup>
                </SelectContent>
            </Select>

    )

}
