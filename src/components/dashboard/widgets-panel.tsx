import { Button } from "@/components/ui/button";
import { EarnedStarPhotoBadge } from "@/components/brand/earnedstar-photo-badge";
import { activeWidgets } from "@/lib/mock-data";

export function WidgetsPanel() {
  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">Active widgets</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {activeWidgets.map((widget) => (
          <div key={widget.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-navy">{widget.name}</p>
                <p className="text-xs text-text-faint">{widget.type}</p>
              </div>
              {widget.type === "Badge" ? (
                <EarnedStarPhotoBadge variant="navy" size={40} logoFallback="E" />
              ) : (
                <div className="h-10 w-16 rounded-md bg-navy-pale" aria-hidden />
              )}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-text-muted">
              <span>{widget.views.toLocaleString()} views</span>
              <span>{widget.ctr} CTR</span>
            </div>
            <Button variant="ghost" size="sm" className="mt-3 w-full">
              Get snippet
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
