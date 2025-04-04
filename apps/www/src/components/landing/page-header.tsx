import Balancer from "react-wrap-balancer";
import { cn } from "~/lib/utils";

export function Heading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Balancer
      className={cn(
        "text-center text-2xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] text-balance",
        className,
      )}
      {...props}
    />
  );
}

export function SubHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "mb-2 text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]",
        className,
      )}
      {...props}
    />
  );
}

export function Description({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "max-w-[750px] text-center text-white/50 sm:text-xl",
        className,
      )}
      {...props}
    />
  );
}
