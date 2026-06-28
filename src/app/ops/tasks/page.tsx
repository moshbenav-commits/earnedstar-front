/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { CreateTaskForm } from "@/components/ops/create-task-form";
import { TaskConsole } from "@/components/ops/task-console";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  owner_email: string | null;
};

export default async function OpsTasksPage() {
  const { data } = await gtOpsFetch("/tasks");
  const tasks = (Array.isArray(data) ? data : []) as Task[];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Action Console</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Turn findings into tracked remediation work.</p>
      </header>

      <CreateTaskForm />

      <TaskConsole tasks={tasks} />
    </div>
  );
}
