'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import { Reservation } from '@/types';
import React from 'react';
import ReservationDataTable from '../reservation-table';

export function ChartReservation({
    reservations,
    cans,
}: {
    reservations: Reservation[];
    cans: { [key: string]: boolean };
}) {
    // Hitung jumlah per status
    const statusCount: Record<string, number> = reservations.reduce(
        (acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    // Buat data untuk pie chart
    const chartData = Object.entries(statusCount).map(
        ([status, count], index) => ({
            name: status,
            value: count,
            fill: `var(--chart-${index + 1})`,
        }),
    );

    // Buat config untuk legenda warna/chart
    const chartConfig = Object.fromEntries(
        Object.entries(statusCount).map(([status], index) => [
            status,
            {
                label: status.charAt(0).toUpperCase() + status.slice(1),
                color: `var(--chart-${index + 1})`,
            },
        ]),
    ) as ChartConfig;

    const totalReservations = reservations.length;

    // Cari status terbanyak
    const topStatus = chartData.length
        ? chartData.reduce((prev, curr) =>
              curr.value > prev.value ? curr : prev,
          )
        : null;

    const [open, setOpen] = React.useState(false);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Reservation Status Overview</CardTitle>
                <CardDescription>
                    Distribution of reservations by status
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {chartData.length ? (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (
                                            viewBox &&
                                            'cx' in viewBox &&
                                            'cy' in viewBox
                                        ) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalReservations}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                        className="fill-muted-foreground"
                                                    >
                                                        Total Reservations
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                ) : (
                    <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        No reservation data available
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {topStatus ? (
                    <div className="flex items-center gap-2 font-medium">
                        Most common status:{' '}
                        <span className="font-semibold">{topStatus.name}</span>{' '}
                        ({topStatus.value} reservations)
                        <TrendingUp className="h-4 w-4" />
                    </div>
                ) : (
                    <div className="text-muted-foreground">
                        No reservation status found.
                    </div>
                )}

                <div className="text-muted-foreground">
                    Showing {totalReservations} reservations{' '}
                    {totalReservations > 0 && (
                        <span
                            onClick={() => setOpen(true)}
                            className="cursor-pointer text-sm text-muted-foreground underline hover:text-primary"
                        >
                            view detail
                        </span>
                    )}
                </div>
            </CardFooter>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[80vh] max-w-[90vw] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Reservasi</DialogTitle>
                        <DialogDescription>
                            Daftar lengkap reservasi
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-auto">
                        <ReservationDataTable data={reservations} cans={cans} />
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
