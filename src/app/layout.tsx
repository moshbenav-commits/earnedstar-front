import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
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

const siteUrl = "https://earnedstar.com";
const title = "EarnedStar — Reviews Your Customers Actually Earned";
const description =
  "Verified by purchase. Fraud-scored by AI. The only badge that means your reviews are real.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | EarnedStar",
  },
  description,
  metadataBase: new URL(siteUrl),
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "EarnedStar",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: [{ url: "/icon", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('earnedstar-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}else{document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
