import { cn } from "~/lib/utils";
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "~/ui/avatar";

export function Avatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  return (
    <UIAvatar
      className={cn(
        "flex h-[40px] w-[40px] items-center justify-center rounded-sm",
        className,
      )}
    >
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className="flex h-full w-full items-center justify-center rounded-sm bg-white/15">
        {name[0]?.toUpperCase()}
      </AvatarFallback>
    </UIAvatar>
  );
}
