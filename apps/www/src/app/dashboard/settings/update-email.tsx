"use client";

import { toast } from "sonner";
import { changeEmail } from "~/server/actions/user";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

interface UpdateEmailProps {
  userEmail?: string;
  description: string;
  actionLabel: string;
  disabled?: boolean;
  disabledMessage?: string;
}

export function UpdateEmail(props: UpdateEmailProps) {
  return (
    <form
      action={async (form) => {
        const email = form.get("email")?.toString();

        if (!email) {
          toast.error("Email is required.");
          return;
        }

        const response = await changeEmail({ newEmail: email });
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }}
    >
      <Input
        disabled={props.disabled}
        name="email"
        value={props.userEmail}
        type="email"
        placeholder="New Email"
        className="my-4"
      />

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm">{props.description}</div>
        <Button className="text-sm" type="submit" disabled={props.disabled}>
          {props.actionLabel}
        </Button>
      </div>
    </form>
  );
}
