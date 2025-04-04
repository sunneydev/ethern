import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/ui/toaster";
import PlausibleProvider from "next-plausible";

export const runtime = "edge";

// Default metadata that can be overridden by pages
export const metadata: Metadata = {
  title: {
    default: "Ethern - React Native OTA Updates",
    template: "%s | Ethern",
  },
  description:
    "Ethern offers streamlined, affordable OTA updates for React Native apps. Easy integration, fast deployment.",
  applicationName: "Ethern",
  authors: [{ name: "Ethern Team", url: "https://ethern.dev" }],
  creator: "Ethern",
  publisher: "Ethern",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  metadataBase: new URL("https://ethern.dev"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "React Native",
    "OTA Updates",
    "Over-the-air Updates",
    "Mobile App Updates",
    "App Deployment",
    "React Native Development",
    "Mobile Development",
    "App Updates",
    "Continuous Deployment",
    "Mobile DevOps",
    "Expo Updates",
    "Expo Alternative",
    "React Native Updates",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ethern.dev",
    siteName: "Ethern",
    title: "Ethern - React Native OTA Updates",
    description:
      "Streamlined, affordable OTA updates for React Native apps. Easy integration, fast deployment.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ethern - React Native OTA Updates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ethern",
    creator: "@ethern",
    images: "/og.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ethern",
  image: "https://ethern.dev/logo",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "iOS, Android",
  description:
    "Ethern offers streamlined, affordable OTA updates for React Native apps. Easy integration, fast deployment.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <PlausibleProvider
          domain="ethern.dev"
          customDomain="https://p.ethern.dev"
          selfHosted
          trackLocalhost
          scriptProps={{ src: "https://p.ethern.dev/js/script.js" }}
          enabled
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={"min-h-screen bg-black font-sans antialiased"}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
