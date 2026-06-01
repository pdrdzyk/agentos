"use client";

import { useAgentOS } from "@/lib/store";

export function TopBar() {
  const projects = useAgentOS((s) => s.projects);
  const tasks = useAgentOS((s) => s.tasks);
  const taskGroups = useAgentOS((s) => s.taskGroups);
  const currentProjectId = useAgentOS((s) => s.currentProjectId);

  const project = projects.find((p) => p.id === currentProjectId);
  const groupIds = new Set(
    taskGroups
      .filter((g) => g.projectId === currentProjectId)
      .map((g) => g.id),
  );
  const projectTasks = tasks.filter((t) => groupIds.has(t.groupId));

  const pending = projectTasks.filter(
    (t) =>
      t.status === "pending_decision" || t.status === "pending_approval",
  ).length;
  const active = projectTasks.filter((t) => t.status === "in_progress").length;

  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-[10px] font-bold text-white">
          A
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-200">
            {project?.name ?? "AgentOS 工作空间"}
          </p>
          <p className="text-[10px] text-zinc-500">
            {project ? "项目运行中" : "等待创建项目"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px]">
        {pending > 0 && (
          <span className="rounded-full border border-amber-500/50 bg-amber-950/50 px-2.5 py-1 font-medium text-amber-300">
            {pending} 待你处理
          </span>
        )}
        <span className="text-zinc-500">
          Agent 进行中 <span className="text-blue-400">{active}</span>
        </span>
        <span className="hidden h-4 w-px bg-zinc-800 sm:block" />
        <span className="hidden text-zinc-600 sm:inline">
          {new Date().toLocaleDateString("zh-CN")}
        </span>
      </div>
    </header>
  );
}
