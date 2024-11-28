import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import userRouter from "@/server/api/routers/user";
import { settings } from ".eslintrc.cjs";
import settingsRouter from "@/server/api/routers/settings";
import medicalTextRouter from "@/server/api/routers/medicalText";
import batchRouter from "@/server/api/routers/batch";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  settings: settingsRouter,
  medicalText: medicalTextRouter,
  batch: batchRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
