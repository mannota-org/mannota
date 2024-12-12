import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const guidelineRouter = createTRPCRouter({
  fetchGuidelines: publicProcedure.query(async () => {
    const guidelines = await db.guidelines.findMany({
      select: {
        taskGuidelineShort: true,
        taskGuidelineLong: true,
        annotationGuidelineShort: true,
        annotationGuidelineLong: true,
        updatedAt: true,
      },
    });

    return guidelines.map((guideline) => ({
      ...guideline,
      updatedAtFormatted: guideline.updatedAt.toLocaleDateString(),
    }));
  }),
});

export default guidelineRouter;
