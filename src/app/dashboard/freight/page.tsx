import {CreateFreightLinkButton} from "@/ui/freight/CreateFreightLinkButton";
import {getFreights} from "@/lib/freightService";
import { DataTable } from "@/ui/freight/freight-table/data-table";
import { columns } from "@/ui/freight/freight-table/columns";


export default async function Page() {
    const freights = await getFreights();
    return (
        <div className="container flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Twoje Frachty
            </h3>
            <CreateFreightLinkButton/>
            <DataTable columns={columns} data={freights} />
        </div>
    );
};

