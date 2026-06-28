/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { ApplyPlaybookButton } from "@/components/ops/apply-playbook-button";
import Link from "next/link";

type Playbook = {
  id: string;
  name: string;
  category: string;
  summary: string;
  steps: { title: string; description: string; priority: string }[];
};

export default async function OpsPlaybooksPage() {
  const { data } = await gtOpsFetch("/playbooks");
  const playbooks = (Array.isArray(data) ? data : []) as Playbook[];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Playbooks</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">
          Reusable remediation templates — apply to spawn tasks in the Action Console.
        </p>
      </header>

      <div className="space-y-4">
        {playbooks.map((pb) => (
          <article key={pb.id} className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-5">
            <p className="text-xs uppercase tracking-wide text-[#F5EBE0]/50">{pb.category.replace(/_/g, " ")}</p>
            <h2 className="mt-1 text-lg font-semibold text-[#F5EBE0]">{pb.name}</h2>
            <p className="mt-2 text-sm text-[#F5EBE0]/75">{pb.summary}</p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[#F5EBE0]/80">
              {pb.steps.map((step) => (
                <li key={step.title}>
                  <span className="font-medium">{step.title}</span>
                  <span className="text-[#F5EBE0]/60"> — {step.description}</span>
                </li>
              ))}
            </ol>
            <ApplyPlaybookButton playbook={pb} />
          </article>
        ))}
      </div>

      <p className="text-sm text-[#F5EBE0]/60">
        Tasks land in{" "}
        <Link href="/ops/tasks" className="text-[#C45C26] hover:underline">
          Action Console
        </Link>
        .
      </p>
    </div>
  );
}
