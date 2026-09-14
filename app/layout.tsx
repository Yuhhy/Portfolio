import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Nguyen Tan Huy — Portfolio";
const description =
  "Portfolio of Nguyen Tan Huy, featuring selected projects, experience, and resume.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ?? (host?.includes("localhost") ? "http" : "https");
  const origin = host
    ? protocol + "://" + host
    : "https://michael-smith-collection-26.tanhuypl0204.chatgpt.site";
  const imageUrl = new URL("/og.png", origin).toString();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: origin,
      siteName: "Nguyen Tan Huy Portfolio",
      images: [
        {
          url: imageUrl,
          width: 1760,
          height: 907,
          alt: "Nguyen Tan Huy portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
