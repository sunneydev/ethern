"use client";

import { OTPInput, SlotProps } from "input-otp";
import { cn } from "~/lib/utils";

export interface OTPProps {
  onComplete?: (otp: string) => void;
}

export function OTP({ onComplete }: OTPProps) {
  return (
    <OTPInput
      onComplete={(otp) => onComplete?.(otp)}
      pattern="^[A-Z0-9]+$"
      maxLength={8}
      containerClassName="group flex items-center has-[:disabled]:opacity-30"
      render={({ slots }) => (
        <>
          <div className="flex">
            {slots.slice(0, 4).map((slot, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Slot key={idx} {...slot} />
            ))}
          </div>

          <FakeDash />

          <div className="flex">
            {slots.slice(4).map((slot, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Slot key={idx} {...slot} />
            ))}
          </div>
        </>
      )}
    />
  );
}

export function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative h-12 w-8 sm:h-24 sm:w-20 sm:text-[3rem]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border-border border-y border-r first:rounded-l-sm first:border-l last:rounded-r-sm",
        "group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20",
        "outline-accent-foreground/20 outline outline-0",
        { "outline-accent-foreground outline-4": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

// You can emulate a fake textbox caret!
export function FakeCaret() {
  return (
    <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-px bg-white" />
    </div>
  );
}

// Inspired by Stripe's MFA input.
function FakeDash() {
  return (
    <div className="flex w-10 items-center justify-center">
      <div className="bg-border h-1 w-3 rounded-full" />
    </div>
  );
}
