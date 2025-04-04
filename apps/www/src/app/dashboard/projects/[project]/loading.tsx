import { BackButton } from "~/components/back-button";
import { Skeleton } from "~/ui/skeleton";

export default function Page() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-7xl flex-col gap-4">
        <BackButton label="Back to Projects" />
        <div className="flex h-full w-full flex-col items-start justify-between gap-4 border-b border-b-white/15 p-4 sm:flex-row">
          <div className="flex w-full cursor-pointer flex-col gap-4">
            <div className="flex flex-row gap-2">
              <Skeleton height={48.02} width={48.02} />

              <div className="flex flex-col items-start gap-2">
                <Skeleton height={20} width={200} />
                <Skeleton height={20} width={100} />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 sm:flex-col">
            <div className="flex flex-col">
              <span className="text-xs text-white/55">Total Size</span>
              <span className="text-sm text-white/85">
                <Skeleton height={20} width={80} />
              </span>
            </div>
            <div className="flex w-32 flex-col">
              <p className="text-xs text-white/55">Last Updated</p>
              <span className="text-sm text-white/85">
                <Skeleton height={20} width={60} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
