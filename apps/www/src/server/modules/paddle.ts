import "server-only";
import { requestly } from "requestly";
import type { Customer, SubscriptionsList } from "~/app/api/billing/_types";
import { getEnv, isDev } from "~/server/env";

export const paddle = {
  customer,
  subscriptions,
  paymentTransaction,
};

const api = () =>
  requestly.create({
    baseUrl: isDev()
      ? "https://sandbox-api.paddle.com"
      : "https://api.paddle.com",
    headers: {
      Authorization: `Bearer ${getEnv().PADDLE_API_KEY}`,
    },
  });

async function customer(customerId: string) {
  const response = await api()
    .get<{ data: Customer }>(`/customers/${customerId}`)
    .then((r) => r.data);

  const customer = response.data;

  return customer;
}

async function subscriptions(customerId: string) {
  const response = await api()
    .get<SubscriptionsList>("/subscriptions", {
      params: { customer_id: customerId },
    })
    .then((r) => r.data);

  const subscriptions = response.data;

  return subscriptions;
}

async function paymentTransaction(subscriptionId: string) {
  const response = await api().get<{ data: { id: string } }>(
    `/subscriptions/${subscriptionId}/update-payment-method-transaction`,
  );

  const transactions = response.data.data;

  return transactions.id;
}
