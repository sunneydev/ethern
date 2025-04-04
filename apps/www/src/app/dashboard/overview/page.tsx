import { GENERIC_ERROR_MESSAGE } from "@ethern/utils/consts";
import { AssetsAnalytics } from "~/components/dashboard/analytics/assets.analytics";
import { MonthlyUpdatedUsers } from "~/components/dashboard/analytics/muu.analytics";
import { GettingStartedCard } from "~/components/dashboard/overview/cards";
import { Projects } from "~/components/dashboard/projects.list";
import { Updates } from "~/components/dashboard/updates.list";
import { getSession } from "~/server";
import { getDashboardData } from "~/server/actions/data";

export default async function Overview() {
  const { user } = await getSession();
  const referenceId = crypto.randomUUID();

  const data = await getDashboardData(user);

  if (!data) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-md text-white/50">{GENERIC_ERROR_MESSAGE}</p>
        <span className="text-md text-white/50 mt-2">
          Reference ID: {referenceId}
        </span>
      </div>
    );
  }

  const { dateRange, storageUsed, projects, plan, totalCount, fewUpdates } =
    data;

  return (
    <div>
      <h1 className="text-3xl font-bold">Overview</h1>
      <p className="text-md text-white/50">
        Comprehensive view of your projects and overall usage stats.
      </p>

      <div className="mt-4 grid grid-cols-1 place-content-center gap-6 pb-16 sm:pb-0 md:grid-cols-2">
        <GettingStartedCard user={user} />

        <MonthlyUpdatedUsers
          updated={totalCount}
          max={plan.updates}
          dateRange={dateRange}
        />
        <AssetsAnalytics used={storageUsed} available={plan.storage} />
        <Projects projects={projects} />
        <Updates updates={fewUpdates} />
      </div>
    </div>
  );
}
