import { resolveError } from "@ethern/utils";
import spawnAsync from "@expo/spawn-async";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import prompts from "prompts";
import { Client, learnMore, Log } from "~/tools/others";

export default class GitClient extends Client {
  public override async commitAsync({
    commitMessage,
    commitAllFiles,
    nonInteractive = false,
  }: {
    commitMessage: string;
    commitAllFiles?: boolean;
    nonInteractive: boolean;
  }): Promise<void> {
    await ensureGitConfiguredAsync({ nonInteractive });

    try {
      if (commitAllFiles) {
        await spawnAsync("git", ["add", "-A"]);
      }
      await spawnAsync("git", ["add", "-u"]);
      await spawnAsync("git", ["commit", "-m", commitMessage]);
    } catch (error) {
      const err = resolveError(error);
      if (err?.stdout) {
        Log.error(err.stdout);
      }
      if (err?.stderr) {
        Log.error(err.stderr);
      }
      throw err;
    }
  }

  public override async isCommitRequiredAsync(): Promise<boolean> {
    return await this.hasUncommittedChangesAsync();
  }

  public override async hasUncommittedChangesAsync(): Promise<boolean> {
    const changes = await gitStatusAsync({ showUntracked: true });
    return changes.length > 0;
  }

  public async getRootPathAsync(): Promise<string> {
    return (
      await spawnAsync("git", ["rev-parse", "--show-toplevel"])
    ).stdout.trim();
  }

  public async makeShallowCopyAsync(destinationPath: string): Promise<void> {
    if (await this.hasUncommittedChangesAsync()) {
      // it should already be checked before this function is called, but in case it wasn't
      // we want to ensure that any changes were introduced by call to `setGitCaseSensitivityAsync`
      throw new Error("You have some uncommitted changes in your repository.");
    }
    let gitRepoUri: string;
    if (process.platform === "win32") {
      // getRootDirectoryAsync() will return C:/path/to/repo on Windows and path
      // prefix should be file:///
      gitRepoUri = `file:///${await this.getRootPathAsync()}`;
    } else {
      // getRootDirectoryAsync() will /path/to/repo, and path prefix should be
      // file:/// so only file:// needs to be prepended
      gitRepoUri = `file://${await this.getRootPathAsync()}`;
    }
    const isCaseSensitive = await isGitCaseSensitiveAsync();
    await setGitCaseSensitivityAsync(true);
    try {
      if (await this.hasUncommittedChangesAsync()) {
        Log.error(
          "Detected inconsistent filename casing between your local filesystem and git.",
        );
        Log.error("This will likely cause your build to fail. Impacted files:");
        await spawnAsync("git", ["status", "--short"], { stdio: "inherit" });
        Log.newLine();
        Log.error(
          `Error: Resolve filename casing inconsistencies before proceeding. ${learnMore(
            "https://expo.fyi/macos-ignorecase",
          )}`,
        );
        throw new Error(
          "You have some uncommitted changes in your repository.",
        );
      }
      await spawnAsync("git", [
        "clone",
        "--no-hardlinks",
        "--depth",
        "1",
        gitRepoUri,
        destinationPath,
      ]);
    } finally {
      await setGitCaseSensitivityAsync(isCaseSensitive);
    }
  }

  public override async getCommitHashAsync(): Promise<string | undefined> {
    try {
      return (await spawnAsync("git", ["rev-parse", "HEAD"])).stdout.trim();
    } catch {
      return undefined;
    }
  }

  public override async trackFileAsync(file: string): Promise<void> {
    await spawnAsync("git", ["add", "--intent-to-add", file]);
  }

  public override async getBranchNameAsync(): Promise<string | null> {
    try {
      return (
        await spawnAsync("git", ["rev-parse", "--abbrev-ref", "HEAD"])
      ).stdout.trim();
    } catch {
      return null;
    }
  }

  public override async getLastCommitMessageAsync(): Promise<string | null> {
    try {
      return (
        await spawnAsync("git", ["--no-pager", "log", "-1", "--pretty=%B"])
      ).stdout.trim();
    } catch {
      return null;
    }
  }

  public override async showDiffAsync(): Promise<void> {
    const outputTooLarge =
      (await getGitDiffOutputAsync()).split(/\r\n|\r|\n/).length > 100;
    await gitDiffAsync({ withPager: outputTooLarge });
  }

