'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type VitalChartProps = {
  title: string;
  unit: string;
  data: { time: string; value: number }[];
  dataKey: string;
  color: string;
  Icon: React.ElementType;
};

export default function VitalChart({ title, unit, data, dataKey, color, Icon }: VitalChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: title,
      color: `hsl(var(${color}))`,
    },
  } satisfies ChartConfig;

  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;
  const yDomain = [
      Math.min(...data.map(d => d.value)) - 10,
      Math.max(...data.map(d => d.value)) + 10
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div className='flex items-center gap-2'>
           <Icon className={`h-6 w-6 text-[${chartConfig[dataKey].color}]`} />
           <CardTitle className="text-base font-medium">{title}</CardTitle>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums">
            {currentValue}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[dataKey].color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[dataKey].color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <YAxis domain={yDomain} hide={true} />
              <XAxis dataKey="time" hide={true} />
              <Tooltip
                cursor={{ stroke: chartConfig[dataKey].color, strokeWidth: 1, strokeDasharray: "3 3" }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="value"
                type="monotone"
                stroke={chartConfig[dataKey].color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#fill-${dataKey})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
