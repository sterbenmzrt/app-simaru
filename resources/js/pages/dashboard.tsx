import { ChartReservation } from '@/components/chart/reservation';
import { ChartRoom } from '@/components/chart/room';
import ReservationCalendar from '@/components/reservation-calendar';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    type BreadcrumbItem,
    type Reservation,
    type Room,
    type User,
} from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    user,
    reservations,
    userReservations,
    rooms,
    cans,
}: {
    user: User;
    reservations: Reservation[];
    userReservations: Reservation[];
    rooms: Room[];
    cans: { [key: string]: boolean };
}) {
    const role = user.roles[0]?.name;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative h-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {role === 'Approver' ? (
                            <ChartReservation
                                reservations={reservations}
                                cans={cans}
                            />
                        ) : (
                            <ChartReservation
                                reservations={userReservations}
                                cans={cans}
                            />
                        )}
                    </div>
                    <div className="relative h-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartRoom rooms={rooms} />
                    </div>
                    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <span className="p-4 text-muted-foreground">
                            Coming Soon
                        </span>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
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
