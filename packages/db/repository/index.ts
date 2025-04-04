import { BaseRepository } from "./base-repository";
import {
  Users,
  Sessions,
  Blobs,
  Projects,
  Assets,
  Updates,
} from "./repositories";

export class Repository extends BaseRepository {
  public users = new Users(this.db);
  public sessions = new Sessions(this.db);
  public blobs = new Blobs(this.db);
  public projects = new Projects(this.db);
  public assets = new Assets(this.db);
  public updates = new Updates(this.db);
}
