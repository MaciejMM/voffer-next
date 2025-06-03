"use client"

import { Suspense } from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { CreateFreightLinkButton } from "@/ui/freight/CreateFreightLinkButton"
import { FreightSkeleton } from "./freight-skeleton"
import { Freight } from "./columns"

interface FreightTableProps {
    freights: Freight[]
}

function TableContent({ freights }: FreightTableProps) {
    return <DataTable columns={columns} data={freights} />
}

export function FreightTable({ freights }: FreightTableProps) {
    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Twoje Frachty
            </h3>
            <CreateFreightLinkButton />
            <Suspense fallback={<FreightSkeleton />}>
                <TableContent freights={freights} />
            </Suspense>
        </div>
    )
} 