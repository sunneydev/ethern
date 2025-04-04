"use client";

import {
  CheckoutEventNames,
  type CheckoutSettings,
  Paddle,
  initializePaddle,
  CheckoutOpenOptions,
} from "@paddle/paddle-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { consts } from "~/lib/consts";

const defaultSettings = {
  displayMode: "overlay",
  theme: "light",
  locale: "en",
  allowLogout: false,
  allowedPaymentMethods: ["card", "paypal", "apple_pay", "google_pay"],
  showAddTaxId: false,
} satisfies CheckoutSettings;

type Arg = {
  email: string;
  countryCode?: string;
} & ({ transactionId?: string } | { priceId?: string });

const getCheckoutProps = ({
  email,
  countryCode,
  ...prop
}: Arg): CheckoutOpenOptions => {
  const transactionId =
    "transactionId" in prop ? prop.transactionId : undefined;
  const priceId = "priceId" in prop ? prop.priceId : undefined;

  if (transactionId) {
    return {
      customer: { email, address: { countryCode } },
      settings: defaultSettings,
      transactionId,
    };
  }

  if (priceId) {
    return {
      customer: { email, address: { countryCode } },
      settings: defaultSettings,
      items: [{ priceId, quantity: 1 }],
    };
  }

  throw new Error("Invalid arguments");
};

export function usePaddle({
  email,
  countryCode,
}: {
  email: string;
  countryCode?: string;
}) {
  const [_paddle, setPaddle] = useState<Paddle>();

  const checkoutSingle = useCallback(
    async (priceId: string, transactionId?: string) => {
      if (!_paddle) {
        return;
      }

      _paddle.Checkout.open(
        getCheckoutProps({ priceId, transactionId, email, countryCode }),
      );
    },
    [_paddle, email, countryCode],
  );

  useEffect(() => {
    initializePaddle({
      environment: consts.paddle.environment,
      token: consts.paddle.token,
      pwCustomer: { email },
      eventCallback(event) {
        if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
          toast.success("Checkout completed!");
          _paddle?.Checkout.close();
        }
      },
    }).then((paddleInstance?: Paddle) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, [email]);

  return {
    ..._paddle,
    checkout: checkoutSingle,
  };
}
