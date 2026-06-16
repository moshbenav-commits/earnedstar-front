import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

const widgetTypes = [
  { id: "badge", name: "Badge", desc: "Small star rating + count for header/footer" },
  { id: "carousel", name: "Carousel", desc: "Horizontal scrolling review cards" },
  { id: "grid", name: "Grid", desc: "Masonry grid of up to 9 reviews" },
  { id: "testimonial", name: "Testimonial", desc: "Single featured review, large format" },
  { id: "feed", name: "Feed", desc: "Vertical list of most recent reviews" },
  { id: "floating", name: "Floating", desc: "Bottom-right bubble with latest review" },
];

export default function WidgetsPage() {
  const embedCode = `<script src="https://cdn.earnedstar.com/widget.js" data-key="YOUR_API_KEY" data-widget="carousel" data-max="6"></script>`;

  return (
    <>
      <DashboardTopbar title="Widgets" />
      <main className="p-8">
        <p className="text-text-secondary">
          Copy the code below and paste it anywhere on your website.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {widgetTypes.map((widget) => (
            <div key={widget.id} className="card-surface p-6">
              <h3 className="font-semibold text-text-primary">{widget.name}</h3>
              <p className="mt-1 text-sm text-text-secondary">{widget.desc}</p>
              <div className="mt-4 rounded-md border border-border bg-bg-elevated p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-star">★★★★★</span>
                  <span className="text-sm text-text-muted">4.7 · 2,847 reviews</span>
                </div>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-md bg-bg-elevated p-3 text-xs text-text-secondary">
                {embedCode.replace("carousel", widget.id)}
              </pre>
              <button
                type="button"
                className="mt-3 text-sm text-accent hover:underline"
              >
                Copy embed code
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
