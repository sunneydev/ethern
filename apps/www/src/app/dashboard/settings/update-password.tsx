"use client";

import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "~/server/actions/user";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

interface UpdatePasswordProps {
  description: string;
  actionLabel: string;
}

export const UpdatePassword = (props: UpdatePasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !repeatPassword) {
      toast.error("Please fill out all fields");
      return;
    }

    if (password !== repeatPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await changePassword({
      newPassword: password,
      password: currentPassword,
    });
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        className="my-4"
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder="New password"
        value={password}
        className="my-4"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Repeat new password"
        value={repeatPassword}
        className="my-4"
        onChange={(e) => setRepeatPassword(e.target.value)}
      />

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm">{props.description}</div>
        <Button className="text-sm" type="submit">
          {props.actionLabel}
        </Button>
      </div>
    </form>
  );
};
