import { Suspense } from "react"
import { FreightTable } from "@/ui/freight/freight-table/freight-table"
import { FreightSkeleton } from "@/ui/freight/freight-table/freight-skeleton"

export default function FreightPage() {
    return (
        <div className="container mx-auto py-10">
            <Suspense fallback={<FreightSkeleton />}>
                <FreightTable />
            </Suspense>
        </div>
    )
}

