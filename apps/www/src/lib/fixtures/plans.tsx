import { ComponentProps } from "react";
import { PricingCard } from "~/components/landing/pricing-card";
import { consts } from "~/lib/consts";

export const plans: ComponentProps<typeof PricingCard>[] = [
  {
    title: "Free",
    name: "free",
    price: "$0",
    updates: 1000,
    description:
      "Suitable for newcomers and basic projects, offering the essentials to get started.",
    benefits: [
      { benefit: "1,000 monthly updated users", concise: true },
      { benefit: "2 GB Storage", concise: true },
      { benefit: "Unlimited bandwidth usage" },
      { benefit: "Community support" },
      { benefit: "No credit card required to start" },
      { benefit: "Compatible with Expo SDK" },
    ],
    ctaLabel: "Start For Free",
  },
  {
    title: "Starter",
    name: "starter",
    price: "$19",
    updates: 50_000,
    label: "Most Popular",
    priceId: consts.paddle.priceIds.starter,
    description:
      "Ideal for growing applications that require additional flexibility and room to expand.",
    isBenefitOf: "Benefits of Free, plus:",
    benefits: [
      {
        benefit: "50,000 monthly updated users",
        concise: true,
      },
      { benefit: "50 GB Storage", concise: true },
      { benefit: "Priority Email Support" },
      { benefit: "Access to more detailed usage analytics" },
    ],
    ctaLabel: "Get Started",
  },
  {
    title: "Pro",
    name: "pro",
    price: "$79",
    updates: 250_000,
    label: "Best Value",
    priceId: consts.paddle.priceIds.pro,
    description:
      "Optimized for mature projects with higher demands for update frequency and user reach.",
    isBenefitOf: "Benefits of Starter, plus:",
    benefits: [
      {
        benefit: "250,000 monthly updated users",
        label: "$0,0005 for each additional user",
        concise: true,
      },
      { benefit: "1 TB Storage", concise: true },
      { benefit: "Advanced deployments options" },
      { benefit: "Code signing" },
    ],
    ctaLabel: "Get Started",
  },
];
