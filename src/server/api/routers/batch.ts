import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const batchRouter = createTRPCRouter({
  fetchBatchInfo: publicProcedure.query(async () => {
    const batches = await db.batch.findMany({
      orderBy: {
        index: "asc",
      },
      select: {
        id: true,
        index: true, // batch number
        performance: true,
        confidence: true,
        updatedAt: true,
      },
    });

    return batches.map((batch) => ({
      ...batch,
      updatedAtFormatted: batch.updatedAt.toLocaleDateString(),
    }));
  }),

  addBatch: publicProcedure
    .input(
      z.object({
        index: z.number(),
        confidence: z.number(),
        performance: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const batch = await db.batch.create({
        data: {
          index: input.index,
          confidence: input.confidence,
          performance: input.performance,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return batch;
    }),

  updateBatchPerformance: publicProcedure
    .input(z.object({ batchId: z.string() }))
    .mutation(async ({ input }) => {
      const performanceScore = Math.round(Math.random() * 10) / 10;
      await db.batch.update({
        where: { id: input.batchId },
        data: {
          performance: performanceScore,
          confidence: 1, // Set confidence to 1
        },
      });
      return { success: true, performance: performanceScore };
    }),

  fetchNextBatch: publicProcedure.query(async () => {
    const settings = await db.settings.findFirst();
    if (!settings) {
      throw new Error("Settings not configured.");
    }

    const batch = await db.batch.findFirst({
      where: {
        confidence: {
          lt: settings.confidenceThreshold,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!batch) {
      return { medicalText: [], batch: null, message: "Annotation completed" };
    }

    const medicalText = await db.medicalTextData.findMany({
      where: {
        batchId: batch.id,
        confidence: {
          lt: 1,
        },
      },
      take: 1,
    });

    const totalTextInBatch = await db.medicalTextData.count({
      where: { batchId: batch.id },
    });

    const textLeftToAnnotate = await db.medicalTextData.count({
      where: {
        batchId: batch.id,
        confidence: {
          lt: 1,
        },
      },
    });

    return {
      medicalText,
      batch,
      textLeftToAnnotate,
      totalTextInBatch,
    };
  }),
});

export default batchRouter;
