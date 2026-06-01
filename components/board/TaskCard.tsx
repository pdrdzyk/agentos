"use client";

import { taskStatusLabel } from "@/lib/task-badges";
import type { Task } from "@/lib/types";
import { useAgentOS } from "@/lib/store";

export function TaskCard({
  task,
  highlight = false,
}: {
  task: Task;
  highlight?: boolean;
}) {
  const currentTaskId = useAgentOS((s) => s.currentTaskId);
  const selectTask = useAgentOS((s) => s.selectTask);
  const isSelected = currentTaskId === task.id;

  return (
    <button
      type="button"
      onClick={() => selectTask(task.id)}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-[#2c2c2e] ${
        isSelected ? "bg-[#2c2c2e]" : ""
      }`}
    >
      {highlight && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff9f0a]" />
      )}
      {!highlight && <span className="w-2 shrink-0" />}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] text-[#f5f5f7]">{task.name}</span>
        {task.agentRole && (
          <span className="mt-0.5 block truncate text-[13px] text-[#8e8e93]">
            {task.agentRole}
          </span>
        )}
      </span>
      <span className="shrink-0 text-[13px] text-[#8e8e93]">
        {taskStatusLabel(task.status)}
      </span>
      <span className="shrink-0 text-[#3a3a3c]">›</span>
    </button>
  );
}
