/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { ReviewQueuePanel } from "@/components/ops/review-queue-panel";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  owner_email: string | null;
  description: string | null;
};

export default async function OpsReviewPage() {
  const { data } = await gtOpsFetch("/tasks?status=in_review");
  const tasks = (Array.isArray(data) ? data : []) as Task[];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Review queue</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">
          Approve completed remediation or send tasks back for more work.
        </p>
      </header>

      <ReviewQueuePanel tasks={tasks} />

      <p className="text-sm text-[#F5EBE0]/60">
        Drag tasks to <strong>In review</strong> on the{" "}
        <Link href="/ops/tasks" className="text-[#C45C26] hover:underline">
          Action Console board
        </Link>
        .
      </p>
    </div>
  );
}
