import type { InvitationRow } from "@/lib/earnedstar-server";
import { recentInvitations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  completed: "text-green-dark bg-green-pale",
  opened: "text-navy-light bg-navy-pale",
  sent: "text-text-muted bg-surface-2",
  scheduled: "text-text-muted bg-surface-2",
  bounced: "text-red-700 bg-red-50",
  expired: "text-text-faint bg-surface-2",
  Completed: "text-green-dark bg-green-pale",
  Opened: "text-navy-light bg-navy-pale",
  Sent: "text-text-muted bg-surface-2",
  Bounced: "text-red-700 bg-red-50",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

export function InvitationsList({
  invitations,
  showAll = false,
}: {
  invitations?: InvitationRow[];
  showAll?: boolean;
}) {
  const rows =
    invitations?.length
      ? invitations.map((inv) => ({
          id: inv.id,
          email: inv.customer_email,
          orderId: inv.order_id,
          channel: inv.channel,
          sentAt: formatDate(inv.sent_at),
          status: inv.status,
          token: inv.token,
        }))
      : recentInvitations;

  const list = showAll ? rows : rows.slice(0, 5);

  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">{showAll ? "All invitations" : "Recent invitations"}</h2>
      {list.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">No invitations yet. Send your first one above.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {list.map((inv) => (
            <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-medium text-navy">{inv.email}</p>
                <p className="text-xs text-text-faint">
                  {inv.orderId} · {inv.channel} · {inv.sentAt}
                  {"token" in inv && inv.token ? (
                    <>
                      {" "}
                      ·{" "}
                      <a href={`/submit/${inv.token}`} className="text-navy-light hover:text-gold">
                        link
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                  statusColor[inv.status] ?? statusColor.sent,
                )}
              >
                {inv.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
