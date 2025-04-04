export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Fn<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T>;

export type NonNullable<T> = Exclude<T, null | undefined>;
