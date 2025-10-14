'use client';

import { Star } from 'lucide-react';
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
import { Facility } from '@/types';

export function ChartFacility({ facilities }: { facilities: Facility[] }) {
    const chartData = facilities.map((facility, index) => ({
        name: facility.name,
        count: 1,
        fill: `var(--chart-${index + 1})`,
    }));

    const chartConfig = facilities.reduce((acc, facility, index) => {
        acc[facility.name] = {
            label: facility.name,
            color: `var(--chart-${index + 1})`,
        };
        return acc;
    }, {} as ChartConfig);

    chartConfig['count'] = { label: 'Facilities' };

    const totalFacilities = facilities.length;

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Facility Overview</CardTitle>
                <CardDescription>Based on available facilities</CardDescription>
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
                            dataKey="count"
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
                                                    {totalFacilities}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total Facilities
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
                    <Star className="h-4 w-4 text-yellow-500" />
                    Showing {facilities.length} facilities
                </div>
                <div className="leading-none text-muted-foreground">
                    Each segment represents one facility type
                </div>
            </CardFooter>
        </Card>
    );
}
