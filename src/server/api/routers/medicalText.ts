import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

const formatRole = (role: string) => {
  return role
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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
          annotateReason: input.annotateReason ?? null,
          userId: input.userId ?? null,
          batchId: input.batchId ?? null,
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

  checkTextConfidence: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const text = await db.medicalTextData.findUnique({
        where: { id: input.id },
        select: { confidence: true },
      });
      return { confidence: text?.confidence ?? 0 };
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
      const currentText = await db.medicalTextData.findUnique({
        where: { id: input.id },
        select: { confidence: true },
      });

      if (currentText?.confidence === 1) {
        throw new Error("This text has already been annotated");
      }

      const updatedMedicalText = await db.medicalTextData.update({
        where: { id: input.id },
        data: {
          annotatedText: input.annotatedText,
          confidence: input.confidence,
          annotateReason: input.annotateReason,
          annotateTime: input.annotateTime,
          userId: input.userId,
          updatedAt: new Date(),
        },
      });
      return updatedMedicalText;
    }),

  fetchAnnotationHistory: publicProcedure
    .input(
      z.object({
        page: z.number().min(1),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;

      const [history, totalCount] = await Promise.all([
        db.medicalTextData.findMany({
          where: {
            NOT: {
              annotatedText: "",
            },
          },
          skip: offset,
          take: limit,
          orderBy: { updatedAt: "desc" },
          include: {
            Batch: {
              select: { index: true, performance: true },
            },
            User: {
              select: { name: true, email: true, role: true },
            },
          },
        }),
        db.medicalTextData.count({
          where: {
            NOT: {
              annotatedText: "",
            },
          },
        }),
      ]);

      const formattedHistory = history.map((text) => {
        const updatedAtFormatted = [
          new Date(text.updatedAt).toLocaleString("en-GB", {
            timeZone: "Asia/Ho_Chi_Minh",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          new Date(text.updatedAt).toLocaleString("en-GB", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        ].join("\n");

        console.log(
          `Formatted updatedAt for ID ${text.id}:`,
          updatedAtFormatted,
        );

        return {
          ...text,
          Batch: `${text.Batch?.index ?? "N/A"}`,
          Performance: `${(text.Batch?.performance ?? 0).toFixed(1)}`,
          updatedAtFormatted,
          User: {
            ...text.User,
            role: formatRole(text.User?.role ?? ""),
          },
        };
      });

      return {
        history: formattedHistory,
        totalCount,
      };
    }),

  deleteAnnotations: publicProcedure.mutation(async () => {
    const textsToUpdate = await db.medicalTextData.findMany({
      where: {
        NOT: {
          annotatedText: "",
        },
      },
      take: 50,
    });

    const updates = textsToUpdate.map((text) =>
      db.medicalTextData.update({
        where: { id: text.id },
        data: {
          annotatedText: "",
          confidence: 0.1,
        },
      }),
    );

    await Promise.all(updates);
    return { count: updates.length };
  }),
});

export default medicalTextRouter;
