import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/ui/card";
import { Skeleton } from "~/ui/skeleton";

export interface MonthlyUpdatedUsersProps {
  updated: number;
  max: number;
  dateRange: string;
  isLoading?: boolean;
}

export function MonthlyUpdatedUsers({
  updated,
  max,
  dateRange,
  isLoading,
}: MonthlyUpdatedUsersProps) {
  const updatedFormatted = new Intl.NumberFormat().format(updated);
  const maxFormatted = new Intl.NumberFormat().format(max);

  return (
    <Card className="bg-black min-h-[144px] max-h-[144px]">
      <CardHeader>
        <CardTitle className="font-bold tracking-tighter">
          Monthly Updated Users
        </CardTitle>
        <CardDescription className="text-xs text-white/75">
          {dateRange}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton width={60} height={20} />
        ) : (
          <>
            <span className="text-2xl font-bold tracking-tighter">
              {updatedFormatted}
            </span>
            <span className="ml-1 text-sm text-white/75">/ {maxFormatted}</span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
