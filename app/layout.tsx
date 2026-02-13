import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import FloatingMascot from "@/components/floating-mascot";
import ClientErrorLogger from "@/components/client-error-logger";
import "leaflet/dist/leaflet.css";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased relative overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-24 left-1/2 h-72 w-[140%] -translate-x-1/2 rotate-6 bg-gradient-to-r from-cyan-400/10 via-fuchsia-400/25 to-amber-400/10 blur-3xl animate-float"></div>
            <div className="absolute top-1/4 -left-10 h-56 w-[120%] rotate-[-8deg] bg-gradient-to-r from-emerald-400/10 via-lime-300/20 to-sky-400/10 blur-3xl animate-float"></div>
            <div className="absolute bottom-10 left-1/2 h-48 w-[120%] -translate-x-1/2 rotate-3 bg-gradient-to-r from-amber-300/10 via-rose-400/20 to-purple-400/10 blur-3xl animate-float"></div>
            <div className="absolute top-20 right-10 h-36 w-36 rounded-full border border-emerald-400/20 animate-pulse-glow"></div>
            <div className="absolute bottom-24 left-12 h-44 w-44 rounded-full border border-cyan-400/20 animate-pulse-glow"></div>
            <div className="absolute top-1/2 right-1/3 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl animate-pulse-glow"></div>
          </div>
          <div className="relative z-10 min-h-screen">
            <ClientErrorLogger />
            <AuthProvider>
              <TooltipProvider>
                {children}
                <FloatingMascot />
                <PWAInstallPrompt />
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
