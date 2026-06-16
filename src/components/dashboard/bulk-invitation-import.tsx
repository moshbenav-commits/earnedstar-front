"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ParsedRow = {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  order_id: string;
  delay_days?: number;
};

const TEMPLATE_CSV = `customer_name,customer_email,customer_phone,order_id,product_sku,delivery_date
Jane Doe,jane@example.com,,ORD-1001,SKU-42,2026-06-20
John Smith,,+15551234567,ORD-1002,SKU-88,2026-06-18`;

function parseCsv(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name);

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const orderId = cols[idx("order_id")];
    if (!orderId) continue;

    const deliveryRaw = cols[idx("delivery_date")];
    let delay_days = 0;
    if (deliveryRaw) {
      const d = new Date(deliveryRaw);
      if (!Number.isNaN(d.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        delay_days = Math.min(14, Math.max(0, Math.ceil((d.getTime() - today.getTime()) / 86400000)));
      }
    }

    rows.push({
      customer_name: cols[idx("customer_name")] || undefined,
      customer_email: cols[idx("customer_email")] || undefined,
      customer_phone: cols[idx("customer_phone")] || undefined,
      order_id: orderId,
      delay_days,
    });
  }
  return rows;
}

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "review-request-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function BulkInvitationImport({
  merchantSlug = "meridian-gear",
  defaultChannel = "email",
  defaultDelayDays = 0,
}: {
  merchantSlug?: string;
  defaultChannel?: "email" | "sms" | "link";
  defaultDelayDays?: number;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; error?: string } | null>(null);

  const ingestFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(String(reader.result ?? ""));
      setRows(parsed);
      setResult(null);
    };
    reader.readAsText(file);
  }, []);

  async function handleBulkSend() {
    if (rows.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/earnedstar/invitations/bulk?slug=${merchantSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          default_channel: defaultChannel,
          default_delay_days: defaultDelayDays,
          invitations: rows.map((r) => ({
            order_id: r.order_id,
            customer_name: r.customer_name,
            customer_email: r.customer_email,
            customer_phone: r.customer_phone,
            delay_days: r.delay_days ?? defaultDelayDays,
            channel: defaultChannel,
          })),
        }),
      });
      const data = (await res.json()) as { message?: string; sent?: number; failed?: number };
      if (!res.ok) throw new Error(data.message ?? "Bulk send failed");
      setResult({ sent: data.sent ?? 0, failed: data.failed ?? 0 });
      setRows([]);
      router.refresh();
    } catch (err) {
      setResult({
        sent: 0,
        failed: rows.length,
        error: err instanceof Error ? err.message : "Bulk send failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">Bulk import</h2>
      <p className="mt-1 text-sm text-text-muted">
        Import customers from CSV —{" "}
        <button type="button" onClick={downloadTemplate} className="font-semibold text-navy-light underline">
          download template
        </button>
      </p>

      <div
        className={cn(
          "mt-4 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
          dragOver ? "border-gold bg-gold-pale/30" : "border-border bg-surface-2/50 hover:border-gold/50",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) ingestFile(file);
        }}
        onClick={() => document.getElementById("bulk-csv-input")?.click()}
      >
        <Upload className="text-text-faint" size={28} aria-hidden />
        <p className="mt-2 text-sm font-medium text-navy">Drop CSV here or click to browse</p>
        <p className="mt-1 text-xs text-text-faint">Up to 100 rows per import</p>
        <input
          id="bulk-csv-input"
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) ingestFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {rows.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-text-faint">
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Order</th>
                <th className="py-2 pr-3">Channel</th>
                <th className="py-2">Delay</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((r) => (
                <tr key={r.order_id} className="border-b border-border/60">
                  <td className="py-2 pr-3 text-navy">{r.customer_name ?? r.customer_email ?? "—"}</td>
                  <td className="py-2 pr-3">{r.order_id}</td>
                  <td className="py-2 pr-3 capitalize">{defaultChannel}</td>
                  <td className="py-2">{(r.delay_days ?? defaultDelayDays) || 0}d</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 10 ? (
            <p className="mt-2 text-xs text-text-faint">+ {rows.length - 10} more rows</p>
          ) : null}
          <Button className="mt-4" onClick={handleBulkSend} disabled={loading}>
            {loading ? "Sending…" : `Send to ${rows.length} customer${rows.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      ) : null}

      {result ? (
        <p
          className={cn(
            "mt-4 rounded-lg px-4 py-3 text-sm",
            result.error ? "bg-red-50 text-red-700" : "bg-green-pale text-green-dark",
          )}
        >
          {result.error ?? `Sent ${result.sent}, failed ${result.failed}.`}
        </p>
      ) : null}
    </section>
  );
}
