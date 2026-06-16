import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EarnedStar — Reviews Your Customers Actually Earned",
    template: "%s | EarnedStar",
  },
  description:
    "Verified by purchase. Fraud-scored by AI. The only badge that means your reviews are real.",
  metadataBase: new URL("https://earnedstar.com"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/brand/photo/earnedstar-photo-logo-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/photo/earnedstar-photo-logo-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/brand/photo/earnedstar-photo-logo-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${instrument.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
