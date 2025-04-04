import { formatSizeInMB } from "~/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/ui/card";
import { Skeleton } from "~/ui/skeleton";

export interface AssetsAnalyticsProps {
  used: number;
  available: number;
  isLoading?: boolean;
}

export function AssetsAnalytics({
  used,
  available,
  isLoading,
}: AssetsAnalyticsProps) {
  const usedFormatted = formatSizeInMB(used);
  const availableFormatted = formatSizeInMB(available);

  return (
    <Card className="bg-black min-h-[144px] max-h-[144px]">
      <CardHeader>
        <CardTitle className="font-bold tracking-tighter">
          Assets Usage
        </CardTitle>
        <CardDescription className="text-xs text-white/50">
          Total assets usage across all projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton width={90} height={20} />
        ) : (
          <>
            <span className="text-2xl font-bold tracking-tighter">
              {usedFormatted}
            </span>
            <span className="ml-1 text-sm text-white/75">
              / {availableFormatted}
            </span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
