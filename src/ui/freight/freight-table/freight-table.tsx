"use client"

import { Suspense, useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { getFreights } from "@/lib/actions/freight"
import { CreateFreightLinkButton } from "@/ui/freight/CreateFreightLinkButton"
import { Freight } from "./columns"
import { FreightSkeleton } from "./freight-skeleton"

export function FreightTable() {
    const [freights, setFreights] = useState<Freight[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFreights = async () => {
            try {
                const data = await getFreights()
                setFreights(data)
            } catch (error) {
                console.error("Error fetching freights:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFreights()
    }, [])

    if (loading) {
        return <FreightSkeleton />
    }

    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Twoje Frachty
            </h3>
            <CreateFreightLinkButton />
            <DataTable columns={columns} data={freights} />
        </div>
    )
} 