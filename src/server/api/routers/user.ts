import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
  checkUserExists: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const { email } = input;

      // Check if a user with the given email already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      return existingUser ? true : false;
    }),

  checkAndCreateUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        fullName: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, fullName, role } = input;

      // Check if a user with the given email already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return null; // User already exists
      }

      // Create a new user if not found
      const newUser = await db.user.create({
        data: {
          email,
          name: fullName,
          role,
          medicalTexts: { create: [] }, // empty array for MedicalTextData[]
        },
      });

      return newUser;
    }),
});

export default userRouter;
