"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2, MoreHorizontal, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Freight {
    id: string;
    transeuId: string | null;
    rawFormData: {
        loadingCountry:string;
        loadingPostalCode:string;
        loadingPlace:string;
        loadingStartTime:string;
        loadingEndTime:string;
        loadingDate:string;
        loadingStartDate:string;
        loadingEndDate:string;
        unloadingCountry:string;
        unloadingPostalCode:string;
        unloadingPlace:string;
        unloadingStartTime:string;
        unloadingEndTime:string;
        unloadingDate:string;
        unloadingStartDate:string;
        unloadingEndDate:string;
        weight: string;
        length: string;
        volume: string;
        description: string;
        selectedCategories: string[];
        selectedVehicles: string[];
        isFullTruck: boolean;
        transEuResponse?: any;
        isPublished: boolean;
    };
    userId: string;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export const columns: ColumnDef<Freight>[] = [
    {
        accessorKey: "rawFormData.loadingPlace.place",
        header: "Załadunek",
        cell: ({ row }) => {
            const { loadingCountry, loadingPlace, loadingPostalCode } = row.original.rawFormData;
            const countryClass = `fi fi-${loadingCountry.toLowerCase()}`;
            return (
                <div className="flex flex-row gap-x-1">
                    <span className={countryClass}></span>
                    <span>{loadingCountry}</span>
                    <span>{loadingPostalCode}</span>
                    <span className="text-sm font-medium text-gray-900">{loadingPlace}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "rawFormData.loadingPlace",
        header: "Data i czas załadunku",
        cell: ({ row }) => {
            const { loadingStartDate, loadingStartTime, loadingEndDate, loadingEndTime } = row.original.rawFormData;
           
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                        {loadingStartDate} - {loadingEndDate}
                    </span>
                    <span className="text-xs text-gray-500">{loadingStartTime}-{loadingEndTime}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "rawFormData.unloadingPlace.place",
        header: "Rozładunek",
        cell: ({ row }) => {
            const { unloadingCountry, unloadingPlace, unloadingPostalCode } = row.original.rawFormData;
            const countryClass = `fi fi-${unloadingCountry.toLowerCase()}`;
            return (
                <div className="flex flex-row gap-x-1">
                    <span className={countryClass}></span>
                    <span>{unloadingCountry}</span>
                    <span>{unloadingPostalCode}</span>
                    <span className="text-sm font-medium text-gray-900">{unloadingPlace}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "rawFormData.unloadingPlace",
        header: "Data i czas rozładunku",
        cell: ({ row }) => {
            const { unloadingStartDate, unloadingStartTime, unloadingEndDate, unloadingEndTime } = row.original.rawFormData;
   
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                        {unloadingStartDate} - {unloadingEndDate}
                    </span>
                    <span className="text-xs text-gray-500">{unloadingStartTime}-{unloadingEndTime}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "rawFormData.selectedVehicles",
        header: "Pojazd",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    {row.original.rawFormData.selectedVehicles.map((vehicle, index) => (
                        <span key={index} className="text-sm text-gray-900">{vehicle}</span>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: "rawFormData.selectedCategories",
        header: "Typ pojazdu",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    {row.original.rawFormData.selectedCategories.map((vehicle, index) => (
                        <span key={index} className="text-sm text-gray-900">{vehicle}</span>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: "rawFormData.weight",
        header: "Waga",
    },
    {
        accessorKey: "rawFormData.length",
        header: "Długość",
    },
    {
        accessorKey: "rawFormData.volume",
        header: "Wolumen",
    },
    {
        accessorKey: "rawFormData.isFullTruck",
        header: "F/L",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="text-sm text-gray-900">
                        {row.original.rawFormData.isFullTruck ? "FTL" : "LTL"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "transeuId",
        header: "TRANS.EU",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col justify-center">
                    <span className="text-sm text-gray-900">
                        {row.original.transeuId ? (
                            <CheckCircle2 className="text-green-500" size={16} />
                        ) : (
                            <XCircle className="text-red-500" size={16} />
                        )}
                    </span>
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
                            onClick={() => navigator.clipboard.writeText(row.original.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            window.location.href = `/dashboard/freight/${row.original.id}/edit`
                        }}>
                            Edytuj Fracht
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
