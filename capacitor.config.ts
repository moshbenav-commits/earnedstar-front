/**
 * Capacitor — optional marketing shell for EarnedStar (Next.js on Vercel).
 * Canonical native app: earnedstar-ios/ (SwiftUI) per AI_MOBILE_APP_BUILD_SPEC.md
 *
 * SSOT: ../brand/mobile/FLEET_MOBILE_SITES.json · docs/mobile/FLEET_MOBILE_APPS.md
 *
 * Local dev: CAPACITOR_SERVER_URL=http://<LAN-IP>:3000 npm run mobile:sync
 */
import type { CapacitorConfig } from "@capacitor/cli";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SITE_KEY = "earnedstar";

type FleetSite = {
  appId: string;
  appName: string;
  productionUrl: string;
  backgroundColor: string;
  themeColor: string;
  urlScheme: string;
  allowNavigation: string[];
};

const FALLBACK: FleetSite = {
  appId: "com.earnedstar.app",
  appName: "EarnedStar",
  productionUrl: "https://earnedstar.com",
  backgroundColor: "#0A1628",
  themeColor: "#0A1628",
  urlScheme: "earnedstar",
  allowNavigation: ["*.earnedstar.com", "earnedstar-back.vercel.app"],
};

function loadSite(): FleetSite {
  const fleetJsonPath = join(__dirname, "..", "brand", "mobile", "FLEET_MOBILE_SITES.json");
  if (!existsSync(fleetJsonPath)) return FALLBACK;

  try {
    const raw = JSON.parse(readFileSync(fleetJsonPath, "utf8")) as {
      sites?: Record<string, Partial<FleetSite>>;
    };
    const site = raw.sites?.[SITE_KEY];
    if (!site) return FALLBACK;
    return { ...FALLBACK, ...site };
  } catch {
    return FALLBACK;
  }
}

const site = loadSite();
const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim() || site.productionUrl;
const isCleartext =
  serverUrl.startsWith("http://") ||
  /^https?:\/\/(localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+)(:\d+)?/.test(serverUrl);

const config: CapacitorConfig = {
  appId: site.appId,
  appName: site.appName,
  webDir: "mobile-shell",
  server: {
    url: serverUrl,
    cleartext: isCleartext,
    androidScheme: "https",
    iosScheme: isCleartext ? "http" : "https",
    allowNavigation: site.allowNavigation,
  },
  ios: {
    contentInset: "always",
    scheme: site.urlScheme,
    backgroundColor: site.backgroundColor,
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  android: {
    backgroundColor: site.backgroundColor,
    allowMixedContent: false,
    captureInput: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: site.backgroundColor,
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: site.themeColor,
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
