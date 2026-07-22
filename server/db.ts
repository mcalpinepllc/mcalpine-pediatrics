import { and, count, desc, eq, gt, isNull, lte, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertPracticeNotice,
  InsertUser,
  noticeViews,
  practiceNotices,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

function requireDb<T>(db: T | null): T {
  if (!db) throw new Error("Database is unavailable");
  return db;
}

const activeNoticeWhere = (now: Date) =>
  and(
    isNull(practiceNotices.archivedAt),
    lte(practiceNotices.publishedAt, now),
    or(isNull(practiceNotices.expiresAt), gt(practiceNotices.expiresAt, now)),
  );

export async function listActivePracticeNoticesForUser(userId: number, now = new Date()) {
  const db = requireDb(await getDb());
  return db
    .select({
      id: practiceNotices.id,
      title: practiceNotices.title,
      body: practiceNotices.body,
      priority: practiceNotices.priority,
      publishedAt: practiceNotices.publishedAt,
      expiresAt: practiceNotices.expiresAt,
      viewedAt: noticeViews.viewedAt,
    })
    .from(practiceNotices)
    .leftJoin(
      noticeViews,
      and(eq(noticeViews.noticeId, practiceNotices.id), eq(noticeViews.userId, userId)),
    )
    .where(activeNoticeWhere(now))
    .orderBy(desc(practiceNotices.publishedAt));
}

export async function listAllPracticeNotices() {
  const db = requireDb(await getDb());
  return db.select().from(practiceNotices).orderBy(desc(practiceNotices.publishedAt));
}

export async function getPracticeNoticeById(noticeId: number) {
  const db = requireDb(await getDb());
  const [notice] = await db
    .select()
    .from(practiceNotices)
    .where(eq(practiceNotices.id, noticeId))
    .limit(1);
  return notice;
}

export async function createPracticeNotice(values: InsertPracticeNotice) {
  const db = requireDb(await getDb());
  const [result] = await db.insert(practiceNotices).values(values).$returningId();
  if (!result?.id) throw new Error("Practice notice was not created");
  return getPracticeNoticeById(result.id);
}

export async function archivePracticeNotice(noticeId: number) {
  const db = requireDb(await getDb());
  await db
    .update(practiceNotices)
    .set({ archivedAt: new Date() })
    .where(eq(practiceNotices.id, noticeId));
}

export async function markPracticeNoticeViewed(noticeId: number, userId: number) {
  const db = requireDb(await getDb());
  const [existing] = await db
    .select({ id: noticeViews.id })
    .from(noticeViews)
    .where(and(eq(noticeViews.noticeId, noticeId), eq(noticeViews.userId, userId)))
    .limit(1);

  const viewedAt = new Date();
  if (existing) {
    await db.update(noticeViews).set({ viewedAt }).where(eq(noticeViews.id, existing.id));
    return { noticeId, viewedAt };
  }

  await db.insert(noticeViews).values({ noticeId, userId, viewedAt });
  return { noticeId, viewedAt };
}

export async function getUnreadPracticeNoticeCount(userId: number, now = new Date()) {
  const db = requireDb(await getDb());
  const [result] = await db
    .select({ value: count() })
    .from(practiceNotices)
    .leftJoin(
      noticeViews,
      and(eq(noticeViews.noticeId, practiceNotices.id), eq(noticeViews.userId, userId)),
    )
    .where(and(activeNoticeWhere(now), isNull(noticeViews.id)));
  return Number(result?.value ?? 0);
}
