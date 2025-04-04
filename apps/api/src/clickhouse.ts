import { createClient } from "@clickhouse/client-web";

export const clickhouse = (dbUrl: string) => {
  const pattern = /^(https?):\/\/([^:@]+)@([^:]+):([^/]+)\/([^/]+)$/;
  const match = dbUrl?.match(pattern);

  if (!match) {
    throw new Error("Invalid ClickHouse URL");
  }

  const [, protocol, host, username, password, database] = match;

  return createClient({
    host: `${protocol}://${host}`,
    username,
    password,
    database,
  });
};
