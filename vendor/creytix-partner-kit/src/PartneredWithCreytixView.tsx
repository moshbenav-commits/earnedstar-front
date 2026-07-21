import { CreytixPartnerLockup } from "./CreytixPartnerLockup";
import { getPartnerEntry } from "./portfolio";

type Props = {
  slug: string;
  homeHref?: string;
};

/** Plain metadata shape — sites map into Next `Metadata` at the page boundary. */
export type PartnerPageMetadata = {
  title: string;
  description: string;
};

export function partnerPageMetadata(slug: string): PartnerPageMetadata {
  const entry = getPartnerEntry(slug);
  const name = entry?.displayName ?? "This brand";
  return {
    title: `Partnered with Creytix | ${name}`,
    description: entry?.blurb ?? `${name} is partnered with Creytix.`,
  };
}

/** Shared partnership story for satellite marketing shells (no Next imports). */
export function PartneredWithCreytixView({ slug, homeHref = "/" }: Props) {
  const entry = getPartnerEntry(slug);
  const name = entry?.displayName ?? "This brand";

  return (
    <main className="min-h-[60vh] bg-[#0B1220] px-4 py-16 text-white" data-surface="dark">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Partnership</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Partnered with Creytix</h1>
        <div className="mt-10">
          <CreytixPartnerLockup
            partnerName={name}
            partnerInitial={name.charAt(0)}
            partnerIconSrc={entry?.publicIconHint}
            size="lg"
            surface="dark"
            showCaption={false}
            link={false}
          />
        </div>
        <p className="mt-8 text-lg text-white/80">{entry?.blurb}</p>
        {entry?.capabilities?.length ? (
          <ul className="mt-6 list-disc space-y-2 pl-5 text-white/70">
            {entry.capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}
        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="https://creytix.com"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#0B1220]"
          >
            Visit Creytix
          </a>
          <a
            href="https://creytix.com/customers"
            className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold"
          >
            See who runs on Creytix
          </a>
          <a href={homeHref} className="px-2 py-2.5 text-sm text-white/55 underline-offset-2 hover:underline">
            Back home
          </a>
        </div>
      </div>
    </main>
  );
}
