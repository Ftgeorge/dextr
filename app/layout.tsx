import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SimpleOnboardingProvider } from "@/components/workshop/simple-onboarding";
import { TourProvider } from "@/components/tour/tour-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dextr UI",
  description: "Dextr UI is a curated collection of reusable, accessible, and customizable UI components built for modern web applications. Preview components live, explore usage patterns, and copy production-ready code with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SimpleOnboardingProvider>
          <TourProvider>
            {children}
          </TourProvider>
        </SimpleOnboardingProvider>
      </body>
    </html>
  );
}
