import { ChartFacility } from '@/components/chart/facility';
import FacilityDataTable from '@/components/facility-table';
import AppLayout from '@/layouts/app-layout';
import { facilities as facilitiesRoute } from '@/routes';
import { type BreadcrumbItem, type Facility } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Facilities',
        href: facilitiesRoute().url,
    },
];

export default function FacilitiesIndex({
    facilities,
}: {
    facilities: Facility[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Facilities" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartFacility facilities={facilities} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* Bisa diisi komponen tambahan, misal chart lain */}
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* Bisa diisi komponen tambahan */}
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-5 md:min-h-min dark:border-sidebar-border">
                    <FacilityDataTable data={facilities} />
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-5 md:min-h-min dark:border-sidebar-border">
                    {/* Placeholder untuk komponen lain jika perlu */}
                </div>
            </div>
        </AppLayout>
    );
}
