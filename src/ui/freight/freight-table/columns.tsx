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
import {  MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export interface Freight {
    id: string;
    transeuId: string | null;
    transEuStatus: string | null;
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

const ActionsCell = ({ row }: { row: any }) => {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleRefreshFreight = async (freightId: string) => {
        setLoadingId(freightId);
        let message = "";
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/freight/${freightId}/refresh_publication`, {
                method: "PUT",
                credentials: "include"
            });
            const result = await res.json();
            if (!res.ok){
                message = "Failed to update freight. " + (result.error || res.statusText);
                toast.error(message);
            } else {
                message = "Freight has been successfully updated.";
                toast.success(message);
            }
        } catch (e:any) {
            message = "Failed to update freight. " + e.message;
            toast.error(message);
        } finally {
            setLoadingId(null);
        }
    };

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
                {row.original.transeuId && (
                <DropdownMenuItem
                    onClick={() => handleRefreshFreight(row.original.transeuId!)}
                    disabled={loadingId === row.original.transeuId}
                >
                    {loadingId === row.original.transeuId ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Refreshing...
                        </>
                    ) : (
                        "Odśwież"
                        )}
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    window.location.href = `/dashboard/freight/${row.original.id}/edit`
                }}>
                    Edytuj Fracht
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

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
        header: "Trans.eu ID",
        cell: ({ row }) => {
            const transeuId = row.getValue("transeuId") as string | null ?? 'brak ID';
            const status = row.original.transEuStatus as string | null ?? 'brak statusu';
            return (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span>{transeuId}</span>
                        <span>{status}</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell row={row} />
    },
];
