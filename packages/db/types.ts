import type {
  assets,
  blobs,
  getDB,
  projects,
  sessions,
  updates,
  users,
} from ".";

export type DB = ReturnType<typeof getDB>;

export type NewUser = typeof users.$inferInsert;
export type NewSession = typeof sessions.$inferInsert;
export type NewBlob = typeof blobs.$inferInsert;
export type NewProject = typeof assets.$inferInsert;
export type NewAsset = typeof assets.$inferInsert;
export type NewUpdate = typeof updates.$inferInsert;

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Blob = typeof blobs.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type Update = typeof updates.$inferSelect;

export type ProjectWithUpdates = Project & { updates: Update[] };
export type UserWithProjects = User & { projects: ProjectWithUpdates[] };
export type UserWithSessions = User & { sessions: Session[] };
export type UserWithAssets = User & { assets: Asset[] };
export type UserWithBlobs = User & { blobs: Blob[] };
export type UserWithUpdates = User & { updates: Update[] };
export type UpdateWithProjectName = Update & { project: { name: string } };
