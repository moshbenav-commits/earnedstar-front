/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { Check, X } from "lucide-react";
import { COMPARE_ROWS, type CompareCell } from "@/lib/marketing-editorial-data";

function CompareCellValue({ cell }: { cell: CompareCell }) {
  if (cell === true) {
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-ink">
        <span className="gold-foil flex h-5 w-5 items-center justify-center rounded-full">
          <Check size={11} className="text-ink" strokeWidth={3} />
        </span>
        Yes
      </span>
    );
  }
  if (cell === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-ink/35">
        <X size={14} strokeWidth={1.5} /> No
      </span>
    );
  }
  return <span className="italic text-ink/70">{cell}</span>;
}

export function ComparisonTableSection() {
  return (
    <section id="comparison" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="mb-14 grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="smallcaps mb-3 text-[10px] text-gold-dark">Receipts — vs. theirs</div>
            <h2 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-tight text-balance">
              Look at the <em className="text-gold-dark">whole</em> table.
              <br />
              Not the brochure.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-pretty text-sm leading-[1.65] text-ink/55">
              Sourced from competitor docs, G2, and merchant complaint threads on Reddit (2026).
              Updated continuously. We&apos;ll correct any line within 24 hours if you flag it — that&apos;s a public
              promise, not a button.
            </p>
          </div>
        </div>

        <div className="vellum-card gilded-edge overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="smallcaps w-[34%] p-5 text-[10px] text-ink/45">Feature</th>
                  <th className="bg-gold-light/20 p-5 font-heading text-2xl italic tracking-tight text-ink">EarnedStar</th>
                  <th className="p-5 text-sm font-bold text-ink/65">Trustpilot</th>
                  <th className="p-5 text-sm font-bold text-ink/65">Yotpo</th>
                  <th className="p-5 text-sm font-bold text-ink/65">Judge.me</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row[0]} className="border-b border-ink/8 transition-colors hover:bg-cream-dark/30">
                    <td className="p-5 text-sm font-medium text-ink/85">{row[0]}</td>
                    {row.slice(1).map((cell, j) => (
                      <td key={j} className={`p-5 text-sm ${j === 0 ? "bg-gold-light/10" : ""}`}>
                        <CompareCellValue cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
