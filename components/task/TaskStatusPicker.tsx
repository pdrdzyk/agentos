"use client";

import { taskStatusLabel } from "@/lib/task-badges";
import type { TaskStatus } from "@/lib/types";
import { useAgentOS } from "@/lib/store";

const STATUSES: TaskStatus[] = [
  "todo",
  "in_progress",
  "pending_decision",
  "pending_approval",
  "completed",
  "blocked",
];

export function TaskStatusPicker({ taskId, current }: { taskId: string; current: TaskStatus }) {
  const updateTaskStatus = useAgentOS((s) => s.updateTaskStatus);

  return (
    <div className="ios-group">
      <p className="px-4 pb-2 pt-3 text-xs text-[#8e8e93]">状态</p>
      {STATUSES.map((status, i) => (
        <button
          key={status}
          type="button"
          onClick={() => updateTaskStatus(taskId, status)}
          className={`flex w-full items-center justify-between px-4 py-3 text-left text-[15px] transition active:bg-[#2c2c2e] ${
            i < STATUSES.length - 1 ? "border-b ios-separator" : ""
          } ${current === status ? "text-[#0a84ff]" : "text-[#f5f5f7]"}`}
        >
          {taskStatusLabel(status)}
          {current === status && (
            <span className="text-[#0a84ff]" aria-hidden>
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
