import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const medicalTextRouter = createTRPCRouter({
  addMedicalText: publicProcedure
    .input(
      z.object({
        originalText: z.string(),
        task: z.string(),
        confidence: z.number(),
        annotateReason: z.string().optional(),
        annotateTime: z.number(),
        userId: z.string().optional(),
        batchId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const medicalText = await db.medicalTextData.create({
        data: {
          ...input,
          annotateReason: input.annotateReason || null,
          userId: input.userId || null,
          batchId: input.batchId || null,
        },
      });
      return medicalText;
    }),

  fetchMedicalText: publicProcedure.query(async () => {
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

  updateMedicalText: publicProcedure
    .input(
      z.object({
        id: z.string(),
        annotatedText: z.string(),
        confidence: z.number().default(1),
        annotateReason: z.string(),
        annotateTime: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        id,
        annotatedText,
        confidence,
        annotateReason,
        annotateTime,
        userId,
      } = input;

      const updatedMedicalText = await db.medicalTextData.update({
        where: { id },
        data: {
          annotatedText,
          confidence,
          annotateReason,
          annotateTime,
          userId,
          updatedAt: new Date(),
        },
      });
      return updatedMedicalText;
    }),
});

export default medicalTextRouter;
