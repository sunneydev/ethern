import { api } from "~/api";
import { Log } from "~/tools/others";

export async function whoami() {
  const { data } = await api.auth();

  if (!data.user) {
    Log.error("You are not logged in");
    return;
  }

  Log.succeed(`You are logged in as ${data.user.username}`);
}
