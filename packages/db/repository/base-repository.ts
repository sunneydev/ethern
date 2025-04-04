import type { DB } from "../types";

export class BaseRepository {
  constructor(protected db: DB) {}
}
