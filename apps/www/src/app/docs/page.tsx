import { EnvelopeClosedIcon, HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { DiscordIconBlack } from "~/components/icons/discord-icon";
import { Button } from "~/ui/button";
import { Card, CardHeader, CardContent } from "~/ui/card";

export default function Page() {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundImage: "url('/docs-blurred.png')" }}
    >
      <Card className="bg-black max-w-xl w-full drop-shadow-2xl">
        <CardHeader className="pb-2">
          <h2 className="text-3xl font-bold text-white">Ethern Docs</h2>
        </CardHeader>
        <CardContent className="text-white/80 space-y-6">
          <div>
            <h3 className="text-xl text-white font-semibold my-2">
              Coming Soon
            </h3>
            <p className=" font-normal">
              We're gathering user insights to create documentation that fits
              your needs.
            </p>
          </div>
          <div>
            <p className="font-normal mb-3">
              Need help in the meantime? Reach out to us:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="https://ethern.dev" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full bg-white text-black hover:brightness-90 hover:text-black transition-colors duration-300"
                >
                  <HomeIcon className="mr-2 size-4" />
                  <span>Back to Ethern</span>
                </Button>
              </Link>
              <Link
                href="mailto:support@ethern.dev"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full bg-white text-black hover:brightness-90 hover:text-black transition-colors duration-300"
                >
                  <EnvelopeClosedIcon className="mr-2 size-4" />
                  <span>support@ethern.dev</span>
                </Button>
              </Link>
              <Link
                href="https://ethern.dev/info/discord"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full bg-white text-black hover:brightness-90 hover:text-black transition-colors duration-300"
                >
                  <DiscordIconBlack className="mr-2 size-4 stroke-black" />
                  <span>Join our Discord</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
