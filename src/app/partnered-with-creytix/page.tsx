import { PartneredWithCreytixView, partnerPageMetadata } from "@creytix/partner-kit";

export const metadata = partnerPageMetadata("earnedstar");

export default function Page() {
  return (
    <div data-scroll-theme="light">
      <PartneredWithCreytixView slug="earnedstar" />
    </div>
  );
}
