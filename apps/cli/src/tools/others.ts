import chalk from "chalk";
import figures from "figures";
import { boolish } from "getenv";
import logSymbols from "log-symbols";
import terminalLink from "terminal-link";

type Color = (...text: string[]) => string;

export const isInteractive = process.stdout.isTTY;

export const isDebug = boolish("ETHERN_DEBUG", true);

export const Log = {
  log,
  newLine,
  addNewLineIfNone,
  error,
  errorExit,
  warn,
  debug,
  gray,
  warnDeprecatedFlag,
  fail,
  succeed,
  withTick,
  withInfo,
  link,
  learnMore,
};

export function log(...args: unknown[]): void {
  consoleLog(...args);
}

export function newLine(): void {
  consoleLog();
}

export function addNewLineIfNone(): void {
  if (!isLastLineNewLine) {
    newLine();
  }
}

export function error(...args: unknown[]): void {
  consoleLog(...withTextColor(args, chalk.red));
}

export function errorExit(...args: unknown[]): never {
  consoleLog(...withTextColor(args, chalk.red));
  process.exit(1);
}

export function warn(...args: unknown[]): void {
  consoleLog(...withTextColor(args, chalk.yellow));
}

export function debug(...args: unknown[]): void {
  if (isDebug) {
    consoleLog(...args);
  }
}

export function gray(...args: unknown[]): void {
  consoleLog(...withTextColor(args, chalk.gray));
}

export function warnDeprecatedFlag(flag: string, message: string): void {
  warn(`› ${chalk.bold(`--${flag}`)} flag is deprecated. ${message}`);
}

export function fail(message: string): void {
  log(`${chalk.red(logSymbols.error)} ${message}`);
}

export function succeed(message: string): void {
  log(`${chalk.green(logSymbols.success)} ${message}`);
}

export function withTick(...args: unknown[]): void {
  consoleLog(chalk.green(figures.tick), ...args);
}

export function withInfo(...args: unknown[]): void {
  consoleLog(chalk.green(figures.info), ...args);
}

function consoleLog(...args: unknown[]): void {
  updateIsLastLineNewLine(args);
  console.log(...args);
}

function withTextColor(args: unknown[], chalkColor: Color): string[] {
  // @ts-expect-error: args is unknown[]
  return args.map((arg) => chalkColor(arg));
}

let isLastLineNewLine = false;
function updateIsLastLineNewLine(args: unknown[]): void {
  if (args.length === 0) {
    isLastLineNewLine = true;
  } else {
    const lastArg = args[args.length - 1];
    if (
      typeof lastArg === "string" &&
      (lastArg === "" || lastArg.match(/[\r\n]$/))
    ) {
      isLastLineNewLine = true;
    } else {
      isLastLineNewLine = false;
    }
  }
}

/**
 * Prints a link for given URL, using text if provided, otherwise text is just the URL.
 * Format links as dim (unless disabled) and with an underline.
 *
 * @example https://expo.dev
 */
export function link(
  url: string,
  {
    text = url,
    fallback,
    dim = true,
  }: { text?: string; dim?: boolean; fallback?: string } = {},
): string {
  // Links can be disabled via env variables https://github.com/jamestalmage/supports-hyperlinks/blob/master/index.js
  const output = terminalLink(text, url, {
    fallback: () =>
      fallback ??
      (text === url
        ? chalk.underline(url)
        : `${text}: ${chalk.underline(url)}`),
  });
  return dim ? chalk.dim(output) : output;
}

/**
 * Provide a consistent "Learn more" link experience.
 * Format links as dim (unless disabled) with an underline.
 *
 * @example Learn more: https://expo.dev
 */
export function learnMore(
  url: string,
  {
    learnMoreMessage: maybeLearnMoreMessage,
    dim = true,
  }: { learnMoreMessage?: string; dim?: boolean } = {},
): string {
  return link(url, { text: maybeLearnMoreMessage ?? "Learn more", dim });
}

export abstract class Client {
  // makeShallowCopyAsync should copy current project (result of getRootPathAsync()) to the specified
  // destination, folder created this way will be uploaded "as is", so implementation should skip
  // unknownthing that is not committed to the repository. Most optimal solution is to create shallow clone
  // using tooling provided by specific VCS, that respects all ignore rules
  public abstract makeShallowCopyAsync(destinationPath: string): Promise<void>;

  // Find root of the repository.
  //
  // On windows path might look different depending on implementation
  // - git based clients will return "C:/path/to/repo"
  // - non-git clients will return "C:\path\to\repo"
  public abstract getRootPathAsync(): Promise<string>;

  // (optional) checks whether commit is necessary before calling makeShallowCopyAsync
  //
  // If it's not implemented method `makeShallowCopyAsync` needs to be able to include uncommitted changes
  // when creating copy
  public async isCommitRequiredAsync(): Promise<boolean> {
    return false;
  }

  // (optional) hasUncommittedChangesAsync should check whether there are changes in local repository
  public async hasUncommittedChangesAsync(): Promise<boolean | undefined> {
    return undefined;
  }

  // (optional) commitAsync commits changes
  //
  // - Should be implemented if hasUncommittedChangesAsync is implemented
  // - If it's not implemented method `makeShallowCopyAsync` needs to be able to include uncommitted changes
  // in project copy
  public async commitAsync(_arg: {
    commitMessage: string;
    commitAllFiles?: boolean;
    nonInteractive: boolean;
  }): Promise<void> {
    // it should not be called unless hasUncommittedChangesAsync is implemented
    throw new Error("commitAsync is not implemented");
  }

  // (optional) mark file as tracked, if this method is called on file, the next call to
  // `commitAsync({ commitAllFiles: false })` should commit that file
  public async trackFileAsync(_file: string): Promise<void> {}

  // (optional) print diff of the changes that will be commited in the next call to
  // `commitAsync({ commitAllFiles: false })`
  public async showDiffAsync(): Promise<void> {}

  // (optional) returns hash of the last commit
  // used for metadata - implementation can be safely skipped
  public async getCommitHashAsync(): Promise<string | undefined> {
    return undefined;
  }

  // (optional) returns name of the current branch
  // used for EAS Update - implementation can be safely skipped
  public async getBranchNameAsync(): Promise<string | null> {
    return null;
  }

  // (optional) returns message of the last commit
  // used for EAS Update - implementation can be safely skipped
  public async getLastCommitMessageAsync(): Promise<string | null> {
    return null;
  }

  // (optional) checks if the file is ignored, an implementation should ensure
  // that if file exists and `isFileIgnoredAsync` returns true, then that file
  // should not be included in the project tarball.
  //
  // @param filePath has to be a relative normalized path pointing to a file
  // located under the root of the repository
  public async isFileIgnoredAsync(_filePath: string): Promise<boolean> {
    return false;
  }

  /**
   * Whether this VCS client can get the last commit message.
   * Used for EAS Update - implementation can be false for noVcs client.
   */
  public abstract canGetLastCommitMessage(): boolean;
}
