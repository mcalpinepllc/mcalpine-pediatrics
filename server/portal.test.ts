import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  archivePracticeNotice: vi.fn(),
  createPracticeNotice: vi.fn(),
  getPracticeNoticeById: vi.fn(),
  getUnreadPracticeNoticeCount: vi.fn(),
  listActivePracticeNoticesForUser: vi.fn(),
  listAllPracticeNotices: vi.fn(),
  markPracticeNoticeViewed: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: "admin" | "user" | null): TrpcContext {
  const user: AuthenticatedUser | null = role
    ? {
        id: role === "admin" ? 7 : 9,
        openId: `${role}-open-id`,
        email: `${role}@example.com`,
        name: role === "admin" ? "Practice Administrator" : "Portal User",
        loginMethod: "manus",
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("portal authorization and privacy boundaries", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requires authentication before returning the Doxy.me handoff", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.telehealth.launch()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns only the approved Doxy.me URL for an authenticated user", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    const result = await caller.telehealth.launch();
    expect(result.url).toBe("https://doxy.me/v2/check-in/drmcalpine");
    expect(result.launchedAt).toBeInstanceOf(Date);
  });

  it("prevents a patient-role account from publishing notices", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(
      caller.notices.create({
        title: "Office update",
        body: "The office will open at 1 PM.",
        priority: "routine",
        confirmedNonClinical: true,
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(dbMocks.createPracticeNotice).not.toHaveBeenCalled();
  });

  it("requires an administrator to affirm that a notice is non-clinical", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(
      caller.notices.create({
        title: "Office update",
        body: "The office will open at 1 PM.",
        priority: "routine",
        confirmedNonClinical: false,
      } as never),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(dbMocks.createPracticeNotice).not.toHaveBeenCalled();
  });

  it("trims and authors an attested notice with the administrator account", async () => {
    dbMocks.createPracticeNotice.mockResolvedValue({ id: 42 });
    const caller = appRouter.createCaller(createContext("admin"));
    await caller.notices.create({
      title: "  Holiday hours  ",
      body: "  The office will be closed Monday.  ",
      priority: "important",
      confirmedNonClinical: true,
    });

    expect(dbMocks.createPracticeNotice).toHaveBeenCalledWith(
      expect.objectContaining({
        authoredByUserId: 7,
        title: "Holiday hours",
        body: "The office will be closed Monday.",
        priority: "important",
        expiresAt: null,
      }),
    );
  });
});
