'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

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
  
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2; // Add 20% padding
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [data]);

  return (
    <Card className="flex flex-col bg-muted/30 border-border/30">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div className='flex items-center gap-2'>
           <Icon className={`h-6 w-6`} style={{ color: chartConfig[dataKey].color }} />
           <CardTitle className="text-base font-medium">{title}</CardTitle>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums" style={{ color: chartConfig[dataKey].color }}>
            {currentValue.toFixed(0)}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 -mx-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[dataKey].color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={chartConfig[dataKey].color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <YAxis domain={yDomain} hide={true} />
              <XAxis dataKey="time" hide={true} />
              <Tooltip
                cursor={{ stroke: `hsl(var(--foreground))`, strokeWidth: 1, strokeDasharray: "3 3" }}
                content={<ChartTooltipContent 
                    indicator="dot" 
                    labelClassName="font-bold"
                    className="bg-card/80 backdrop-blur-sm"
                />}
              />
              <Area
                dataKey="value"
                type="monotone"
                stroke={chartConfig[dataKey].color}
                strokeWidth={2.5}
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
