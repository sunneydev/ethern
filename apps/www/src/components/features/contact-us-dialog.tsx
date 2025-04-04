"use client";

import {
  ClockIcon,
  CheckCircledIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { sendContactMessage } from "~/server/actions/user";

function calculateContactStatus(): "available" | "offline" {
  const now = new Date();
  const dubaiTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }),
  );
  const hours = dubaiTime.getHours();
  const minutes = dubaiTime.getMinutes();

  const timeDecimal = hours + minutes / 60;

  return timeDecimal >= 3 && timeDecimal < 10 ? "offline" : "available";
}

export function ContactUsDialog({ email }: { email?: string }) {
  const status = useMemo(calculateContactStatus, []);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const message = event.currentTarget.message.value;

    if (!email || !message) {
      return;
    }

    await sendContactMessage({ email, message })
      .then(() => toast.success("Message sent! We'll get back to you soon."))
      .catch((err) => toast.error(`Failed to send message: ${err.message}`));

    setOpen(false);
  };

  const statusConfig = {
    available: {
      title: "Get in touch",
      description:
        "We're available now! Send us a message for immediate assistance.",
      statusColor: "text-green-600",
      icon: <CheckCircledIcon className="mr-2 h-4 w-4 text-green-600" />,
    },
    offline: {
      title: "Leave a message",
      description:
        "We're offline at the moment, but we'll respond promptly during business hours.",
      statusColor: "text-blue-600",
      icon: <ClockIcon className="mr-2 h-4 w-4 text-blue-600" />,
    },
  };

  const { title, description } = statusConfig[status];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="flex flex-row gap-2">
          <Pencil2Icon className="size-4" />
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="email" className="text-right pl-1">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              className="col-span-3"
              defaultValue={email || ""}
              required
              tabIndex={-1}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="message" className="text-right pl-1">
              Message
            </Label>
            <Textarea
              name="message"
              className="col-span-3 h-24"
              placeholder="How can we help you today?"
              required
            />
          </div>
          <DialogFooter className="flex flex-col items-center gap-2">
            <Button type="submit">Send message</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
