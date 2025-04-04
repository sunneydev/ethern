import { getRequestContext } from "@cloudflare/next-on-pages";
import { CheckIcon } from "@radix-ui/react-icons";
import { Plans } from "~/app/dashboard/billing/page.client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { fixtures } from "~/lib/fixtures";
import { Plan } from "~/lib/types";
import { cn } from "~/lib/utils";
import { getSession } from "~/server";
import { paddle } from "~/server/modules/paddle";

export default async function Page() {
  const { user } = await getSession();

  const countryCode = getRequestContext().cf.country;

  const customerId = user.customerId;

  const [subscription] = customerId
    ? await paddle.subscriptions(customerId)
    : [null];

  const transactionId = subscription?.id
    ? await paddle.paymentTransaction(subscription.id)
    : undefined;

  const currentPlan =
    fixtures.plans.find((p) => p.name === user.plan) ??
    fixtures.plans.find((p) => p.name === "free")!;

  return (
    <div className="px-6">
      <h1 className="text-3xl font-bold">Subscription & Billing</h1>
      <p className="text-md text-white/50">
        Manage your account and billing information.
      </p>
      <div className="mt-8 flex w-fit flex-col gap-8">
        <CurrentPlan plan={currentPlan} />

        <Plans
          email={user.email}
          currentPlan={user.plan}
          countryCode={countryCode}
          transactionId={transactionId}
        />
      </div>
    </div>
  );
}

function CurrentPlan({ plan }: { plan: Plan }) {
  return (
    <Card className="w-full bg-black sm:max-w-3xl">
      <CardContent className="grid gap-4">
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{plan.title}</h1>
          <div className="text-right">
            <p className="text-2xl font-bold">{plan.price}</p>
            <p className="text-sm text-white/50">per month</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-white/50">Your current plan includes:</p>
          <div className="mt-3 grid grid-cols-1 grid-rows-2 gap-3 sm:grid-cols-2">
            {plan.benefits.map((benefit) => (
              <div key={benefit.benefit} className="flex items-center gap-2">
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
        {plan.name === "free" ? null : (
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Active from: May 1, 2023</p>
              <p className="text-sm text-white/50">Recurring: Monthly</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="destructive">Cancel Plan</Button>
              <Button variant="outline">Change Payment Method</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
