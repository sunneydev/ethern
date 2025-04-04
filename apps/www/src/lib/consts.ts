export const SENTRY_DSN =
  "https://52ab2a1b28177e2ee6832539ab0673d4@o4505213185884160.ingest.us.sentry.io/4508058533429248";

const github = {
  prod: { clientId: "0cf4031bf6e0d38c115d" },
  dev: { clientId: "11fad95524dc692507f7" },
};

export const isDev = process.env.NODE_ENV !== "production";

export const GITHUB_CLIENT_ID = isDev
  ? github.dev.clientId
  : github.prod.clientId;

export const GOOGLE_CLIENT_ID =
  "396212369712-i38ttih0q2u8obteh76tvkvou4kt2vnd.apps.googleusercontent.com";

const priceIds = isDev
  ? {
      starter: "pri_01hxhjxgg4w6dhn74ezy469ncm",
      pro: "pri_01hxj4qh3tspjy339cd6d9cgys",
    }
  : {
      starter: "pri_01hxp9av8dswdrztjkd4wxw44h",
      pro: "pri_01hxp9cz1hxs384fq4jy40h7gg",
    };

const token = isDev
  ? "test_081ed5072d04314ce5e3203f2e9"
  : "live_d758b28854b9a16221f4994fcaa";

const environment = (isDev ? "sandbox" : "production") as
  | "sandbox"
  | "production";

const paddle = {
  token,
  environment,
  priceIds,
};

export const consts = {
  github: { clientId: GITHUB_CLIENT_ID },
  google: { clientId: GOOGLE_CLIENT_ID },
  paddle,
};

export const EXPO_BANDWITH_COST = 0.1;

export const EXPO_PLAN_BANDWIDTH = {
  "On-demand": 100,
  Production: 1024,
  Enterprise: 10_000,
} as const;
