import { FreightTable } from "@/ui/freight/freight-table/freight-table"
import { getFreights } from "@/lib/actions/freight"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import { FreightSkeleton } from "@/ui/freight/freight-table/freight-skeleton"
import { Suspense } from "react"

async function FreightData() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    
    if (!user) {
        redirect("/api/auth/login")
    }

    const freights = await getFreights()
    return <FreightTable freights={freights} />
}

export default function FreightPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-8">
                <h3 className="text-2xl font-semibold tracking-tight">
                    Twoje Frachty
                </h3>
                <Suspense fallback={<FreightSkeleton />}>
                    <FreightData />
                </Suspense>
            </div>
        </div>
    )
}

