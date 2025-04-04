"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "~/lib/utils";

const MIN_VALUE = 1000;
const MAX_VALUE = 1000000;
const logMin = Math.log(MIN_VALUE);
const logMax = Math.log(MAX_VALUE);

// Convert from slider value to logarithmic scale
function valueToLog(value: number): number {
  return Math.exp(logMin + (value / 100) * (logMax - logMin));
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="bg-primary/20 relative h-[5px] w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="absolute h-full bg-white/80" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="relative flex size-4 cursor-grab items-center justify-center rounded-full border-[1px] border-white/65 bg-black shadow transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
        {props.children}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
