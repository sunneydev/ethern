import { eq, inArray } from "drizzle-orm";
import { blobs, type NewBlob } from "..";
import { BaseRepository } from "./base-repository";

export class Blobs extends BaseRepository {
  async create(blob: NewBlob) {
    return this.db
      .insert(blobs)
      .values(blob)
      .returning({ insertedId: blobs.id })
      .then((result) => result[0]);
  }

  async findByHash(hash: string) {
    return this.db.query.blobs.findFirst({
      where: (blobs, { eq }) => eq(blobs.hash, hash),
    });
  }

  async delete(hash: string): Promise<void> {
    await this.db.delete(blobs).where(eq(blobs.hash, hash));
  }

  async findUnusedHashes(hashes: string[]) {
    const usedHashes = await this.db.query.blobs.findMany({
      where: inArray(blobs.hash, hashes),
    });

    const usedHashesSet = new Set(usedHashes.map((hash) => hash.hash));

    return hashes.filter((hash) => !usedHashesSet.has(hash));
  }
}
