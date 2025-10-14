'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type Reservation, type ReservationStatus } from '@/types';
import { Transition } from '@headlessui/react';
import { router, useForm } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import InputError from './input-error';

export const getColumns = (): ColumnDef<Reservation>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'user.name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                User <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.original.user?.name ?? '—'}</div>,
    },
    {
        accessorKey: 'room.name',
        header: 'Room',
        cell: ({ row }) => <div>{row.original.room?.name ?? '—'}</div>,
    },
    {
        accessorKey: 'schedule',
        header: 'Schedule',
        cell: ({ row }) => {
            const schedule = row.original.schedule;
            return schedule ? (
                <div className="text-sm">
                    <div>
                        {new Date(schedule.start_time).toLocaleString()} →{' '}
                        {new Date(schedule.end_time).toLocaleString()}
                    </div>
                </div>
            ) : (
                '—'
            );
        },
    },
    {
        accessorKey: 'purpose',
        header: 'Purpose',
        cell: ({ row }) => <div>{row.getValue('purpose')}</div>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const color =
                status === 'approved'
                    ? 'text-green-600'
                    : status === 'cancelled'
                      ? 'text-red-600'
                      : 'text-yellow-600';
            return <div className={`font-semibold ${color}`}>{status}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return (
                <div className="text-sm text-muted-foreground">
                    {date.toLocaleDateString()}
                </div>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const reservation = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <EditReservationDialog reservation={reservation} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteReservationDialog
                                reservation={reservation}
                            />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function ReservationDataTable({
    data,
}: {
    data?: Reservation[];
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns = React.useMemo(() => getColumns(), []);
    const table = useReactTable({
        data: data ?? [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by purpose..."
                    value={
                        (table
                            .getColumn('purpose')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('purpose')
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
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
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <AddReservationDialog />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
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

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ====================== DIALOGS ====================== */

function AddReservationDialog() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        purpose: '',
        room_id: '',
        schedule_id: '',
        status: 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reservations', { onSuccess: () => reset() });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="ml-4">Add Reservation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Reservation</DialogTitle>
                        <DialogDescription>
                            Fill in the reservation details and click save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div>
                            <Label>Purpose</Label>
                            <Input
                                value={data.purpose}
                                onChange={(e) =>
                                    setData('purpose', e.target.value)
                                }
                                placeholder="Reservation purpose"
                            />
                            {errors.purpose && (
                                <InputError message={errors.purpose} />
                            )}
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Input
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                placeholder="pending / approved / cancelled"
                            />
                            {errors.status && (
                                <InputError message={errors.status} />
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-4 flex justify-between">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save Reservation
                            </Button>
                            <Transition show={recentlySuccessful}>
                                <p className="text-sm text-green-600">Saved.</p>
                            </Transition>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditReservationDialog({ reservation }: { reservation: Reservation }) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        purpose: reservation.purpose || '',
        status: reservation.status || 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/reservations/${reservation.id}`, { onSuccess: () => reset() });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link">Edit Reservation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Reservation</DialogTitle>
                        <DialogDescription>
                            Update reservation details and click save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div>
                            <Label>Purpose</Label>
                            <Input
                                value={data.purpose}
                                onChange={(e) =>
                                    setData('purpose', e.target.value)
                                }
                            />
                            {errors.purpose && (
                                <InputError message={errors.purpose} />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                className="input"
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.value as ReservationStatus,
                                    )
                                }
                            >
                                <option value="">Select a status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            {errors.status && (
                                <InputError message={errors.status} />
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-4 flex justify-between">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save Changes
                            </Button>
                            <Transition show={recentlySuccessful}>
                                <p className="text-sm text-green-600">Saved.</p>
                            </Transition>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteReservationDialog({
    reservation,
}: {
    reservation: Reservation;
}) {
    const { processing, reset, recentlySuccessful } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/reservations/${reservation.id}`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="text-red-600">
                    Delete Reservation
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Are you sure you want to delete this reservation?
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="bg-red-600 text-white hover:bg-red-700"
                            disabled={processing}
                        >
                            Yes, delete reservation
                        </Button>
                        <Transition show={recentlySuccessful}>
                            <p className="text-sm text-green-600">Deleted.</p>
                        </Transition>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
