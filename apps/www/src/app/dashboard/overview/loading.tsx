import { ProjectWithUpdates, Update } from "@ethern/db";
import { AssetsAnalytics } from "~/components/dashboard/analytics/assets.analytics";
import { MonthlyUpdatedUsers } from "~/components/dashboard/analytics/muu.analytics";
import { GettingStartedCard } from "~/components/dashboard/overview/cards";
import { Projects } from "~/components/dashboard/projects.list";
import { Updates } from "~/components/dashboard/updates.list";
import { getOngoingMonthDateRange } from "~/lib/utils";

export default function Overview() {
  const totalCount = -1;
  const storageUsed = -1;
  const projects = [] as ProjectWithUpdates[];
  const plan = { updates: -1, storage: -1 };
  const { label: dateRange } = getOngoingMonthDateRange();
  const fewUpdates = [] as Array<Update & { project: { name: string } }>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Overview</h1>
      <p className="text-md text-white/50">
        Comprehensive view of your projects and overall usage stats.
      </p>

      <div className="mt-4 grid grid-cols-1 place-content-center gap-6 pb-16 sm:pb-0 md:grid-cols-2">
        <GettingStartedCard user={{ email: "", username: "" }} />

        <MonthlyUpdatedUsers
          updated={totalCount}
          max={plan.updates}
          dateRange={dateRange}
          isLoading
        />
        <AssetsAnalytics
          used={storageUsed}
          available={plan.storage}
          isLoading
        />
        <Projects projects={projects} isLoading />
        <Updates updates={fewUpdates} isLoading />
      </div>
    </div>
  );
}
