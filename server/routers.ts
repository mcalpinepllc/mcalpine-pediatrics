import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  archivePracticeNotice,
  createPracticeNotice,
  getPracticeNoticeById,
  getUnreadPracticeNoticeCount,
  listActivePracticeNoticesForUser,
  listAllPracticeNotices,
  markPracticeNoticeViewed,
} from "./db";

const DOXY_ME_WAITING_ROOM = "https://doxy.me/v2/check-in/drmcalpine";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  notices: router({
    inbox: protectedProcedure.query(async ({ ctx }) => {
      const [notices, unreadCount] = await Promise.all([
        listActivePracticeNoticesForUser(ctx.user.id),
        getUnreadPracticeNoticeCount(ctx.user.id),
      ]);
      return { notices, unreadCount };
    }),
    markViewed: protectedProcedure
      .input(z.object({ noticeId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const notice = await getPracticeNoticeById(input.noticeId);
        const now = new Date();
        const unavailable =
          !notice ||
          notice.archivedAt !== null ||
          notice.publishedAt > now ||
          (notice.expiresAt !== null && notice.expiresAt <= now);
        if (unavailable) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Notice is unavailable" });
        }
        return markPracticeNoticeViewed(input.noticeId, ctx.user.id);
      }),
    adminList: adminProcedure.query(() => listAllPracticeNotices()),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().trim().min(3).max(160),
          body: z.string().trim().min(3).max(5_000),
          priority: z.enum(["routine", "important"]).default("routine"),
          publishedAt: z.date().optional(),
          expiresAt: z.date().nullable().optional(),
          confirmedNonClinical: z.literal(true),
        }),
      )
      .mutation(({ ctx, input }) =>
        createPracticeNotice({
          authoredByUserId: ctx.user.id,
          title: input.title,
          body: input.body,
          priority: input.priority,
          publishedAt: input.publishedAt ?? new Date(),
          expiresAt: input.expiresAt ?? null,
        }),
      ),
    archive: adminProcedure
      .input(z.object({ noticeId: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const notice = await getPracticeNoticeById(input.noticeId);
        if (!notice) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Notice was not found" });
        }
        await archivePracticeNotice(input.noticeId);
        return { success: true } as const;
      }),
  }),
  telehealth: router({
    launch: protectedProcedure.mutation(({ ctx }) => {
      const launchedAt = new Date();
      console.info("[Portal] Telehealth handoff opened", {
        userId: ctx.user.id,
        launchedAt: launchedAt.toISOString(),
        destination: "doxy.me",
      });
      return { url: DOXY_ME_WAITING_ROOM, launchedAt };
    }),
  }),
});

export type AppRouter = typeof appRouter;
