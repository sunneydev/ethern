import {
  sqliteTable,
  index,
  uniqueIndex,
  text,
  integer,
  int,
} from "drizzle-orm/sqlite-core";
import { isNotNull, relations, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export const updates = sqliteTable(
  "updates",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    runtimeVersion: text("runtime_version").notNull(),
    platform: text("platform", { enum: ["all", "ios", "android"] })
      .notNull()
      .default("all"),
    projectId: int("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    deletedAt: int("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    projectIdIdx: index("updates_project_id_idx").on(table.projectId),
    createdAtIdx: index("updates_created_at_idx").on(table.createdAt),
  }),
);

export const projects = sqliteTable(
  "projects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    uid: text("uid").notNull().unique(),
    projectId: text("project_id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    teamId: integer("team_id").references(() => teams.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
    size: integer("size").notNull().default(0),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    deletedAt: int("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    uidKey: uniqueIndex("projects_uid_key").on(table.uid),
    uidOwnerIdKey: uniqueIndex("projects_uid_owner_id_key").on(
      table.uid,
      table.ownerId,
    ),
    nameCreatedAtIdx: index("projects_name_created_at_idx").on(
      table.name,
      table.createdAt,
    ),
    namePublisherIdKey: uniqueIndex("projects_name_publisher_id_key").on(
      table.name,
      table.ownerId,
    ),
    projectIdKey: uniqueIndex("projects_project_id_key").on(table.projectId),
    teamIdIdx: index("projects_team_id_idx").on(table.teamId),
  }),
);

export const blobs = sqliteTable(
  "blobs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    hash: text("hash").notNull(),
    size: integer("size").notNull(),
  },
  (table) => ({ hashKey: uniqueIndex("blobs_hash_key").on(table.hash) }),
);

export const assets = sqliteTable(
  "assets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    refCount: integer("ref_count").default(1).notNull(),
    blobId: integer("blob_id")
      .notNull()
      .references(() => blobs.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => ({
    projectIdBlobIdKey: uniqueIndex("assets_project_id_blob_id_key").on(
      table.projectId,
      table.blobId,
    ),
    projectIdCreatedAtIdx: index("assets_project_id_created_at_idx").on(
      table.projectId,
      table.createdAt,
    ),
    projectIdIdx: index("assets_user_id_idx").on(table.projectId),
    blobIdIdx: index("assets_blob_id_idx").on(table.blobId),
  }),
);

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    onboarded: integer("onboarded", { mode: "boolean" }).default(false),
    customerId: text("customer_id"),
    oauthId: text("oauth_id"),
    username: text("username").notNull(),
    avatarUrl: text("avatar_url"),
    verified: integer("verified", { mode: "boolean" }).default(false).notNull(),
    plan: text("plan", { enum: ["free", "starter", "pro", "admin"] })
      .notNull()
      .default("free"),
    provider: text("provider", { enum: ["google", "github"] }),
    email: text("email").notNull(),
    password: text("password"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    deletedAt: int("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    createdAtIdx: index("users_created_at_idx").on(table.createdAt),
    customerIdx: index("users_customer_id_idx").on(table.customerId),
    emailKey: uniqueIndex("users_email_key").on(table.email),
    oauthIdProviderKey: uniqueIndex("users_oauth_id_provider_key").on(
      table.oauthId,
      table.provider,
    ),
    usernameKey: uniqueIndex("users_username_key").on(table.username),
  }),
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid(32)),
    device: text("device"),
    location: text("location"),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    teamId: integer("team_id").references(() => teams.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
    expiresAt: int("expires_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)),
    createdAt: int("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    createdAtIdx: index("sessions_created_at_idx").on(table.createdAt),
    expiresAtIdx: index("sessions_expires_at_idx").on(table.expiresAt),
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  }),
);

export const teams = sqliteTable(
  "teams",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    name: text("name").notNull(),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    deletedAt: int("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    nameKey: uniqueIndex("teams_name_key").on(table.name),
    ownerIdIdx: index("teams_owner_id_idx").on(table.ownerId),
  }),
);

export const teamMembers = sqliteTable(
  "team_members",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => ({
    teamUserIdx: uniqueIndex("team_members_team_id_user_id_idx").on(
      table.teamId,
      table.userId,
    ),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  projects: many(projects),
  teams: many(teams),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [projects.teamId],
    references: [teams.id],
  }),
  assets: many(assets),
  updates: many(updates),
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  blob: one(blobs, {
    fields: [assets.blobId],
    references: [blobs.id],
  }),
  project: one(projects, {
    fields: [assets.projectId],
    references: [projects.id],
  }),
}));

export const blobsRelations = relations(blobs, ({ many }) => ({
  assets: many(assets),
}));

export const updatesRelations = relations(updates, ({ one }) => ({
  project: one(projects, {
    fields: [updates.projectId],
    references: [projects.id],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
  }),
  members: many(users),
  projects: many(projects),
}));
