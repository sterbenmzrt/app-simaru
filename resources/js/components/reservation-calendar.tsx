'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    Calendar,
    CalendarCurrentDate,
    CalendarDayView,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarViewTrigger,
    CalendarWeekView,
    CalendarYearView,
} from '@/components/ui/full-calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import InputError from './input-error';

import { type Room } from '@/types';
import { Transition } from '@headlessui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';

type Reservation = {
    id: number;
    purpose: string;
    status: 'pending' | 'approved' | 'cancelled' | 'rejected';
    schedule: {
        start_time: string;
        end_time: string;
    };
    room: {
        name: string;
    };
    user: {
        name: string;
    };
};

type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: 'default' | 'green' | 'blue' | 'pink' | 'purple' | null;
};

export default function ReservationCalendar({
    reservations,
    rooms,
}: {
    reservations: Reservation[];
    rooms: Room[];
}) {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null,
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const events: CalendarEvent[] = reservations.map((res) => {
        let color: 'default' | 'green' | 'blue' | 'pink' | 'purple' | null =
            'default';
        if (res.status === 'approved') color = 'green';
        if (res.status === 'pending') color = 'blue';
        if (res.status === 'cancelled') color = 'pink';
        if (res.status === 'rejected') color = 'purple';

        return {
            id: String(res.id),
            title: `${res.room.name} - ${res.purpose}`,
            start: parseISO(res.schedule.start_time.replace(' ', 'T')),
            end: parseISO(res.schedule.end_time.replace(' ', 'T')),
            color,
        };
    });

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setSelectedEvent(null);
        setIsDialogOpen(true);
    };

    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };

    return (
        <Calendar
            key={flash?.success || reservations.length}
            events={events}
            onEventClick={handleEventClick}
        >
            <div className="flex h-dvh flex-col">
                {/* Toolbar */}
                <div className="mb-6 flex items-center gap-2">
                    <CalendarViewTrigger
                        view="day"
                        className="aria-[current=true]:bg-accent"
                    >
                        Day
                    </CalendarViewTrigger>
                    <CalendarViewTrigger
                        view="week"
                        className="aria-[current=true]:bg-accent"
                    >
                        Week
                    </CalendarViewTrigger>
                    <CalendarViewTrigger
                        view="month"
                        className="aria-[current=true]:bg-accent"
                    >
                        Month
                    </CalendarViewTrigger>
                    <CalendarViewTrigger
                        view="year"
                        className="aria-[current=true]:bg-accent"
                    >
                        Year
                    </CalendarViewTrigger>

                    <span className="flex-1" />

                    <CalendarCurrentDate />

                    <CalendarPrevTrigger>
                        <ChevronLeft size={20} />
                    </CalendarPrevTrigger>
                    <CalendarTodayTrigger>Today</CalendarTodayTrigger>
                    <CalendarNextTrigger>
                        <ChevronRight size={20} />
                    </CalendarNextTrigger>

                    <Button className="ml-2" onClick={handleAddClick}>
                        Booking
                    </Button>
                </div>

                {/* Calendar Views */}
                <div className="flex-1 overflow-hidden px-6">
                    <CalendarDayView />
                    <CalendarWeekView />
                    <CalendarMonthView />
                    <CalendarYearView />
                </div>
            </div>

            {/* CRUD Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <DialogContent className="sm:max-w-[500px]">
                    <ReservationForm
                        event={selectedEvent}
                        onClose={() => setIsDialogOpen(false)}
                        rooms={rooms}
                    />
                </DialogContent>
            </Dialog>
        </Calendar>
    );
}

function ReservationForm({
    event,
    onClose,
    rooms,
}: {
    event: CalendarEvent | null;
    onClose: () => void;
    rooms: Room[];
}) {
    const isEdit = !!event;
    const id = event?.id;

    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const colorMap: Record<
        string,
        'approved' | 'pending' | 'cancelled' | 'rejected'
    > = {
        green: 'approved',
        blue: 'pending',
        pink: 'cancelled',
        purple: 'rejected',
        default: 'pending',
    };

    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        purpose: event?.title?.split(' - ')[1] ?? '',
        status: event?.color ? colorMap[event.color] : 'pending',
        start_time: '',
        end_time: '',
        room_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEdit) {
            if (!date || !startTime || !endTime) {
                alert('Tanggal, jam mulai, dan jam selesai wajib diisi.');
                return;
            }

            const start = `${date} ${startTime}:00`;
            const end = `${date} ${endTime}:00`;

            router.post(
                '/reservations',
                {
                    start_time: start,
                    end_time: end,
                    purpose: data.purpose,
                    status: data.status,
                    room_id: data.room_id,
                },
                {
                    onSuccess: () => {
                        reset();
                        setDate('');
                        setStartTime('');
                        setEndTime('');
                        onClose();
                        router.reload();
                    },
                },
            );
        } else {
            router.put(
                `/reservations/${id}`,
                {
                    purpose: data.purpose,
                    status: data.status,
                },
                {
                    onSuccess: () => {
                        reset();
                        onClose();
                        router.reload();
                    },
                },
            );
        }
    };

    const handleDelete = () => {
        if (!id) return;
        destroy(`/reservations/${id}`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    useEffect(() => {
        return () => reset();
    }, [reset]);

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="mb-4 text-lg font-semibold">
                {isEdit ? 'Edit Reservation' : 'New Reservation'}
            </h2>

            <div className="grid gap-4 py-2">
                <div>
                    <Label>Purpose</Label>
                    <Input
                        value={data.purpose}
                        onChange={(e) => setData('purpose', e.target.value)}
                        placeholder="Meeting, Class, etc"
                    />
                    {errors.purpose && <InputError message={errors.purpose} />}
                </div>

                {/* 👇 Tampilkan hanya saat tambah baru */}
                {!isEdit && (
                    <>
                        <div>
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Start Time</Label>
                            <Input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>End Time</Label>
                            <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Room</Label>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={data.room_id}
                                onChange={(e) =>
                                    setData('room_id', e.target.value)
                                }
                            >
                                <option value="">Select a room</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                            {errors.room_id && (
                                <InputError message={errors.room_id} />
                            )}
                        </div>
                    </>
                )}

                <div>
                    <Label>Status</Label>
                    <select
                        className="w-full rounded border px-3 py-2"
                        value={data.status}
                        onChange={(e) =>
                            setData(
                                'status',
                                e.target.value as
                                    | 'approved'
                                    | 'pending'
                                    | 'cancelled'
                                    | 'rejected',
                            )
                        }
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    {errors.status && <InputError message={errors.status} />}
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                {isEdit ? (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        Delete
                    </Button>
                ) : (
                    <div />
                )}

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                    <Transition show={recentlySuccessful}>
                        <p className="text-sm text-green-600">Saved.</p>
                    </Transition>
                </div>
            </div>
        </form>
    );
}
