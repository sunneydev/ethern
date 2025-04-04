import { ProjectsSearch } from "./_components/projects-search";
import { Suspense } from "react";
import { ProjectRowLoading } from "~/app/dashboard/projects/_components/project-row";
import { ProjectRows } from "~/app/dashboard/projects/project-rows";

export default async function Page(props: {
  searchParams: Promise<{
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const { search } = searchParams;

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold">Projects</h1>

      <ProjectsSearch />
      <div className="mt-8 flex flex-col gap-4">
        <Suspense fallback={<ProjectRowLoading />}>
          <ProjectRows search={search} />
        </Suspense>
      </div>
    </div>
  );
}
