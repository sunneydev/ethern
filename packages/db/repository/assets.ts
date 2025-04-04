import { eq, sql, inArray } from "drizzle-orm";
import { assets, type Asset, type NewAsset, blobs } from "..";
import { BaseRepository } from "./base-repository";

export class Assets extends BaseRepository {
  async create({
    projectId,
    blobHash,
    size,
  }: {
    projectId: number;
    blobHash: string;
    size: number;
  }): Promise<number> {
    const [, insertedAssets] = await this.db.batch([
      this.db.insert(blobs).values({ hash: blobHash, size }),
      this.db
        .insert(assets)
        .values({ projectId, blobId: sql`last_insert_rowid()` })
        .returning({ assetId: assets.id }),
    ]);

    return insertedAssets[0].assetId;
  }

  async findByUserId(userId: number): Promise<Asset[]> {
    const result = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: { projects: { with: { assets: true } } },
    });

    return result?.projects.flatMap((project) => project.assets) ?? [];
  }

  async incrementRefCount({
    blobId,
    blobHashes,
  }: {
    blobId?: number;
    blobHashes?: string[];
  }) {
    if (!blobId && !blobHashes) {
      throw new Error("blobId or blobHashes must be provided");
    }

    if (blobHashes) {
      return this.db
        .update(assets)
        .set({ refCount: sql`${assets.refCount} + 1` })
        .where(
          inArray(
            assets.blobId,
            this.db
              .select({ id: blobs.id })
              .from(blobs)
              .where(inArray(blobs.hash, blobHashes)),
          ),
        );
    }

    if (blobId) {
      return this.db
        .update(assets)
        .set({ refCount: sql`${assets.refCount} + 1` })
        .where(eq(assets.blobId, blobId));
    }
  }

  async decrementRefCount({
    blobId,
    blobHashes,
  }: {
    blobId?: number;
    blobHashes?: string[];
  }) {
    if (!blobId && !blobHashes) {
      throw new Error("blobId or blobHashes must be provided");
    }

    if (blobHashes) {
      return this.db
        .update(assets)
        .set({ refCount: sql`${assets.refCount} - 1` })
        .where(
          inArray(
            assets.blobId,
            this.db
              .select({ id: blobs.id })
              .from(blobs)
              .where(inArray(blobs.hash, blobHashes)),
          ),
        );
    }

    if (blobId) {
      return this.db
        .update(assets)
        .set({ refCount: sql`${assets.refCount} - 1` })
        .where(eq(assets.blobId, blobId));
    }
  }

  async delete(assetId: number): Promise<void> {
    await this.db.delete(assets).where(eq(assets.id, assetId));
  }

  async deleteUnused(): Promise<void> {
    await this.db.delete(assets).where(eq(assets.refCount, 0));
  }
}
