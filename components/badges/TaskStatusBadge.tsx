import { assigneeBadge, taskStatusClass, taskStatusLabel } from "@/lib/task-badges";
import type { Task } from "@/lib/types";

export function TaskStatusBadge({ task }: { task: Task }) {
  const assignee = assigneeBadge(task);
  return (
    <div className="flex flex-wrap gap-1">
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${assignee.className}`}
      >
        {assignee.label}
      </span>
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${taskStatusClass(task.status)}`}
      >
        {taskStatusLabel(task.status)}
      </span>
    </div>
  );
}
