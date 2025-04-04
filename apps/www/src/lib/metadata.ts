import type { Metadata } from "next";
import { getEnv } from "~/server/env";

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  openGraph?: {
    images?: string[];
  };
}

export function generateMetadata({
  title,
  description,
  path,
  openGraph,
}: GenerateMetadataProps): Metadata {
  const baseUrl = "https://ethern.dev";
  const url = `${baseUrl}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ethern",
      locale: "en_US",
      type: "website",
      images: openGraph?.images || ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: openGraph?.images || ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
