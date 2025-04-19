import {fetchUsers} from "@/lib/admin-action";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { DataTable } from "@/ui/admin/data-table";
import {columns} from "@/ui/admin/columns";


export default async function Page() {

    const users = await fetchUsers();
    return (
        <div className="flex h-screen flex-col gap-8  md:overflow-hidden">
            <h3 className="text-2xl font-semibold tracking-tight flex justify-between">
                Panel Administracyjny
                <Link  href="/dashboard/admin/create">
                    <Button className="cursor-pointer">Dodaj użytkownika</Button>
                </Link>

            </h3>
            <DataTable columns={columns} data={users}/>
        </div>
    );
}
