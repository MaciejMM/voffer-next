"use client"

import { ColumnDef } from "@tanstack/react-table"
import {User} from "@/lib/admin-action";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import { deleteUser } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const UserActionsCell = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            const result = await deleteUser(user.id.toString());
            if (result.success) {
                toast({
                    title: "Success",
                    description: "User deleted successfully",
                });
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete user",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while deleting the user",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/${user.id}/edit`)}>
                        Edytuj użytkownika
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                        Usuń użytkownika
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            {user.firstName} {user.lastName} ({user.email}).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};


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
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        id: "actions",
        cell: ({ row }) => <UserActionsCell user={row.original} />,

    },
]
