// import ViewRoom from '@/components/reservation-calendar';
import { ChartFacility } from '@/components/chart/facility';
import { ChartRoom } from '@/components/chart/room';
import RoomDataTable from '@/components/room-table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Facility, type BreadcrumbItem, type Room } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Room({
    rooms,
    facilities,
}: {
    rooms: Room[];
    facilities: Facility[];
}) {
    console.log(rooms);
    console.log(facilities);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartRoom rooms={rooms} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartFacility facilities={facilities} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* <ChartUser /> */}
                    </div>
                </div>
                {/* <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div> */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-5 md:min-h-min dark:border-sidebar-border">
                    <RoomDataTable data={rooms} facilities={facilities} />
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-5 md:min-h-min dark:border-sidebar-border">
                    {/* <ViewRoom /> */}
                </div>
            </div>
        </AppLayout>
    );
}
