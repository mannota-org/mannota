"use client";

import { api } from "@/trpc/react";
import { GitCommitVertical } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import * as React from "react";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

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
  const { data: batches, isLoading } =
    api.batch.fetchBatchPerformances.useQuery();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const chartData = React.useMemo(() => {
    return (
      batches?.map((batch) => ({
        batchIndex: `Batch ${batch.index}`,
        performance: Number(batch.performance.toFixed(1)),
        updatedAt: formatDate(batch.updatedAtFormatted),
      })) ?? []
    );
  }, [batches]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col">
      <div className="relative flex h-32 flex-shrink-0 items-center justify-center bg-white bg-dot-black/[0.4] dark:bg-black dark:bg-dot-white/[0.4] sm:h-40">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>
        <h2 className="relative z-20 bg-gradient-to-b from-neutral-400 to-neutral-700 bg-clip-text pt-12 text-center text-3xl font-bold text-transparent sm:text-5xl">
          Annotation Analysis
        </h2>
      </div>

      <div className="flex flex-1 overflow-hidden px-8 pb-8">
        <Card className="flex w-full flex-col">
          <CardHeader className="flex-shrink-0 pb-4 sm:pb-6">
            <CardTitle>Batch Performance Scores Analysis</CardTitle>
          </CardHeader>
          <CardContent className="mr-2 min-h-0 flex-1 pl-0">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="batchIndex"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={12}
                  interval={0}
                  padding={{ right: 18, left: 18 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  domain={[0, 1]}
                  ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
                  fontSize={12}
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
                        <div className="text-md font-bold">
                          {data.payload.batchIndex}
                        </div>
                        <div className="text-muted-foreground">
                          Score: {data.value}
                        </div>
                        <div className="text-muted-foreground">
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
                  dot={({
                    cx,
                    cy,
                    payload,
                  }: {
                    cx: number;
                    cy: number;
                    payload: ChartDataPoint;
                  }) => {
                    const r = 25;
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
      </div>
    </div>
  );
};

export default PScoreVisualization;
