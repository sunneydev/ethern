import type { SubscriptionActivatedEvent } from "~/app/api/billing/_types";
import { users } from "@ethern/db";
import { eq } from "drizzle-orm";
import { fixtures } from "~/lib/fixtures";
import { db } from "~/server/db";
import { paddle } from "~/server/modules/paddle";

export const runtime = "edge";

export async function POST(request: Request) {
  const event = (await request.json()) as SubscriptionActivatedEvent;

  const customerId = event.data.customer_id;

  const customer = await paddle.customer(customerId);

  console.info(`Activating subscription for ${customer.email}`);

  await db
    .update(users)
    .set({ customerId })
    .where(eq(users.email, customer.email));

  for (const item of event.data.items) {
    const plan = fixtures.plans.find((p) => p.priceId === item.price.id);

    if (plan == null) {
      console.error(`Plan not found for price id ${item.price.id}`);
      continue;
    }

    console.info(`Setting plan ${plan.name} for ${customer.email}`);

    if (plan.name === "starter") {
      await db
        .update(users)
        .set({ plan: "starter" })
        .where(eq(users.email, customer.email));
    } else if (plan.name === "pro") {
      await db
        .update(users)
        .set({ plan: "pro" })
        .where(eq(users.email, customer.email));
    } else {
      console.error(`Invalid plan ${plan.name} for customer ${customer.email}`);
    }
  }

  return new Response(null, { status: 200 });
}
