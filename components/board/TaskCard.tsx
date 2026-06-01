"use client";

import { TaskStatusBadge } from "@/components/badges/TaskStatusBadge";
import { taskStatusLabel } from "@/lib/task-badges";
import type { Task, TaskStatus } from "@/lib/types";
import { useAgentOS } from "@/lib/store";

const STATUSES: TaskStatus[] = [
  "todo",
  "in_progress",
  "pending_decision",
  "pending_approval",
  "completed",
  "blocked",
];

function statusTagClass(status: TaskStatus, active: boolean): string {
  if (!active) {
    return "border-zinc-700 bg-zinc-950 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300";
  }
  switch (status) {
    case "completed":
      return "border-emerald-500 bg-emerald-950/60 text-emerald-200";
    case "pending_decision":
    case "pending_approval":
      return "border-amber-500 bg-amber-950/60 text-amber-200";
    case "in_progress":
      return "border-blue-500 bg-blue-900/50 text-blue-200";
    case "blocked":
      return "border-zinc-500 bg-zinc-800 text-zinc-300";
    default:
      return "border-zinc-600 bg-zinc-800 text-zinc-200";
  }
}

export function TaskCard({
  task,
  variant = "default",
}: {
  task: Task;
  variant?: "default" | "intervention";
}) {
  const currentTaskId = useAgentOS((s) => s.currentTaskId);
  const selectTask = useAgentOS((s) => s.selectTask);
  const updateTaskStatus = useAgentOS((s) => s.updateTaskStatus);

  const isSelected = currentTaskId === task.id;
  const isIntervention = variant === "intervention";

  return (
    <article
      className={`rounded-xl border bg-zinc-900 transition ${
        isIntervention
          ? "border-amber-500 bg-amber-950/50 p-5 shadow-lg shadow-amber-950/20"
          : isSelected
            ? "border-blue-500 bg-blue-900/50 p-4"
            : "border-zinc-800 p-4 hover:border-zinc-600"
      }`}
    >
      <button
        type="button"
        onClick={() => selectTask(task.id)}
        className="w-full text-left"
      >
        <p
          className={`font-medium text-zinc-100 ${isIntervention ? "text-base" : "text-sm"}`}
        >
          {task.name}
        </p>
        {task.agentRole && (
          <p className="mt-1 text-xs text-zinc-500">{task.agentRole}</p>
        )}
        <p className="mt-2 line-clamp-2 text-xs text-zinc-400">
          {task.completionCriteria}
        </p>
        <div className="mt-3">
          <TaskStatusBadge task={task} />
        </div>
      </button>

      <div
        className="mt-3 flex flex-wrap gap-1.5"
        role="group"
        aria-label="切换任务状态"
      >
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => updateTaskStatus(task.id, status)}
            className={`rounded-md border px-2 py-1 text-[10px] font-medium transition ${statusTagClass(status, task.status === status)}`}
          >
            {taskStatusLabel(status)}
          </button>
        ))}
      </div>
    </article>
  );
}