  public async isFileUntrackedAsync(path: string): Promise<boolean> {
    const withUntrackedFiles = await gitStatusAsync({ showUntracked: true });
    const trackedFiles = await gitStatusAsync({ showUntracked: false });
    const pathWithoutLeadingDot = path.replace(/^\.\//, ""); // remove leading '~/' from path
    return (
      withUntrackedFiles.includes(pathWithoutLeadingDot) &&
      !trackedFiles.includes(pathWithoutLeadingDot)
    );
  }

  public override async isFileIgnoredAsync(filePath: string): Promise<boolean> {
    try {
      await spawnAsync("git", ["check-ignore", "-q", filePath], {
        cwd: path.normalize(await this.getRootPathAsync()),
      });
      return true;
    } catch {
      return false;
    }
  }

  public override canGetLastCommitMessage(): boolean {
    return true;
  }
}

async function ensureGitConfiguredAsync({
  nonInteractive,
}: {
  nonInteractive: boolean;
}): Promise<void> {
  let usernameConfigured = true;
  let emailConfigured = true;
  try {
    await spawnAsync("git", ["config", "--get", "user.name"]);
  } catch (err) {
    Log.debug(err);
    usernameConfigured = false;
  }
  try {
    await spawnAsync("git", ["config", "--get", "user.email"]);
  } catch (err) {
    Log.debug(err);
    emailConfigured = false;
  }
  if (usernameConfigured && emailConfigured) {
    return;
  }

  Log.warn(
    `You need to configure Git with your ${[
      !usernameConfigured && "username (user.name)",
      !emailConfigured && "email address (user.email)",
    ]
      .filter((i) => i)
      .join(" and ")}`,
  );
  if (nonInteractive) {
    throw new Error(
      "Git cannot be configured automatically in non-interactive mode",
    );
  }
  if (!usernameConfigured) {
    const { username } = await prompts({
      type: "text",
      name: "username",
      message: "Username:",
      validate: (input: string) => input !== "",
    });
    const spinner = ora(
      `Running ${chalk.bold(`git config --local user.name ${username}`)}`,
    ).start();
    try {
      await spawnAsync("git", ["config", "--local", "user.name", username]);
      spinner.succeed();
    } catch (err) {
      spinner.fail();
      throw err;
    }
  }
  if (!emailConfigured) {
    const { email } = await prompts({
      type: "text",
      name: "email",
      message: "Email address:",
      validate: (input: string) => input !== "",
    });
    const spinner = ora(
      `Running ${chalk.bold(`git config --local user.email ${email}`)}`,
    ).start();
    try {
      await spawnAsync("git", ["config", "--local", "user.email", email]);
      spinner.succeed();
    } catch (err) {
      spinner.fail();
      throw err;
    }
  }
}

/**
 * Checks if git is configured to be case sensitive
 * @returns {boolean | undefined}
 *    - boolean - is git case sensitive
 *    - undefined - case sensitivity is not configured and git is using default behavior
 */
export async function isGitCaseSensitiveAsync(): Promise<boolean | undefined> {
  if (process.platform !== "darwin") {
    return undefined;
  }

  try {
    const result = await spawnAsync("git", [
      "config",
      "--get",
      "core.ignorecase",
    ]);

    const isIgnoreCaseEnabled = result.stdout.trim();
    if (isIgnoreCaseEnabled === "") {
      return undefined;
    }

    if (isIgnoreCaseEnabled === "true") {
      return false;
    }

    return true;
  } catch {
    return undefined;
  }
}

async function setGitCaseSensitivityAsync(
  enable: boolean | undefined,
): Promise<void> {
  // we are assuming that if someone sets that on non-macos device then
  // they know what they are doing
  if (process.platform !== "darwin") {
    return;
  }
  if (enable === undefined) {
    await spawnAsync("git", ["config", "--unset", "core.ignorecase"]);
  } else {
    await spawnAsync("git", ["config", "core.ignorecase", String(!enable)]);
  }
}

export async function isGitInstalledAsync(): Promise<boolean> {
  try {
    await spawnAsync("git", ["--help"]);
  } catch (err) {
    const error = resolveError(err);
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
  return true;
}

export async function doesGitRepoExistAsync(): Promise<boolean> {
  try {
    await spawnAsync("git", ["rev-parse", "--git-dir"]);
    return true;
  } catch {
    return false;
  }
}

interface GitStatusOptions {
  showUntracked?: boolean;
}

export async function gitStatusAsync({
  showUntracked,
}: GitStatusOptions = {}): Promise<string> {
  return (
    await spawnAsync("git", ["status", "-s", showUntracked ? "-uall" : "-uno"])
  ).stdout;
}

export async function getGitDiffOutputAsync(): Promise<string> {
  return (await spawnAsync("git", ["--no-pager", "diff"])).stdout;
}

export async function gitDiffAsync({
  withPager = false,
}: { withPager?: boolean } = {}): Promise<void> {
  const options = withPager ? [] : ["--no-pager"];
  await spawnAsync("git", [...options, "diff"], {
    stdio: ["ignore", "inherit", "inherit"],
  });
}
