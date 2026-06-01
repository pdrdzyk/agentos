"use client";

import { TaskCard } from "./TaskCard";
import { useAgentOS } from "@/lib/store";

export function TaskBoard() {
  const currentProjectId = useAgentOS((s) => s.currentProjectId);
  const taskGroups = useAgentOS((s) => s.taskGroups);
  const tasks = useAgentOS((s) => s.tasks);
  const selectGroup = useAgentOS((s) => s.selectGroup);

  const groups = taskGroups.filter((g) => g.projectId === currentProjectId);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-50">任务看板</h1>
        <p className="text-sm text-zinc-500">
          按任务组分列 · 点击卡片进入焦距 3
        </p>
      </header>
      <div className="flex flex-1 gap-4 overflow-x-auto p-4">
        {groups.map((group) => {
          const groupTasks = tasks.filter((t) => t.groupId === group.id);
          return (
            <section
              key={group.id}
              className="flex w-72 shrink-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900/50"
            >
              <button
                type="button"
                onClick={() => selectGroup(group.id)}
                className="border-b border-zinc-800 px-3 py-3 text-left hover:bg-zinc-800/50"
              >
                <h2 className="text-sm font-semibold text-zinc-100">
                  {group.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                  {group.leadAgentRole}
                </p>
              </button>
              <div className="flex flex-col gap-2 p-2">
                {groupTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
