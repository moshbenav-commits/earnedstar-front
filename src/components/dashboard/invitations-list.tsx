import { recentInvitations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  Completed: "text-green-dark bg-green-pale",
  Opened: "text-navy-light bg-navy-pale",
  Sent: "text-text-muted bg-surface-2",
  Bounced: "text-red-700 bg-red-50",
};

export function InvitationsList() {
  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">Recent invitations</h2>
      <ul className="mt-4 divide-y divide-border">
        {recentInvitations.map((inv) => (
          <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
            <div>
              <p className="font-medium text-navy">{inv.email}</p>
              <p className="text-xs text-text-faint">
                {inv.orderId} · {inv.channel} · {inv.sentAt}
              </p>
            </div>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", statusColor[inv.status])}>
              {inv.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
