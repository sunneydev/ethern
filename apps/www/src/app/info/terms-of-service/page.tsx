import { Navbar } from "~/components/features/navbar";
import { Heading } from "~/components/landing";

export default function Page() {
  return (
    <>
      <Navbar to="/" />
      <main className="flex h-72 flex-col items-center justify-center">
        <Heading className="md:text-5xl">Terms of Service</Heading>
      </main>
      <div className="border-white-10 flex flex-grow flex-col items-center border-b border-t bg-white/5 p-10 shadow-md">
        <div className="max-w-5xl [&>p]:font-light [&>ul>li]:font-light">
          <h2 className="mb-2 text-2xl font-bold">Introduction</h2>
          <p className="mb-4">
            Welcome to Ethern, a platform for React Native over-the-air (OTA)
            updates. By accessing or using our website and services, you agree
            to be bound by these Terms of Service (&quot;Terms&quot;) and our
            Privacy Policy.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Service Description</h2>
          <p className="mb-4">
            Ethern enables users to generate and deploy React Native OTA updates
            seamlessly. Our platform allows developers to push updates to their
            mobile apps without the need for submitting new builds to the app
            stores.
          </p>

          <h2 className="mb-2 text-2xl font-bold">User Eligibility</h2>
          <p className="mb-4">
            Ethern does not impose any age restrictions for users. However, by
            using our platform, you represent and warrant that you have the
            legal capacity to enter into a binding agreement and comply with
            these Terms.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Acceptable Use</h2>
          <p className="mb-4">
            When using Ethern to deploy OTA updates, users must ensure that the
            content they upload complies with all applicable laws and
            regulations. Users are strictly prohibited from uploading or
            distributing any content that is illegal, harmful, or infringes upon
            the rights of others. This includes, but is not limited to, content
            containing malware, viruses, or any other malicious code. Ethern
            reserves the right to remove any content deemed inappropriate and
            terminate the accounts of users engaging in prohibited activities.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Intellectual Property</h2>
          <p className="mb-4">
            Ethern respects the intellectual property rights of others. By using
            our platform, you confirm that you have the necessary rights and
            permissions to upload and distribute the content as part of your OTA
            updates. Ethern does not claim any ownership rights over the content
            uploaded by users.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Limitation of Liability</h2>
          <p className="mb-4">
            Ethern shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of or relating to the
            use of our platform or services. We strive to ensure the reliability
            and availability of our platform, but we do not guarantee
            uninterrupted access or error-free functionality.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Termination</h2>
          <p className="mb-4">
            Users can terminate their account and discontinue using
            Ethern&apos;s services at any time by navigating to the account
            settings and following the account deletion process. Alternatively,
            users can contact us at{" "}
            <a
              href="mailto:contact@ethern.dev"
              className="text-blue-500 hover:underline"
            >
              contact@ethern.dev
            </a>{" "}
            for assistance with account termination.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Modifications to Terms</h2>
          <p className="mb-4">
            Ethern reserves the right to modify or update these Terms of Service
            at any time. We will notify users of any material changes via email.
            Continued use of our platform after the modifications constitutes
            acceptance of the updated Terms.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Governing Law</h2>
          <p className="mb-4">
            These Terms of Service shall be governed by and construed in
            accordance with the laws of the jurisdiction in which Ethern
            operates. Any legal action or proceeding arising out of or relating
            to these Terms shall be brought exclusively in the courts of that
            jurisdiction.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Disclaimer of Warranties</h2>
          <p className="mb-4">
            Ethern provides its platform and services on an &quot;as is&quot;
            and &quot;as available&quot; basis, without any warranties of any
            kind, whether express or implied. We do not warrant that the
            platform will be uninterrupted, error-free, or free from harmful
            components.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Contact Us</h2>
          <p>
            If you have any questions, concerns, or feedback regarding these
            Terms of Service, please don&apos;t hesitate to contact us at{" "}
            <a
              href="mailto:contact@ethern.dev"
              className="text-blue-500 hover:underline"
            >
              contact@ethern.dev
            </a>
            . We&apos;re here to assist you.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Fees and Payment</h2>
          <p className="mb-4">We accept the following forms of payment:</p>
          <ul className="mb-4 list-disc pl-6">
            <li>Visa</li>
            <li>Mastercard</li>
            <li>American Express</li>
            <li>Discover</li>
          </ul>
          <p className="mb-4">
            You may be required to purchase or pay a fee to access some of our
            services. You agree to provide current, complete, and accurate
            purchase and account information for all purchases made via the
            Site. You further agree to promptly update account and payment
            information, including email address, payment method, and payment
            card expiration date, so that we can complete your transactions and
            contact you as needed. We bill you through an online billing account
            for purchases made via the Site. Sales tax will be added to the
            price of purchases as deemed required by us. We may change prices at
            any time.
          </p>
          <p className="mb-4">
            You agree to pay all charges or fees at the prices then in effect
            for your purchases, and you authorize us to charge your chosen
            payment provider for any such amounts upon making your purchase. If
            your purchase is subject to recurring charges, then you consent to
            our charging your payment method on a recurring basis without
            requiring your prior approval for each recurring charge, until you
            notify us of your cancellation.
          </p>
          <p className="mb-4">
            We reserve the right to correct any errors or mistakes in pricing,
            even if we have already requested or received payment. We also
            reserve the right to refuse any order placed through the Site.
          </p>

          <h2 className="mb-2 text-2xl font-bold">Cancellation</h2>
          <p className="mb-4">
            All purchases are non-refundable. You can cancel your subscription
            at any time by contacting us using the contact information provided
            below. Your cancellation will take effect at the end of the current
            paid term.
          </p>
          <p className="mb-4">
            If you are unsatisfied with our services, please email us at{" "}
            <a
              href="mailto:contact@ethern.dev"
              className="text-blue-500 hover:underline"
            >
              contact@ethern.dev
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
