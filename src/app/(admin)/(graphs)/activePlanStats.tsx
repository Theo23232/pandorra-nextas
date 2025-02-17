'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import useSWR from 'swr';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { fetcher } from '@/lib/utils';

type ChartData = {
  plan: string;
  active: number;
};

const chartConfig = {
  active: {
    label: 'Active Users',
  },
  free: {
    label: 'Free',
    color: 'hsl(var(--chart-1))',
  },
  weeklyEco: {
    label: 'Weekly Eco',
    color: 'hsl(var(--chart-2))',
  },
  starterMonthly: {
    label: 'Starter Monthly',
    color: 'hsl(var(--chart-3))',
  },
  advancedMonthly: {
    label: 'Advanced Monthly',
    color: 'hsl(var(--chart-4))',
  },
  premiumMonthly: {
    label: 'Premium Monthly',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function ActivePlanStat() {
  const { data: chartData } = useSWR<ChartData[]>('/api/administration/stats/plan/active', fetcher);
  if (chartData) {
    const data = chartData?.map((item, index) => {
      const i = index + 1;
      return {
        plan: item.plan,
        active: item.active,
        fill: `hsl(var(--chart-${i}))`,
      };
    });

    return (
      <Card className='flex flex-col'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>Subscription Plans Distribution</CardTitle>
          <CardDescription>Active Users by Plan</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey='active' nameKey='plan' innerRadius={60} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                          <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-3xl font-bold'>
                            {chartData.reduce((acc, curr) => acc + curr.active, 0).toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground'>
                            Active Users
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
        <CardFooter className='flex-col gap-2 text-sm'>
          <div className='leading-none text-muted-foreground'>Showing active users across different subscription plans</div>
        </CardFooter>
      </Card>
    );
  }
}
