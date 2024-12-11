import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
  checkUserExists: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const { email } = input;
      const existingUser = await db.user.findUnique({ where: { email } });
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
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) return null; // User already exists
      const newUser = await db.user.create({
        data: { email, name: fullName, role, medicalTexts: { create: [] } },
      });
      return newUser;
    }),

  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const { email } = input;
      const user = await db.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, role: true },
      });
      return user;
    }),
});

export default userRouter;