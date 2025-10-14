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
import { type Facility, type Room } from '@/types';
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

export const getColumns = (facilities: Facility[]): ColumnDef<Room>[] => [
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
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'capacity',
        header: 'Capacity',
        cell: ({ row }) => <div>{row.getValue('capacity')}</div>,
    },
    {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => (
            <div className="whitespace-pre-line">
                {row.getValue('location')}
            </div>
        ),
    },
    {
        accessorKey: 'facilities',
        header: 'Facilities',
        cell: ({ row }) => {
            const facilities: Facility[] = row.original.facilities ?? [];
            return (
                <div>
                    {facilities.length
                        ? facilities.map((f) => f.name).join(', ')
                        : '-'}
                </div>
            );
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
            const room = row.original;
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
                            <EditRoomDialog
                                room={room}
                                facilities={facilities}
                            />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteRoomDialog room={room} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function RoomDataTable({
    data,
    facilities,
}: {
    data?: Room[];
    facilities: Facility[];
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns = React.useMemo(
        () => getColumns(facilities ?? []),
        [facilities],
    );
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
                    placeholder="Filter by room name..."
                    value={
                        (table.getColumn('name')?.getFilterValue() as string) ??
                        ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('name')
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
                <AddRoomDialog facilities={facilities} />
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

function AddRoomDialog({ facilities }: { facilities: Facility[] }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: '',
        capacity: '',
        location: '',
        facilities: [] as number[],
    });

    const handleCheckboxChange = (id: number) => {
        const updatedFacilities = data.facilities.includes(id)
            ? data.facilities.filter((fid) => fid !== id)
            : [...data.facilities, id];

        setData('facilities', updatedFacilities);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/rooms', { onSuccess: () => reset() });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="ml-4">Add Room</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Room</DialogTitle>
                        <DialogDescription>
                            Fill in the room details and click save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Room name"
                            />
                            {errors.name && (
                                <InputError message={errors.name} />
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={data.capacity}
                                onChange={(e) =>
                                    setData('capacity', e.target.value)
                                }
                                placeholder="Capacity"
                            />
                            {errors.capacity && (
                                <InputError message={errors.capacity} />
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                                placeholder="Location"
                            />
                            {errors.location && (
                                <InputError message={errors.location} />
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Facilities</Label>
                            <div className="grid gap-1">
                                {facilities.map((facility) => (
                                    <div
                                        key={facility.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`facility-${facility.id}`}
                                            checked={data.facilities.includes(
                                                facility.id,
                                            )}
                                            onCheckedChange={() =>
                                                handleCheckboxChange(
                                                    facility.id,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`facility-${facility.id}`}
                                        >
                                            {facility.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.facilities && (
                                <InputError message={errors.facilities} />
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-4 flex items-center justify-between">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save Room
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

function EditRoomDialog({
    room,
    facilities,
}: {
    room: Room;
    facilities: Facility[];
}) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: room.name || '',
        capacity: room.capacity || '',
        location: room.location || '',
        facilities: room.facilities?.map((f) => f.id) || [],
    });

    const handleCheckboxChange = (id: number) => {
        const updatedFacilities = data.facilities.includes(id)
            ? data.facilities.filter((fid) => fid !== id)
            : [...data.facilities, id];

        setData('facilities', updatedFacilities);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/rooms/${room.id}`, { onSuccess: () => reset() });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link">Edit Room</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Room</DialogTitle>
                        <DialogDescription>
                            Make changes to the room details and click save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <InputError message={errors.name} />
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={data.capacity}
                                onChange={(e) =>
                                    setData('capacity', e.target.value)
                                }
                            />
                            {errors.capacity && (
                                <InputError message={errors.capacity} />
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                            />
                            {errors.location && (
                                <InputError message={errors.location} />
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Facilities</Label>
                            <div className="grid gap-1">
                                {facilities.map((facility) => (
                                    <div
                                        key={facility.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`facility-${facility.id}`}
                                            checked={data.facilities.includes(
                                                facility.id,
                                            )}
                                            onCheckedChange={() =>
                                                handleCheckboxChange(
                                                    facility.id,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`facility-${facility.id}`}
                                        >
                                            {facility.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.facilities && (
                                <InputError message={errors.facilities} />
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-4 flex items-center justify-between">
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

function DeleteRoomDialog({ room }: { room: Room }) {
    const { processing, reset, recentlySuccessful } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/rooms/${room.id}`, { onSuccess: () => reset() });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="text-red-600">
                    Delete Room
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Are you sure you want to delete this room?
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
                            Yes, delete room
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
