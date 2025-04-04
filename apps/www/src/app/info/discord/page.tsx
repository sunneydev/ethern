import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Discord",
  description:
    "Join our Discord server to chat with other developers, ask questions, and get help with your projects.",
} satisfies Metadata;

export default function Page() {
  redirect("https://discord.gg/ze8FfAQJ68");
}
