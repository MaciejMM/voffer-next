"use client"

import {ColumnDef} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {CheckCircle2, CheckIcon, MoreHorizontal, XCircle} from "lucide-react"
import {Button} from "@/components/ui/button";

type Freight = {
    id: number;
    weight: string;
    length: string;
    volume: string;
    description: string;
    loadingPlace: {
        country: string;
        place: string;
        postalCode: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
    };
    unloadingPlace: {
        country: string;
        place: string;
        postalCode: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
    };
    selectedCategories: {
        name: string;
    }[];
    selectedVehicles: {
        name: string;
    }[];
    isFullTruck: boolean;
    publishDateTime: string | null;
    publishSelected: string | null;
    telerouteFreightId: string | null;
    telerouteExternalId: string | null;
    transeuFreightId: string | null;
    createdBy: string;
    updatedBy: string | null;
    createdDate: string | null;
    updatedDate: string | null;
    userId: string | null;
};

export const columns: ColumnDef<Freight>[] = [

    {
        accessorKey: "loadingPlace.place",
        header: "Załadunek",
        cell: ({row}) => {
            const {country, place,postalCode} = row.original.loadingPlace;

            const countryClass = `fi fi-${country.toLowerCase()}`;
            return (
                <div className="flex flex-row gap-x-1">
                    <span className={countryClass}></span>
                    <span>{country}</span>
                    <span>{postalCode}</span>
                    <span
                        className="text-sm font-medium text-gray-900 ">{place}
                    </span>

                </div>
            );
        }
    },
    {
        accessorKey: "loadingPlace",
        header: "Data i czas załadunku",
        cell: ({row}) => {
            const {startDate, startTime, endDate, endTime} = row.original.loadingPlace;
            const formatDate = (date: string) => {
                return new Date(date).toISOString().split("T")[0];
            };
            return (
                <div className="flex flex-col">
                    <span
                        className="text-sm font-medium text-gray-900">{formatDate(startDate)} - {formatDate(endDate)}</span>
                    <span className="text-xs text-gray-500">{startTime}-{endTime}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "unloadingPlace.country",
        header: "Rozładunek",
        cell: ({row}) => {
            const {country, place,postalCode} = row.original.unloadingPlace;
            const countryClass = `fi fi-${country.toLowerCase()}`;
            return (
                <div className="flex flex-row gap-x-1">
                    <span className={countryClass}></span>
                    <span>{country}</span>
                    <span>{postalCode}</span>
                    <span
                        className="text-sm font-medium text-gray-900 ">{place}
                    </span>

                </div>
            );
        }
    },
    {
        accessorKey: "unloadingPlace",
        header: "Data i czas rozładunku",
        cell: ({row}) => {
            const {startDate, startTime, endDate, endTime} = row.original.unloadingPlace;
            const formatDate = (date: string) => {
                return new Date(date).toISOString().split("T")[0];
            };
            return (
                <div className="flex flex-col">
                    <span
                        className="text-sm font-medium text-gray-900">{formatDate(startDate)} - {formatDate(endDate)}</span>
                    <span className="text-xs text-gray-500">{startTime}-{endTime}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "Vehicle",
        header: "Pojazd",
        cell: ({row}) => {
            return (
                <div className="flex flex-col">
                    {
                        row.original.selectedVehicles.map((vehicle, index) => (
                            <span key={index} className="text-sm  text-gray-900">{vehicle.name}</span>
                        ))
                    }

                </div>
            );
        },
    },
    {
        accessorKey: "VehicleType",
        header: "Typ pojazdu",
        cell: ({row}) => {
            return (
                <div className="flex flex-col">
                    {
                        row.original.selectedCategories.map((vehicle, index) => (
                            <span key={index} className="text-sm  text-gray-900">{vehicle.name}</span>
                        ))
                    }

                </div>
            );
        },
    },


    {
        accessorKey: "weight",
        header: "Waga",
    },
    {
        accessorKey: "length",
        header: "Długość",
    },
    {
        accessorKey: "volume",
        header: "Wolumen",
    },
    {
        accessorKey: "isFullTruck",
        header: "F/L",
        cell: ({row}) => {
            const {isFullTruck} = row.original;

            return (
                <div className="flex flex-col">
                    <span className="text-sm text-gray-900">{isFullTruck ? "FTL" : "LTL"}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "transeuFreightId",
        header: "TRANS.EU",
        cell: ({row}) => {
            const {transeuFreightId} = row.original;

            return (
                <div className="flex flex-col justify-center">
                    <span className="text-sm text-gray-900">{transeuFreightId !== null ?
                        <CheckCircle2 className="text-green-500" size={16}/>
                        : <XCircle className="text-red-500" size={16}/>

                    }</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
 
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(row.original.id.toString())}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>{
                            window.location.href = `/dashboard/freight/${row.original.id}/edit`
                        }}>Edytuj Fracht</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
