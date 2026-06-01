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

export function TaskCard({ task }: { task: Task }) {
  const selectTask = useAgentOS((s) => s.selectTask);
  const updateTaskStatus = useAgentOS((s) => s.updateTaskStatus);

  return (
    <button
      type="button"
      onClick={() => selectTask(task.id)}
      className="w-full rounded-lg border border-zinc-700/80 bg-zinc-900/80 p-3 text-left transition hover:border-zinc-500"
    >
      <p className="text-sm font-medium text-zinc-100">{task.name}</p>
      {task.agentRole && (
        <p className="mt-1 text-xs text-zinc-500">{task.agentRole}</p>
      )}
      <div className="mt-2">
        <TaskStatusBadge task={task} />
      </div>
      <select
        className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-300"
        value={task.status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          updateTaskStatus(task.id, e.target.value as TaskStatus)
        }
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {taskStatusLabel(s)}
          </option>
        ))}
      </select>
    </button>
  );
}
