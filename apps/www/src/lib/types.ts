export type SignInErrors =
  | "invalid-code"
  | "invalid-token"
  | "missing-code"
  | "account-exists"
  | "unverified-email"
  | "unexpected-error";

export interface Plan {
  title: string;
  name: "free" | "starter" | "pro" | "admin";
  userSelectedPlan?: string;
  price: string;
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
}
