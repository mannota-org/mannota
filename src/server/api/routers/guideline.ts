import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const guidelineRouter = createTRPCRouter({
  fetchGuidelines: publicProcedure.query(async () => {
    const guidelines = await db.guidelines.findMany({
      select: {
        shortGuideline: true,
        longGuideline: true,
        updatedAt: true,
      },
    });

    return guidelines.map((guideline) => ({
      ...guideline,
      updatedAtFormatted: guideline.updatedAt.toLocaleDateString(),
    }));
  }),

  updateGuidelines: publicProcedure
    .input(
      z.object({
        id: z.string(),
        shortGuideline: z.string(),
        longGuideline: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, shortGuideline, longGuideline } = input;

      const updatedGuideline = await db.guidelines.update({
        where: { id },
        data: {
          shortGuideline,
          longGuideline,
        },
      });

      return updatedGuideline;
    }),

  updateGuideline: publicProcedure
    .input(
      z.object({
        shortGuideline: z.string(),
        longGuideline: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { shortGuideline, longGuideline } = input;

      // Get the first guideline record or create if none exists
      const guideline = await db.guidelines.findFirst();

      if (guideline) {
        return await db.guidelines.update({
          where: { id: guideline.id },
          data: { shortGuideline, longGuideline },
        });
      } else {
        return await db.guidelines.create({
          data: { shortGuideline, longGuideline },
        });
      }
    }),
});

export default guidelineRouter;
