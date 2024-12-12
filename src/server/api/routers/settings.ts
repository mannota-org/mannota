import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const settingsRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async () => {
    const settings = await db.settings.findFirst();
    return settings;
  }),

  updateSettings: publicProcedure
    .input(
      z.object({
        id: z.string(),
        confidenceThreshold: z.number().min(0).max(1),
        dataPerBatch: z.number().positive(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, confidenceThreshold, dataPerBatch } = input;

      const updatedSettings = await db.settings.update({
        where: { id },
        data: {
          confidenceThreshold,
          dataPerBatch,
        },
      });

      return updatedSettings;
    }),

  reassessBatches: publicProcedure
    .input(
      z.object({
        newBatchSize: z.number().positive(),
      }),
    )
    .mutation(async ({ input }) => {
      const { newBatchSize } = input;

      const allTexts = await db.medicalTextData.findMany({
        orderBy: { createdAt: "asc" },
      });

      await db.batch.deleteMany({});

      for (let i = 0; i < allTexts.length; i += newBatchSize) {
        const batchTexts = allTexts.slice(i, i + newBatchSize);
        const randomConfidence = parseFloat((Math.random() * 1).toFixed(1));
        const randomPerformance = parseFloat((Math.random() * 1).toFixed(1));
        const newBatch = await db.batch.create({
          data: {
            confidence: randomConfidence,
            performance: randomPerformance,
            index: Math.floor(i / newBatchSize) + 1,
          },
        });

        await Promise.all(
          batchTexts.map((text) =>
            db.medicalTextData.update({
              where: { id: text.id },
              data: { batchId: newBatch.id },
            }),
          ),
        );
      }

      return { success: true };
    }),
});

export default settingsRouter;
