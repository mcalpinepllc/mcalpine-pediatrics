import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * General practice notices only. This portal intentionally excludes medical
 * records, diagnoses, symptoms, clinical messages, and patient-specific PHI.
 */
export const practiceNotices = mysqlTable(
  "practiceNotices",
  {
    id: int("id").autoincrement().primaryKey(),
    authoredByUserId: int("authoredByUserId")
      .notNull()
      .references(() => users.id),
    title: varchar("title", { length: 160 }).notNull(),
    body: text("body").notNull(),
    priority: mysqlEnum("priority", ["routine", "important"])
      .default("routine")
      .notNull(),
    publishedAt: timestamp("publishedAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt"),
    archivedAt: timestamp("archivedAt"),
  },
  table => [index("practiceNotices_published_idx").on(table.publishedAt)],
);

export const noticeViews = mysqlTable(
  "noticeViews",
  {
    id: int("id").autoincrement().primaryKey(),
    noticeId: int("noticeId")
      .notNull()
      .references(() => practiceNotices.id),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    viewedAt: timestamp("viewedAt").defaultNow().notNull(),
  },
  table => [
    index("noticeViews_notice_user_idx").on(table.noticeId, table.userId),
    index("noticeViews_user_viewed_idx").on(table.userId, table.viewedAt),
  ],
);

export type PracticeNotice = typeof practiceNotices.$inferSelect;
export type InsertPracticeNotice = typeof practiceNotices.$inferInsert;
export type NoticeView = typeof noticeViews.$inferSelect;
export type InsertNoticeView = typeof noticeViews.$inferInsert;
