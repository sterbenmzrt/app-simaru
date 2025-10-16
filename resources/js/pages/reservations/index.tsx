import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Head } from '@inertiajs/react';

import { ChartRoom } from '@/components/chart/room';
// import ReservationDataTable from '@/components/reservation-table';
import { ChartReservation } from '@/components/chart/reservation';
import ReservationCalendar from '@/components/reservation-calendar';
import {
    type BreadcrumbItem,
    type Reservation,
    type Room,
    type Schedule,
    type User,
} from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function ReservationPage({
    reservations,
    rooms,
    // schedules,
    // users,
    cans,
    user,
}: {
    reservations: Reservation[];
    rooms: Room[];
    schedules: Schedule[];
    users: User[];
    cans: { [key: string]: boolean };
    role: string;
    user: User;
}) {
    const role = user.roles[0]?.name;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservations" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Chart Section */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartRoom rooms={rooms} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartReservation reservations={reservations} />
                    </div>
                    <div className="relative flex items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* You can put another chart here later */}
                        <span className="p-4 text-muted-foreground">
                            Coming Soon
                        </span>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-5 md:min-h-min dark:border-sidebar-border">
                    {/* <ReservationDataTable data={reservations} /> */}
                    <ReservationCalendar
                        reservations={reservations}
                        rooms={rooms}
                        cans={cans}
                        role={role}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
