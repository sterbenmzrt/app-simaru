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
import { Role, User } from '@/types';

export function ChartUser({ users, roles }: { users: User[]; roles: Role[] }) {
    const chartData = roles.map((role, index) => {
        const count = users.filter((user) =>
            user.roles.some((r) => r.id === role.id),
        ).length;

        return {
            role: role.name,
            users: count,
            fill: `var(--chart-${index + 1})`, // Customize with CSS variables
        };
    });

    const chartConfig = roles.reduce((acc, role, index) => {
        acc[role.name] = {
            label: role.name,
            color: `var(--chart-${index + 1})`,
        };
        return acc;
    }, {} as ChartConfig);

    chartConfig['users'] = { label: 'Users' };

    const totalUsers = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.users, 0);
    }, []);

    const topRole = React.useMemo(() => {
        return chartData.reduce((prev, curr) =>
            curr.users > prev.users ? curr : prev,
        );
    }, []);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Users per Role</CardTitle>
                <CardDescription>Based on current user roles</CardDescription>
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
                            dataKey="users"
                            nameKey="role"
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
                                                    {totalUsers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Users
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
                    Most users are{' '}
                    <span className="font-semibold">{topRole.role}</span> (
                    {topRole.users} users) <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total of {totalUsers} users across {roles.length} roles
                </div>
            </CardFooter>
        </Card>
    );
}
