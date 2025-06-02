import Form from "@/ui/freight/CreateFreightForm";
import { FreightSkeleton } from "@/ui/freight/freight-table/freight-skeleton";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Stwórz fracht
            </h3>
            <Suspense fallback={<FreightSkeleton />}>
                <Form />
            </Suspense>
        </div>
    );
}
