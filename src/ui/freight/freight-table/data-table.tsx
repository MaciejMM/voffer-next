"use client"
import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    getPaginationRowModel,
    RowSelectionState,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { updateFreightPublishState } from "@/lib/actions/freight"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pageSize, setPageSize] = React.useState(5)
    const [pageIndex, setPageIndex] = React.useState(0)
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
    const [isPending, startTransition] = useTransition()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            pagination: {
                pageSize,
                pageIndex,
            },
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        enableMultiRowSelection: true,
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({
                    pageIndex,
                    pageSize,
                })
                setPageSize(newState.pageSize)
                setPageIndex(newState.pageIndex)
            }
        },
    })

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={
                                            table.getRowModel().rows.filter(row => !(row.original as any).isPublished).length > 0 &&
                                            table.getRowModel().rows.filter(row => !(row.original as any).isPublished)
                                                .every(row => row.getIsSelected())
                                        }
                                        onCheckedChange={(value) => {
                                            table.getRowModel().rows
                                                .filter(row => !(row.original as any).isPublished)
                                                .forEach(row => row.toggleSelected(!!value))
                                        }}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? "flex items-center cursor-pointer select-none"
                                                            : ""
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: <ArrowUpDown className="ml-2 h-4 w-4" />,
                                                        desc: <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />,
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows
                            .map((row) => {
                                const isPublished = (row.original as any).isPublished;
                                const transeuId = (row.original as any).transeuId;
                                
                                const handlePublishChange = (checked: boolean) => {
                                    startTransition(async () => {
                                        try {
                                            await updateFreightPublishState((row.original as any).id, checked);
                                            toast.success(checked ? "Freight marked for publishing" : "Freight unpublished");
                                        } catch (error) {
                                            toast.error("Failed to update publish state");
                                            console.error(error);
                                        }
                                    });
                                };

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={isPublished === true ? "bg-muted/50" : ""}
                                    >
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <Checkbox
                                                                checked={row.getIsSelected()}
                                                                disabled={isPublished}
                                                                onCheckedChange={row.getToggleSelectedHandler()}
                                                                aria-label="Publish to Trans.EU"
                                                            />
                                                        </div>
                                                    </TooltipTrigger>
                                                    {isPublished && (
                                                        <TooltipContent>
                                                            <p>This freight was published in Trans.EU</p>
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(value) => {
                            const newPageSize = Number(value)
                            setPageSize(newPageSize)
                            table.setPageSize(newPageSize)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 25].map((pageSize) => (
                                <SelectItem key={pageSize} value={String(pageSize)}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            setPageIndex(0)
                            table.setPageIndex(0)
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setPageIndex(pageIndex - 1)
                            table.previousPage()
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center text-sm font-medium">
                        Page {pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setPageIndex(pageIndex + 1)
                            table.nextPage()
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            const lastPage = table.getPageCount() - 1
                            setPageIndex(lastPage)
                            table.setPageIndex(lastPage)
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
