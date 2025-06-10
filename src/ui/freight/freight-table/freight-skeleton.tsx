import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function FreightSkeleton() {
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"><Skeleton className="h-6 w-[20px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[150px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[150px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[150px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[150px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[100px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[100px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[80px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[80px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[80px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[60px]" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[120px]" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton className="h-6 w-[20px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[60px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-[100px]" />
                    <Skeleton className="h-10 w-[70px]" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-8" />
                    <Skeleton className="h-10 w-8" />
                    <Skeleton className="h-10 w-[100px]" />
                    <Skeleton className="h-10 w-8" />
                    <Skeleton className="h-10 w-8" />
                </div>
            </div>
        </div>
    )
} 