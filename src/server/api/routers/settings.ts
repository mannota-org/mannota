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
      try {
        const { newBatchSize } = input;
        console.log("Starting batch reassessment with size:", newBatchSize);

        const allTexts = await db.medicalTextData.findMany({
          orderBy: { createdAt: "asc" },
        });
        console.log("Found total texts:", allTexts.length);

        await db.batch.deleteMany({});
        console.log("Deleted existing batches");

        // Process in chunks of 100 texts at a time
        const chunkSize = 100;
        for (
          let startIdx = 0;
          startIdx < allTexts.length;
          startIdx += chunkSize
        ) {
          const textChunk = allTexts.slice(startIdx, startIdx + chunkSize);

          // Process each chunk in batches
          for (let i = 0; i < textChunk.length; i += newBatchSize) {
            const batchTexts = textChunk.slice(i, i + newBatchSize);
            const batchIndex = Math.floor((startIdx + i) / newBatchSize) + 1;

            const newBatch = await db.batch.create({
              data: {
                confidence: parseFloat((Math.random() * 1).toFixed(1)),
                performance: parseFloat((Math.random() * 1).toFixed(1)),
                index: batchIndex,
              },
            });

            // Update texts in smaller chunks
            const updatePromises = batchTexts.map((text) =>
              db.medicalTextData.update({
                where: { id: text.id },
                data: { batchId: newBatch.id },
              }),
            );

            await Promise.all(updatePromises);
            console.log(`Processed batch ${batchIndex}`);
          }
        }

        return { success: true };
      } catch (error) {
        console.error("Batch reassessment error:", error);
        throw new Error(
          error instanceof Error
            ? `Batch reassessment failed: ${error.message}`
            : "Batch reassessment failed",
        );
      }
    }),
});

export default settingsRouter;
