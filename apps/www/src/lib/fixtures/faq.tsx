import Link from "next/link";

export const faq = [
  {
    question: "What is Ethern?",
    answer:
      "Ethern is a platform that provides over-the-air (OTA) updates for React Native applications, allowing developers to seamlessly update their apps without requiring users to download updates from app stores.",
  },
  {
    question: "What is OTA (Over-the-Air) updating?",
    answer:
      "OTA updating is a way for developers to update their apps remotely without users having to manually download and install updates. It allows developers to send updates, bug fixes, and new features directly to users' devices over the internet. With OTA updates, users can get the latest version of an app automatically, making the update process simple and seamless.",
  },
  {
    question: "What are the benefits of OTA updates for React Native apps?",
    answer: (
      <ul className="list-inside list-disc space-y-1">
        <li>
          Instant updates: Users receive updates immediately without the need to
          manually download and install them from app stores.
        </li>
        <li>
          Bypassing app store approvals: Minor updates and bug fixes can be
          deployed without going through the app store review process.
        </li>
        <li>
          Gradual rollout: Updates can be rolled out gradually to a subset of
          users, allowing for controlled deployment and monitoring.
        </li>
        <li>
          Reduced user friction: Users don&apos;t need to take any action to
          receive updates, improving the overall user experience.
        </li>
      </ul>
    ),
  },
  {
    question: "How does Ethern work?",
    answer: (
      <span>
        Ethern uses the{" "}
        <Link
          href="https://docs.expo.dev/versions/latest/sdk/updates/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          expo-updates
        </Link>{" "}
        module to deliver updates to React Native apps. Developers push their
        code changes to the Ethern platform, which stores and manages the update
        packages.
        <br />
        <br /> When a user opens the app, the module checks for available
        updates and downloads them in the background. The updates are then
        applied with or without requiring any user interaction, ensuring that
        users have the latest version of the app.
        <br />
        <br /> When an update is available, the platform securely delivers the
        update to the users&apos; devices, and the app updates itself
        automatically without requiring any user intervention.
      </span>
    ),
  },
  {
    question: "What are the benefits of using Ethern?",
    answer: (
      <ul className="list-inside list-disc space-y-1">
        <li>
          Seamless and efficient app updates without relying on app store
          approvals
        </li>
        <li>Reduced development and deployment time</li>
        <li>Ability to quickly fix bugs and introduce new features</li>
        <li>Improved user experience with automatic updates</li>
        <li>Cost-effective pricing compared to other similar platforms</li>
      </ul>
    ),
  },
  {
    question: "Is Ethern secure?",
    answer:
      "Yes, Ethern prioritizes security. All updates are securely transmitted and verified to ensure the integrity of the application. We employ industry-standard encryption and authentication mechanisms to protect your app and user data.",
  },
  {
    question: "What pricing plans does Ethern offer?",
    answer: (
      <ul className="list-inside list-disc space-y-1">
        <li>Free Tier: Free for up to 1,000 monthly updated users.</li>
        <li>
          Starter Tier: $19 per month for up to 50,000 monthly updated users.
        </li>
        <li>
          Pro Tier: $79 per month for up to 250,000 monthly updated users. then
          $0.0005 per user.
        </li>
      </ul>
    ),
  },
  {
    question: "How do I get started with Ethern?",
    answer:
      "Getting started with Ethern is easy. Simply sign up for an account on our website, follow the setup and start deploying updates. We provide comprehensive documentation and support to guide you through the process.",
  },
  {
    question: "What kind of support does Ethern provide?",
    answer:
      "We offer various support channels to assist you, including email support, online documentation, and a community forum. Our dedicated support team is available to answer your questions and help you with any issues you may encounter.",
  },
  {
    question: "Can I use Ethern with any React Native version?",
    answer:
      "Ethern is compatible with React Native versions 0.60 and above. We continuously update our platform to support the latest versions of React Native, ensuring compatibility and optimal performance.",
  },
];
