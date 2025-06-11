"use client"

import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Freight } from "./columns"

interface FreightTableProps {
    freights: Freight[]
}

export function FreightTable({ freights }: FreightTableProps) {
    return (
        <div className="flex flex-col gap-8">
            <DataTable columns={columns} data={freights} />
        </div>
    )
} 