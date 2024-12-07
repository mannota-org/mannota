"use client";

import { api } from "@/trpc/react";
import { GitCommitVertical, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import * as React from "react";
import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type ChartDataPoint = {
  batchIndex: string;
  performance: number;
  updatedAt: string;
};

const chartConfig = {
  performance: {
    label: "Performance Score",
    color: "hsl(142.1 76.2% 36.3%)",
  },
} satisfies ChartConfig;

const PScoreVisualization: React.FC = () => {
  const { data: batches, isLoading } = api.batch.fetchBatchPerformances.useQuery();

  const chartData = React.useMemo(() => {
    return batches?.map((batch) => ({
      batchIndex: `Batch ${batch.index}`,
      performance: Number(batch.performance.toFixed(1)),
      updatedAt: batch.updatedAtFormatted
    })) ?? [];
  }, [batches]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden p-8">
      <Card>
        <CardHeader>
          <CardTitle>Batch Performance Scores Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="batchIndex"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={40}
                domain={[0, 1]}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
              />
              <ChartTooltip
                cursor={false}
                content={(props: TooltipProps<ValueType, NameType>) => {
                  if (!props.active || !props.payload?.length) return null;
                  const data = props.payload[0] as unknown as {
                    payload: ChartDataPoint;
                    value: number;
                  };
                  if (!data) return null;
                  
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="font-medium">{data.payload.batchIndex}</div>
                      <div className="text-sm text-muted-foreground">
                        Score: {data.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated: {data.payload.updatedAt}
                      </div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="performance"
                stroke="hsl(142.1 76.2% 36.3%)"
                strokeWidth={2}
                dot={({ cx, cy, payload }: { 
                  cx: number; 
                  cy: number; 
                  payload: ChartDataPoint;
                }) => {
                  const r = 24;
                  return (
                    <GitCommitVertical
                      key={payload.batchIndex}
                      x={cx - r / 2}
                      y={cy - r / 2}
                      width={r}
                      height={r}
                      fill="hsl(var(--background))"
                      stroke="hsl(142.1 76.2% 36.3%)"
                    />
                  );
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* The table*/}
      {/* <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Batch Index</TableHead>
              <TableHead className="w-1/4">Performance Score</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches?.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell>{batch.index}</TableCell>
                <TableCell>{batch.performance.toFixed(1)}</TableCell>
                <TableCell>{batch.updatedAtFormatted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
};

export default PScoreVisualization;
