import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: {
    default: "AirBear - Solar-Powered Rideshare & Mobile Bodega",
    template: "%s | AirBear",
  },
  description:
    "Experience sustainable transportation with AirBear - solar-powered rideshare service with onboard mobile bodegas in Binghamton, NY.",
  keywords: [
    "rideshare",
    "solar powered",
    "mobile bodega",
    "Binghamton NY",
    "sustainable transport",
    "eco-friendly",
  ],
  authors: [{ name: "AirBear" }],
  creator: "AirBear",
  publisher: "AirBear",
  metadataBase: new URL("https://airbear.me"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "AirBear",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://airbear.me/",
    siteName: "AirBear",
    title: "AirBear - Solar-Powered Rideshare & Mobile Bodega",
    description: "Experience sustainable transportation with AirBear",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AirBear - Solar-Powered Rideshare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AirBear - Solar-Powered Rideshare & Mobile Bodega",
    description: "Experience sustainable transportation with AirBear",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
