"use client";

import { User } from "@ethern/db";
import { PricingCard } from "~/components/landing";
import { PricingCardMinimal } from "~/components/landing/pricing-card";
import { fixtures } from "~/lib/fixtures";
import { usePaddle } from "~/lib/hooks/use-paddle";

export function Plans({
  currentPlan: currentPlanName,
  email,
  countryCode,
  transactionId,
}: {
  currentPlan: User["plan"];
  email: string;
  countryCode?: string;
  transactionId?: string;
}) {
  const paddle = usePaddle({ email, countryCode });

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {fixtures.plans
        .filter((p) => p.name !== "free")
        .map((props) => (
          <PricingCard
            key={props.title}
            {...props}
            onClick={(priceId) => paddle.checkout(priceId, transactionId)}
            userSelectedPlan={currentPlanName}
            ctaLabel={
              currentPlanName === props.name ? "Current Plan" : "Select Plan"
            }
          />
        ))}
    </div>
  );
}
