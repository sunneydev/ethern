"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/ui/button";

interface PricingCardProps {
  title: string;
  name: "free" | "starter" | "pro";
  userSelectedPlan?: string;
  price: string;
  updates: number;
  priceId?: string;
  description: string;
  benefits: {
    benefit: string;
    label?: string;
    tooltip?: string;
    concise?: boolean;
  }[];
  isBenefitOf?: string;
  ctaLabel?: string;
  label?: string;
  onClick?: (priceId: string) => void;
}

export function PricingCardMinimal(props: PricingCardProps) {
  const router = useRouter();

  const mostPopular = props.label === "Most Popular";
  const bestValue = props.label === "Best Value";

  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!cardRef.current) {
      return;
    }

    let x = 0;
    let y = 0;

    const { left, top } = cardRef.current.getBoundingClientRect();

    if ("touches" in e && e.touches.length) {
      const touch = e.touches?.[0];
      x = touch?.clientX - left;
      y = touch?.clientY - top;
    } else {
      const { clientX, clientY } = e as unknown as MouseEvent;

      x = clientX - left;
      y = clientY - top;
    }

    if (!shadowRef.current) {
      return;
    }

    shadowRef.current.style.top = `${y}px`;
    shadowRef.current.style.left = `${x}px`;
    shadowRef.current.style.transform = "translate(-50%, -50%)";
    cardRef.current.style.setProperty("--cursor-x", `${x}px`);
    cardRef.current.style.setProperty("--cursor-y", `${y}px`);

    const card = (
      <div className="flex h-full min-h-[220px] flex-col justify-between bg-black">
        <div>
          <div className={cn("mb-2 flex items-center justify-between")}>
            <h1 className="text-2xl font-semibold">{props.title}</h1>
            {props.label ? (
              <div className="bg-primary-500 border-white-10 rounded-full border px-4 py-1 text-sm text-white">
                {props.label}
              </div>
            ) : null}
          </div>
          <div className="mb-3 flex items-end gap-1">
            <h1 className="text-2xl font-black">{props.price}</h1>
            <p className="mb-0.5 text-[#929292]">per month</p>
          </div>

          <div className="mt-6">
            {props.benefits
              .filter((b) => b.concise)
              .map((benefit) => (
                <div
                  key={benefit.benefit}
                  className="mb-3 flex items-center gap-2"
                >
                  <div
                    className={cn("rounded-full bg-white", {
                      "mb-3.5": benefit.label,
                    })}
                  >
                    <CheckIcon className="text-black" />
                  </div>

                  <div>
                    <p className="text-sm">{benefit.benefit}</p>
                    {benefit.label ? (
                      <p className="text-xs text-[#929292]">{benefit.label}</p>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        </div>
        {props.ctaLabel ? (
          <Button
            onClick={() =>
              (props.priceId && props.onClick?.(props.priceId)) ||
              (() => router.push("/auth/account/sign-up"))
            }
            className={cn(
              "z-[99999] w-full rounded-sm border transition-colors delay-75 duration-200 hover:border-white/80 hover:bg-black hover:text-white",
              {
                "hover:border-[#828FFF] hover:text-[#828FFF]": bestValue,
                "hover:border-[#C9F66F] hover:text-[#C9F66F]": mostPopular,
                "bg-black text-white": props.name === props.userSelectedPlan,
              },
            )}
          >
            {props.ctaLabel}
          </Button>
        ) : null}
      </div>
    );

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseMove}
        className={cn(
          "group relative z-0 h-full w-full min-w-[340px] max-w-[340px] overflow-hidden rounded-xl border border-zinc-800 bg-[radial-gradient(500px_circle_at_var(--cursor-x)_var(--cursor-y),#FFF_0,transparent,transparent_100%)] p-6",
          {
            "bg-[radial-gradient(500px_circle_at_var(--cursor-x)_var(--cursor-y),#828FFF_0,transparent,transparent_100%)]":
              bestValue,
            "bg-[radial-gradient(500px_circle_at_var(--cursor-x)_var(--cursor-y),#C9F66F_0,transparent,transparent_100%)]":
              mostPopular,
          },
        )}
      >
        {card}
        <div
          ref={shadowRef}
          className={cn(
            "absolute left-0 top-0 h-4/5 w-4/5 bg-[#FFF]/10 opacity-0 blur-[70px] duration-200 group-hover:opacity-90",
            { "bg-[#828FFF]/15": bestValue, "bg-[#C9F66F]/15": mostPopular },
          )}
        />
        <div className="absolute inset-[1px] -z-10 max-w-[340px] rounded-md bg-black" />
      </div>
    );
  };
}

export function PricingCard(props: PricingCardProps) {
  const router = useRouter();

  const mostPopular = props.label === "Most Popular";
  const bestValue = props.label === "Best Value";

  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!cardRef.current) {
      return;
    }

    let x = 0;
    let y = 0;

    const { left, top } = cardRef.current.getBoundingClientRect();

    if ("touches" in e && e.touches.length) {
      const touch = e.touches?.[0];
      x = touch?.clientX - left;
      y = touch?.clientY - top;
    } else {
      const { clientX, clientY } = e as unknown as MouseEvent;

      x = clientX - left;
      y = clientY - top;
    }

    if (!shadowRef.current) {
      return;
    }

    shadowRef.current.style.top = `${y}px`;
    shadowRef.current.style.left = `${x}px`;
    shadowRef.current.style.transform = "translate(-50%, -50%)";
    cardRef.current.setAttribute(
      "style",
      `--cursor-x: ${x}px; --cursor-y: ${y}px`,
    );
  };

  const card = (
    <div className="flex h-full min-h-[478px] flex-col justify-between bg-black">
      <div>
        <div className={cn("mb-2 flex items-center justify-between")}>
          <h1 className="text-2xl font-semibold">{props.title}</h1>
          {props.label ? (
            <div className="border-white-10 rounded-full border px-4 py-1 text-sm">
              {props.label}
            </div>
          ) : null}
        </div>
        <div className="mb-3 flex items-end gap-1">
          <h1 className="text-2xl font-black">{props.price}</h1>
          <p className="mb-0.5 text-[#929292]">per month</p>
        </div>
        <p className="mb-7 line-clamp-3 font-normal text-[#929292]">
          {props.description}
        </p>
        {props.isBenefitOf ? (
          <p className="mb-3 text-sm">{props.isBenefitOf}</p>
        ) : null}
        {props.benefits.map((benefits) => (
          <div key={benefits.benefit} className="mb-3 flex items-center gap-2">
            <div
              className={cn("rounded-full bg-white", {
                "mb-3.5": benefits.label,
              })}
            >
              <CheckIcon className="text-black" />
            </div>

            <div>
              <p className="text-sm">{benefits.benefit}</p>
              {benefits.label ? (
                <p className="text-xs text-[#929292]">{benefits.label}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={() => router.push("/auth/account/sign-up")}
        className={cn(
          "z-[99999] mt-5 w-full rounded-sm border transition-colors delay-75 duration-200 hover:border-white/80 hover:bg-black hover:text-white",
          {
            "hover:border-[#828FFF] hover:text-[#828FFF]": bestValue,
            "hover:border-[#C9F66F] hover:text-[#C9F66F]": mostPopular,
            "bg-black text-white": props.name === props.userSelectedPlan,
          },
        )}
      >
        {props.ctaLabel}
      </Button>
    </div>
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
      className={cn(
        "group relative z-0 h-full w-full min-w-[340px] max-w-[340px] overflow-hidden rounded-xl border border-zinc-800 bg-[radial-gradient(500px_circle_at_var(--cursor-x)_var(--cursor-y),#FFF_0,transparent,transparent_100%)] p-6",
        {
          "bg-[radial-gradient(500px_circle_at_var(--cursor-x)_var(--cursor-y),#828FFF_0,transparent,transparent_100%)]":
            bestValue,
          "bg-[radial-gradient(500px_circle_at_var(--cursor-x)_var(--cursor-y),#C9F66F_0,transparent,transparent_100%)]":
            mostPopular,
        },
      )}
    >
      {card}
      <div
        ref={shadowRef}
        className={cn(
          "absolute left-0 top-0 h-4/5 w-4/5 bg-[#FFF]/10 opacity-0 blur-[70px] duration-200 group-hover:opacity-90",
          { "bg-[#828FFF]/15": bestValue, "bg-[#C9F66F]/15": mostPopular },
        )}
      />
      <div className="absolute inset-[1px] -z-10 max-w-[340px] rounded-md bg-black" />
    </div>
  );
}
