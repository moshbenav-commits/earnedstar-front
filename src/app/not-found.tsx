import Link from "next/link";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <EarnedStarLogo size={32} />
      <h1 className="mt-8 text-3xl font-bold text-navy">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">
        This Review Profile or link may have moved. Verified reviews live on earnedstar.com/store/[slug].
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Home</Button>
        <Button variant="ghost" href="/dashboard">Dashboard</Button>
      </div>
      <Link href="/support" className="mt-6 text-sm text-navy-light hover:text-gold">
        Contact support →
      </Link>
    </div>
  );
}
