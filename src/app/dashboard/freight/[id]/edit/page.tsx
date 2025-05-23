import EditFreightPage from "@/ui/freight/EditFreightPage";

export default function Page() {
    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Edytuj fracht
            </h3>
            <EditFreightPage />
        </div>
    );
} 
