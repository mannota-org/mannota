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
});

export default settingsRouter;
