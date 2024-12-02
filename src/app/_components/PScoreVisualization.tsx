"use client";

import { api } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import * as React from "react";

const PScoreVisualization: React.FC = () => {
  const { data: batches, isLoading } =
    api.batch.fetchBatchPerformances.useQuery();

  React.useEffect(() => {
    if (batches === undefined || batches.length === 0) {
      console.warn("No batch performance data available");
    }
  }, [batches]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="relative h-full w-full items-center justify-center bg-white bg-dot-black/[0.4] dark:bg-black dark:bg-dot-white/[0.4]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>
        <h2 className="primary relative z-20 bg-gradient-to-b from-neutral-400 to-neutral-700 bg-clip-text pb-12 pt-24 text-center text-5xl font-bold text-transparent">
          Batch Performance Scores
        </h2>
      </div>

      <div className="px-8 py-4">
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
      </div>
    </div>
  );
};

export default PScoreVisualization;
