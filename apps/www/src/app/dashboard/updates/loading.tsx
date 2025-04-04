import { UpdatesSearch } from "./updates-search";
import { UpdatesTable } from "./updates-table";

interface PageProps {
  searchParams: {
    project: string;
    update: string;
  };
}

export default function Page() {
  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold">Updates</h1>

      <UpdatesSearch projects={[]} />

      <div className="mt-8 flex flex-col gap-4">
        <UpdatesTable updates={[]} />
      </div>
    </div>
  );
}
