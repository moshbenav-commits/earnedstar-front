"use client";

import { useEffect, useState } from "react";

type EmailStatus = {
  provider: string;
  invitationsReady: boolean;
  smtp: { configured: boolean; host: string | null; from: string; replyTo: string | null };
  hint: string;
};

export function EmailStatusPanel() {
  const [status, setStatus] = useState<EmailStatus | null>(null);

  useEffect(() => {
    fetch("/api/earnedstar/email/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setStatus(data as EmailStatus | null))
      .catch(() => undefined);
  }, []);

  const ready = status?.invitationsReady;

  return (
    <section className="card-surface max-w-2xl p-6">
      <h2 className="text-lg font-bold text-navy">Email delivery</h2>
      <p className="mt-1 text-sm text-text-muted">
        Review invitations send from <strong>invitations@earnedstar.com</strong> via Mail Gorilla SMTP.
      </p>
      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <dt className="font-semibold text-navy">Invitation email</dt>
          <dd className={ready ? "text-xs font-semibold text-green-dark" : "text-xs font-semibold text-amber-700"}>
            {ready ? "Ready" : "Not configured"}
          </dd>
        </div>
        {status && (
          <>
            <div>
              <dt className="font-semibold text-navy">SMTP host</dt>
              <dd className="mt-1 text-text-muted">{status.smtp.host ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">From address</dt>
              <dd className="mt-1 text-text-muted">{status.smtp.from}</dd>
            </div>
            <p className="text-xs text-text-faint">{status.hint}</p>
          </>
        )}
      </dl>
      <p className="mt-4 text-xs text-text-faint">
        Setup guide: <code>docs/EARNEDSTAR_EMAIL_SETUP.md</code> in the workspace repo.
      </p>
    </section>
  );
}
