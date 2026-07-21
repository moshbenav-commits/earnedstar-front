export type PartnerCategory = "site" | "app" | "game" | "device" | "saas";
export type PartnerStatus = "live" | "staging" | "shell" | "intake" | "pipeline";

export type PartnerEntry = {
  slug: string;
  displayName: string;
  category: PartnerCategory;
  status: PartnerStatus;
  siteUrl?: string | null;
  partnerPageEnabled: boolean;
  showOnCreytixWall: boolean;
  iconMissing?: boolean;
  publicIconHint?: string;
  blurb: string;
  capabilities: string[];
};

export type PartnerPortfolio = {
  version: string;
  updatedAt: string;
  label: string;
  spec: string;
  lockup: {
    pattern: string;
    caption: string;
    storyPath: string;
    creytixUrl: string;
    referenceImage: string;
  };
  entries: PartnerEntry[];
};

/** Keep in sync with brand/creytix/CREYTIX_PARTNER_PORTFOLIO.json */
export const PARTNER_PORTFOLIO: PartnerPortfolio = {
  version: "1.0.0",
  updatedAt: "2026-07-19",
  label: "Creytix partner portfolio — sites, apps, devices running on Creytix",
  spec: "docs/creytix/CREYTIX_PARTNER_PORTFOLIO_SPEC.md",
  lockup: {
    pattern: "partnerIcon + plus + creytixIcon",
    caption: "Partnered with Creytix",
    storyPath: "/partnered-with-creytix",
    creytixUrl: "https://creytix.com",
    referenceImage: "brand/creytix/partner-lockup-reference.png",
  },
  entries: [
    {
      slug: "expediaparts",
      displayName: "Expedia Parts",
      category: "site",
      status: "live",
      siteUrl: "https://www.expediaparts.com",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      publicIconHint: "/favicon/favicon.svg",
      blurb: "Automotive marketplace — catalog, warranty, voice, and creative ops on Creytix.",
      capabilities: [
        "Creytix Forge intake and Brand DNA",
        "Higgsfield / creative pipeline + asset review",
        "PBX, Mail Gorilla, and admin control surface",
      ],
    },
    {
      slug: "expedia-transmissions",
      displayName: "Expedia Reman Transmissions",
      category: "site",
      status: "live",
      siteUrl: "https://www.eptransmissions.com",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      publicIconHint: "/favicon/favicon.svg",
      blurb: "Transmission vertical storefront — shared Expedia Parts stack, Creytix creative + partner mark.",
      capabilities: ["Multi-brand storefront kit", "Mechanical animation pipelines", "Creytix partner lockup"],
    },
    {
      slug: "expedia-engines",
      displayName: "Expedia Reman Engines",
      category: "site",
      status: "live",
      siteUrl: "https://www.expediaremanengines.com",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      publicIconHint: "/favicon/favicon.svg",
      blurb: "Engine vertical storefront — design magic + Creytix production control.",
      capabilities: ["Multi-brand storefront kit", "Design magic playbooks", "Creytix partner lockup"],
    },
    {
      slug: "earnedstar",
      displayName: "EarnedStar",
      category: "saas",
      status: "live",
      siteUrl: "https://earnedstar.com",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      publicIconHint: "/favicon.ico",
      blurb: "Verified reviews SaaS — built and operated on Creytix.",
      capabilities: ["Creytix Brand DNA + site assets", "Review product stack", "Partner lockup + portfolio wall"],
    },
    {
      slug: "sancochi",
      displayName: "Sancochi",
      category: "site",
      status: "staging",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      publicIconHint: "/favicon.ico",
      blurb: "Restaurant brand site — Built by Creytix.",
      capabilities: ["Site Forge scaffold", "Nano Banana marketing stills", "Partner lockup"],
    },
    {
      slug: "quickstudy",
      displayName: "Quick Study Traffic School",
      category: "site",
      status: "shell",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: true,
      publicIconHint: "/favicon.ico",
      blurb: "Online traffic school — Built by Creytix.",
      capabilities: ["Course site kit", "Brand essence pipeline", "Partner lockup"],
    },
    {
      slug: "praxium-law",
      displayName: "Praxium Law",
      category: "saas",
      status: "staging",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      publicIconHint: "/favicon.ico",
      blurb: "Legal practice OS — Partnered with Creytix for platform, design, and ops.",
      capabilities: ["Practice management stack", "Creytix Connect tools", "Partner lockup"],
    },
    {
      slug: "gold-medal-injury",
      displayName: "Gold Medal Injury Law",
      category: "site",
      status: "intake",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      publicIconHint: "/favicon.ico",
      blurb: "Personal injury firm site — Built by Creytix.",
      capabilities: ["Law site kit", "Parallax / hero stills", "Partner lockup"],
    },
    {
      slug: "gotianguis",
      displayName: "Go Tianguis",
      category: "site",
      status: "staging",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: true,
      publicIconHint: "/favicon.ico",
      blurb: "Marketplace brand — Built by Creytix.",
      capabilities: ["Commerce forge patterns", "Site kit payments stubs", "Partner lockup"],
    },
    {
      slug: "alignalgo",
      displayName: "AlignAlgo",
      category: "site",
      status: "staging",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      blurb: "Algorithm-transparency umbrella — the family of Align products, built and run on Creytix.",
      capabilities: ["Umbrella brand system", "Family palette + app-icon set", "Partner lockup + portfolio wall"],
    },
    {
      slug: "aligned-chemistry",
      displayName: "AlignHeart",
      category: "site",
      status: "live",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: false,
      publicIconHint: "/favicon.ico",
      blurb: "Dating / coaching brand — Powered by Creytix.",
      capabilities: ["Coach guardrails", "Persona ecosystem", "Partner lockup"],
    },
    {
      slug: "truestar",
      displayName: "TrueStar",
      category: "saas",
      status: "intake",
      partnerPageEnabled: false,
      showOnCreytixWall: true,
      iconMissing: true,
      blurb: "B2C review marketplace — in intake on Creytix.",
      capabilities: ["Greenfield Site Forge", "Partner portfolio tile"],
    },
    {
      slug: "fast-track-traffic-school",
      displayName: "Fast Track Traffic School",
      category: "site",
      status: "intake",
      partnerPageEnabled: true,
      showOnCreytixWall: true,
      iconMissing: true,
      blurb: "Traffic school brand — Built by Creytix.",
      capabilities: ["Course site kit", "Hare mascot pipeline", "Partner lockup"],
    },
    {
      slug: "lumen",
      displayName: "Lumen Display",
      category: "device",
      status: "pipeline",
      partnerPageEnabled: false,
      showOnCreytixWall: true,
      iconMissing: true,
      blurb: "Physical / display product running on the Creytix platform.",
      capabilities: ["Creytix shell integration", "App-icon showcase tile"],
    },
    {
      slug: "creytix",
      displayName: "Creytix",
      category: "saas",
      status: "live",
      siteUrl: "https://creytix.com",
      partnerPageEnabled: false,
      showOnCreytixWall: false,
      iconMissing: false,
      blurb: "Planning-first AI platform — umbrella for partner brands.",
      capabilities: ["Forge", "Studio", "Design Labs", "Inspector", "Prompt Guard", "Ship", "Dev"],
    },
  ],
};

export function getPartnerPortfolio(): PartnerPortfolio {
  return PARTNER_PORTFOLIO;
}

export function getPartnerEntry(slug: string): PartnerEntry | undefined {
  return PARTNER_PORTFOLIO.entries.find((e) => e.slug === slug);
}

export function getCreytixWallEntries(): PartnerEntry[] {
  return PARTNER_PORTFOLIO.entries.filter((e) => e.showOnCreytixWall);
}

export function partnerStoryPath(): string {
  return PARTNER_PORTFOLIO.lockup.storyPath;
}
