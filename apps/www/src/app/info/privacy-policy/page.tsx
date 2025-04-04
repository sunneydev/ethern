import { Metadata } from "next";
import { Navbar } from "~/components/features/navbar";
import { Heading } from "~/components/landing";

export const metadata = {
  title: "Privacy Policy",
  description:
    "This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.",
} satisfies Metadata;

export default function Page() {
  return (
    <>
      <Navbar to="/" />
      <main className="flex h-72 flex-col items-center justify-center">
        <Heading className="md:text-5xl">Privacy Policy</Heading>
      </main>
      <div className="border-white-10 flex flex-grow flex-col items-center border-b border-t bg-white/5 p-10 shadow-md">
        <div className="max-w-5xl [&>p]:font-light [&>ul>li]:font-light">
          <h2 className="mb-2 text-2xl font-bold">Introduction</h2>
          <p className="mb-4">
            At our website, we value your privacy and are committed to
            protecting your personal information. This privacy policy outlines
            the types of information we collect, how we use it, and your rights
            regarding your data.
          </p>
          <h2 className="mb-2 text-2xl font-bold">Information We Collect</h2>
          <p className="mb-4">
            When you sign up for an account on our website, we collect certain
            information to provide you with a personalized experience and ensure
            the security of your account. This information includes:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>Email address (provided by you during registration)</li>
            <li>Username and avatar (if you sign up using GitHub or Google)</li>
            <li>User-agent device information (automatically collected)</li>
            <li>IP address (automatically collected)</li>
          </ul>
          <p className="mb-4">
            Additionally, we use Sentry for error tracking and performance
            monitoring:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>Error details and stack traces</li>
            <li>Device and browser information</li>
            <li>Performance data</li>
          </ul>
          <h2 className="mb-2 text-2xl font-bold">
            How We Use Your Information
          </h2>
          <p className="mb-4">
            We use the collected information for the following purposes:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>
              To display information about your logged-in devices, allowing you
              to monitor your account sessions
            </li>
            <li>
              To manage and maintain your user sessions using authentication
              cookies, eliminating the need to re-enter credentials each time
              you visit our website
            </li>
            <li>
              To monitor and improve the performance and reliability of our
              website using Sentry
            </li>
          </ul>
          <h2 className="mb-2 text-2xl font-bold">Third-Party Services</h2>
          <h3 className="mb-2 text-xl font-semibold">Sentry</h3>
          <p className="mb-4">
            We use Sentry, a third-party error tracking and performance
            monitoring service, to help us identify and fix issues with our
            website. Sentry collects the following information:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>
              Error details and stack traces: This helps us understand what went
              wrong and how to fix it.
            </li>
            <li>
              Device and browser information: This allows us to reproduce and
              fix issues specific to certain environments.
            </li>
            <li>
              Performance data: This helps us optimize our website's speed and
              responsiveness.
            </li>
          </ul>
          <p className="mb-4">
            Sentry may process personal data as part of the error reports.
            However, we configure Sentry to minimize the collection of personal
            information and to scrub sensitive data from error reports.
          </p>
          <p className="mb-4">
            For more information about Sentry's data practices, please visit
            their{" "}
            <a
              href="https://sentry.io/privacy/"
              className="text-blue-500 hover:underline"
            >
              privacy policy
            </a>
            .
          </p>
          <h2 className="mb-2 text-2xl font-bold">Data Retention</h2>
          <p className="mb-4">
            We retain error logs and performance data collected by Sentry for a
            limited period (typically 30 days) to allow us to investigate and
            resolve issues. After this period, the data is automatically
            deleted.
          </p>
          <h2 className="mb-2 text-2xl font-bold">Cookies</h2>
          <p className="mb-4">
            Please note that we do not use any user tracking software. We only
            use cookies for user session management.
          </p>
          <p className="mb-4">
            However, we use Plausible Analytics to help us understand visitor
            trends and the effectiveness of our marketing outreach.
          </p>
          <p className="mb-4">
            We chose Plausible Analytics because it is a privacy-focused company
            and platform that eschews personally identifiable information in
            favor of anonymous aggregate data. Note: Plausible Analytics does
            not use cookies and does not track individual users and it is
            self-hosted on our servers, no data is shared with third parties.
          </p>
          <h2 className="mb-2 text-2xl font-bold">Your Rights and Choices</h2>
          <p className="mb-4">
            You have control over your personal information and can exercise the
            following rights:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>
              You can delete your account and associated information through the
              account settings page on our website
            </li>
            <li>
              If you have any questions, concerns, or requests regarding the
              deletion of your user information, you can contact us at{" "}
              <a
                href="mailto:contact@ethern.dev"
                className="text-blue-500 hover:underline"
              >
                contact@ethern.dev
              </a>
            </li>
            <li>
              If you have concerns about the data collected by Sentry, you can
              contact us to request the deletion of specific error reports or to
              opt-out of performance monitoring.
            </li>
          </ul>
          <p className="mb-4">
            We are committed to responding to your inquiries in a timely manner
            and assisting you with any privacy-related matters.
          </p>
          <p>
            If you have any further questions or require additional
            clarification regarding our privacy practices, please don&apos;t
            hesitate to reach out to us.
          </p>
        </div>
      </div>
    </>
  );
}
