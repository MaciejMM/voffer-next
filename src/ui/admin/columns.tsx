"use client"

import { ColumnDef } from "@tanstack/react-table"
import {User} from "@/ui/admin/UserTable";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "firstName",
        header: "Imie",
    },
    {
        accessorKey: "lastName",
        header: "Nazwisko",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "createdAt",
        header: "Data",
    },
]
