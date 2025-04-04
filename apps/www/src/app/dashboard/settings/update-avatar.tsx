"use client";

import { useState } from "react";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

interface UpdateEmailProps {
  userEmail: string;
  serverAction: any;
  description: string;
  actionLabel: string;
}

export const UpdateEmail = (props: UpdateEmailProps) => {
  const [email, setEmail] = useState(props.userEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields");
      return;
    }
    setError("");
    const res = await props.serverAction("changeEmail", { email, password });
    if (res.error) {
      setError(res.error);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="New Email"
          value={email}
          className="my-4"
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm">{props.description}</div>
        <Button className="text-sm">{props.actionLabel}</Button>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};
