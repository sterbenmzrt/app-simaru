'use client';

import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

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
import { Room } from '@/types';

export function ChartRoom({ rooms }: { rooms: Room[] }) {
    const chartData = rooms.map((room, index) => ({
        name: room.name,
        capacity: room.capacity,
        fill: `var(--chart-${index + 1})`,
    }));

    const chartConfig = rooms.reduce((acc, room, index) => {
        acc[room.name] = {
            label: room.name,
            color: `var(--chart-${index + 1})`,
        };
        return acc;
    }, {} as ChartConfig);

    chartConfig['capacity'] = { label: 'Capacity' };

    const totalCapacity = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.capacity, 0);
    }, [chartData]);

    const topRoom = React.useMemo(() => {
        return chartData.reduce(
            (prev, curr) => (curr.capacity > prev.capacity ? curr : prev),
            chartData[0],
        );
    }, [chartData]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Room Capacity Overview</CardTitle>
                <CardDescription>
                    Based on total capacity per room
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
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
                            dataKey="capacity"
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
                                                    {totalCapacity.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total Capacity
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Largest room:{' '}
                    <span className="font-semibold">{topRoom.name}</span> (
                    {topRoom.capacity} capacity){' '}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total of {rooms.length} rooms with combined capacity of{' '}
                    {totalCapacity}
                </div>
            </CardFooter>
        </Card>
    );
}
