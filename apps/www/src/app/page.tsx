import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "~/components/features/navbar";
import {
  BenefitCard,
  PricingCard,
  PricingCalculator,
  Description,
  Heading,
  FAQ,
  Spotlight,
} from "~/components/landing";
import { SubHeader } from "~/components/landing/page-header";
import { fixtures } from "~/lib/fixtures";
import { Button } from "~/ui/button";
import { generateMetadata } from "~/lib/metadata";
import { TerminalCard } from "~/components/terminal-card";

export const metadata = generateMetadata({
  title: "Ethern - React Native OTA Updates",
  description:
    "Update your React Native apps instantly, without app store reviews. Start shipping faster today.",
  path: "/",
});

export default async function Home() {
  if ((await cookies()).get("session-token")) {
    redirect("/dashboard/overview");
  }

  return (
    <main>
      <Navbar to="/" mobileDisabled>
        <div className="flex items-center gap-7">
          <Link href="/auth/account/sign-in">
            <Button className="font-semibold">Sign In</Button>
          </Link>
        </div>
      </Navbar>

      <div className="relative flex min-h-[85vh] flex-col overflow-hidden">
        <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="mb-4 sm:mb-5 flex flex-col items-center justify-center text-center">
            <Heading className="gradient-text">
              React Native OTA Updates
            </Heading>
            <Heading className="gradient-text">
              <span className="animated-gradient">Ship</span>
              <span> Faster, </span>
              <span className="animated-gradient">Scale</span>
              <span> Confidently</span>
            </Heading>
          </div>

          <Description className="mb-6 sm:mb-8 font-normal text-[#878787] text-sm sm:text-base text-center max-w-md sm:max-w-lg px-4">
            Deploy React Native updates directly to your users with a single
            command.
          </Description>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full justify-center">
            <Link href="/auth/account/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                Try It Free
              </Button>
            </Link>
            <a href="#pricing" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </a>
          </div>
        </div>

        {/* Terminal Section */}
        <div className="mx-auto mt-16 sm:mt-20 md:mt-24 w-full max-w-4xl px-4">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="text-center max-w-[280px] sm:max-w-lg px-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                One Command to Deploy
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Just run{" "}
                <code className="border-white/20 border px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg mx-[0.85px] text-sm">
                  ethern
                </code>{" "}
                and watch your updates go live instantly.
              </p>
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <TerminalCard />
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Sections */}
      <div className="mx-auto max-w-6xl">
        {/* Benefits Section */}
        <section className="px-10 py-32">
          <div className="mb-14 flex flex-col items-center justify-center">
            <SubHeader>Why Choose Ethern?</SubHeader>
            <Description>
              Our service offers a range of benefits that make it the perfect
              choice for your React Native apps
            </Description>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fixtures.benefits.map((props) => (
              <BenefitCard key={props.title} {...props} />
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-10 py-32">
          <div className="mb-14 flex flex-col items-center justify-center">
            <SubHeader>Pricing</SubHeader>
            <Description className="mt-2 text-center text-[#929292]">
              Flexible Plans to Fit Your Needs
            </Description>
          </div>
          <div className="flex flex-row flex-wrap justify-center gap-3 md:flex-nowrap md:justify-between">
            {fixtures.plans.map((props) => (
              <PricingCard key={props.title} {...props} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">
            * All prices are in USD and do not include taxes. Applicable taxes
            will be added at checkout
          </p>
        </section>

        {/* Pricing Calculator Section */}
        <section className="px-10 py-32" id="pricing-calculator">
          <div className="mb-14 flex flex-col items-center justify-center">
            <SubHeader>Pricing Calculator</SubHeader>
            <Description>
              Estimate your monthly costs between Ethern and Expo
            </Description>
          </div>
          <div className="flex flex-row items-center justify-center">
            <PricingCalculator />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-10 py-32">
          <SubHeader>Frequently Asked Questions</SubHeader>
          <div className="mt-14">
            <FAQ />
          </div>
        </section>

        {/* Footer */}
        <footer className="flex w-full flex-row items-center justify-between px-10 py-10 text-white/50">
          <div className="transition-colors hover:text-white">
            <p>© 2024 Ethern. All rights reserved.</p>
          </div>
          <div className="flex flex-row gap-4">
            <Link
              className="transition-colors hover:text-white"
              href="/info/terms-of-service"
            >
              Terms of Service
            </Link>
            <Link
              className="transition-colors hover:text-white"
              href="/info/privacy-policy"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
