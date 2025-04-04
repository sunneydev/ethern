import { Pencil2Icon, ReaderIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ContactUsDialog } from "~/components/features/contact-us-dialog";
import { DiscordIcon } from "~/icons/discord-icon";
import { Button } from "~/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/ui/card";

export function GettingStartedCard({
  user,
}: {
  user: {
    email: string;
    username: string;
  };
}) {
  return (
    <Card className="bg-black md:col-span-2 col-span-1 overflow-hidden">
      <CardHeader>
        <CardTitle className="font-bold tracking-tighter">
          Getting Started
        </CardTitle>
        <CardDescription className="text-white/80">
          Explore our docs, reach out to support, or join our Discord community
          server.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row-reverse gap-4">
        <Link href={"/docs"} passHref>
          <Button variant={"outline"} className="flex flex-row gap-2">
            <ReaderIcon className="size-4" />
            Docs
          </Button>
        </Link>

        <Link href={"https://discord.gg/ze8FfAQJ68"} target="_blank" passHref>
          <Button variant={"outline"} className="flex flex-row gap-2">
            <DiscordIcon className="size-4" />
            Community
          </Button>
        </Link>
        <ContactUsDialog email={user.email} />
      </CardContent>
    </Card>
  );
}
