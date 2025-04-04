import type * as schema from "@ethern/db";
import type { User } from "@ethern/db";
import { format } from "date-fns";
import { cache } from "react";
import { getOngoingMonthDateRange } from "~/lib/utils";
import { userPlans } from "~/lib/utils";
import { db, clickhouse } from "~/server/db";

export const getDashboardData = cache(async (user: User) => {
  let t = performance.now();

  const { label: dateRange, dates } = getOngoingMonthDateRange();

  const dateRangeTime = performance.now() - t;

  t = performance.now();

  const projects = await db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.ownerId, user.id),
    with: { updates: true },
  });

  const updates = projects.flatMap((p) =>
    p.updates.map((u) => ({ ...u, project: { name: p.name } })),
  );

  const projectsTime = performance.now() - t;

  const plan = userPlans(user.plan ?? "free");

  if (!projects.length) {
    // logger.info('No projects found for user', { user })
    return emptyDashboardData({ plan, dateRange, projects });
  }

  t = performance.now();

  const { updatesPerProject, totalCount } = await getClickhouseData(
    dates,
    projects,
  ).catch((error) => {
    // logger.error('Failed to fetch Clickhouse data', { error })
    return { updatesPerProject: null, totalCount: 0 };
  });

  const clickhouseTime = performance.now() - t;

  const storageUsed = projects.reduce((acc, curr) => acc + curr.size, 0);

  const fewUpdates = updates
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // logger.info('Fetched dashboard data', {
  // 	durations: {
  // 		all: performance.now() - t,
  // 		dateRangeTime,
  // 		projectsTime,
  // 		clickhouseTime
  // 	},
  // 	user: user.id
  // })

  return {
    plan,
    dateRange,
    storageUsed,
    projects,
    updates: updatesPerProject,
    totalCount,
    fewUpdates,
  };
});

const emptyDashboardData = ({
  plan,
  dateRange,
  projects,
}: {
  plan: { storage: number; updates: number };
  dateRange: string;
  projects: (schema.Project & { updates: schema.Update[] })[];
}) => ({
  plan,
  dateRange,
  storageUsed: 0,
  projects,
  updates: [],
  totalCount: 0,
  fewUpdates: [],
});

async function getClickhouseData(
  dates: { start: Date; end: Date },
  projects: { id: number }[],
) {
  try {
    const startFormatted = format(dates.start, "yyyy-MM-dd");
    const endFormatted = format(dates.end, "yyyy-MM-dd");

    const query = `SELECT project_id, count(distinct(client_id)) as updates FROM app_updates
  WHERE created_at >= '${startFormatted}' AND created_at <= '${endFormatted}'
  AND project_id IN (${projects.map((p) => `'${p.id}'`).join(",")})
  GROUP BY project_id`;

    const request = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await request?.json();

    const updatesPerProject = data as
      | { project_id: string; updates: string }[]
      | null;

    const totalCount =
      updatesPerProject?.reduce(
        (acc, { updates }) => acc + Number.parseInt(updates),
        0,
      ) ?? 0;

    return { updatesPerProject, totalCount };
  } catch (error) {
    throw new Error(`Failed to fetch updates from Clickhouse: ${error}`);
  }
}
