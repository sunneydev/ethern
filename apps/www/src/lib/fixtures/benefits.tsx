import {
  LightningBoltIcon,
  FaceIcon,
  RocketIcon,
  BarChartIcon,
  ArrowDownIcon,
  StackIcon,
} from "@radix-ui/react-icons";

export const benefits = [
  {
    title: "Instant Deployment",
    description:
      "Deploy updates instantly across all devices, ensuring your React Native apps are always up-to-date without downtime.",
    icon: <LightningBoltIcon className="h-5 w-5" />,
  },
  {
    title: "Scalable",
    description:
      "Our service scales with your needs, supporting everything from small apps to large-scale enterprise solutions efficiently.",
    icon: <RocketIcon className="h-5 w-5" />,
  },
  {
    title: "Expo-Compatible",
    description:
      "Drop-in replacement for Expo Updates with zero code changes required. Keep your existing workflow while enjoying faster deployments and lower costs.",
    icon: <FaceIcon className="h-5 w-5" />,
  },
  {
    title: "Cost Savings",
    description:
      "Save on costs with our competitive pricing model, offering a cost-effective solution for your React Native apps.",
    icon: <BarChartIcon className="h-5 w-5" />,
    tooltip: (
      <a
        href="#pricing-calculator"
        className="pl-0 text-sm font-medium hover:underline"
      >
        Compare with Expo
        <ArrowDownIcon className="ml-1 inline-block h-4 w-4" />
      </a>
    ),
  },
  {
    title: "Advanced Rollouts",
    description:
      "Empower your updates with advanced rollout capabilities, including A/B testing and staged deployments.",
    icon: <StackIcon className="h-5 w-5" />,
  },
];
