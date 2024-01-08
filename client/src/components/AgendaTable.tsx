import { useEffect, useState } from "react"
import {
    CaretSortIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    TrashIcon,
    Pencil2Icon,
    ResetIcon
} from "@radix-ui/react-icons"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAgenda } from "@/context/AgendaContext"
import { formatMinutesToHoursAndMinutes } from "@/helpers/timeConverter.helper"

export type TAgendaItem = {
    id: string;
    _id?: string;
    order: number;
    phase: string;
    content: string;
    objectives: string;
    duration: number;
    creditable: "Yes" | "";
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
}

type TDraggableTableRow = {
    row: any; index: any; moveRow: any;
}

const DraggableTableRow = ({ row, index, moveRow }: TDraggableTableRow) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: any) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const toIndex = index;
        moveRow(fromIndex, toIndex);
    };

    return (
        <>
            <TableRow
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ opacity: isDragging ? 0.5 : 1 }}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${row.original?.isDeleted ? "bg-red-300" : ""}`}
            >
                {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </>
    );
};


export function AgendaItemsTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const { selectedAgendaItems: data, setSelectedAgendaItems: setData, setSelectedAgendaItem } = useAgenda();

    const moveRow = (fromIndex: any, toIndex: any) => {
        const newData = [...data];
        const [removed] = newData.splice(fromIndex, 1);
        newData.splice(toIndex, 0, removed);
        const mappedOrder = newData.map((data: any, index) => ({ ...data, _id: data._id, order: index + 1 })).sort((a: any, b: any) => a.order - b.order);
        setData([...mappedOrder]);
    };

    const handleDeleteAgendaItem = (id: any) => {
        const agendaItems = [...data];
        let filteredAgendaItems = [];
        if (!isNaN(id)) {
            filteredAgendaItems = [...agendaItems].filter((item) => item.order != id);
        } else {
            filteredAgendaItems = [...agendaItems].map((item) => ({ ...item, isDeleted: item._id === id || item.order === id ? true : item?.isDeleted }))
        }

        setData([...filteredAgendaItems]);
    }

    const handleResetAgendaItem = (id: any) => {
        const agendaItems = [...data];
        const filteredAgendaItems = [...agendaItems].map((item) => {
            if (((item._id === id || item.order === id) && item?.isDeleted) || item?.isDeleted === undefined) {
                delete item.isDeleted;
            }
            return item;
        })
        setData([...filteredAgendaItems]);
    }

    const handleEditAgendaItem = (id: any) => {
        const agendaItems = [...data];
        const agendaItem = [...agendaItems].filter((item) => item.order == id || item._id == id);
        if (agendaItem) {
            const item = agendaItem[0];
            setSelectedAgendaItem(item);
        }
    }


    const columns: ColumnDef<TAgendaItem>[] = [
        {
            accessorKey: "order",
            header: "#ID",
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue("order")}</div>
            ),
        },
        {
            accessorKey: "phase",
            header: "Phase",
            cell: ({ row }) => (
                <div className="">{row.getValue("phase")}</div>
            ),
        },
        {
            accessorKey: "content",
            header: "Content",
            cell: ({ row }) => (
                <div className="">{row.getValue("content")}</div>
            ),
        },
        {
            accessorKey: "objectives",
            header: "Objectives",
            cell: ({ row }) => (
                <div className="">{row.getValue("objectives")}</div>
            ),
        },
        {
            accessorKey: "duration",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Duration
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="">{row.getValue("duration")} min</div>
            ),
        },
        {
            accessorKey: "creditable",
            header: "Creditable",
            cell: ({ row }) => (
                <div className="">{row.getValue("creditable") ? "Yes" : "No"}</div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const id = row.original?._id || row.original?.order;

                return (
                    <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleEditAgendaItem(id)}><Pencil2Icon /></Button>
                        {
                            row.original?.isDeleted ? <Button size="sm" variant="secondary" onClick={() => handleResetAgendaItem(id)}><ResetIcon /></Button> : <Button size="sm" variant="destructive" onClick={() => handleDeleteAgendaItem(id)}><TrashIcon /></Button>
                        }
                    </div>
                )
            },
        },
    ]

    const totalMinutes = [...data].reduce((acc, curr) => acc += Number(curr.duration), 0);
    const totalCreditableMinutes = [...data].reduce((acc, curr) => acc += curr.creditable ? Number(curr.duration) : 0, 0);
    const formattedDuration = formatMinutesToHoursAndMinutes(totalMinutes)
    const formattedTotalCreditableMinutes = formatMinutesToHoursAndMinutes(totalCreditableMinutes)
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    useEffect(() => {

    }, [])

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter content..."
                    value={(table.getColumn("content")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("content")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <DraggableTableRow key={index} row={row} index={index} moveRow={moveRow} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center gap-4">
                    <p className="leading-7">
                        Total Duration: {formattedDuration}
                    </p>
                    <p className="leading-7">
                        Total Creditable Minutes: {formattedTotalCreditableMinutes} <span className="text-red-400">(Attributes: &lt; 15 mins)</span>
                    </p>
                </div>
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <DoubleArrowLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <DoubleArrowRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
