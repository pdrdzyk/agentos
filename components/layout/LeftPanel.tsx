"use client";

import { useEffect } from "react";
import { assigneeBadge } from "@/lib/task-badges";
import { useAgentOS } from "@/lib/store";

const statusDot: Record<string, string> = {
  planning: "bg-amber-500",
  active: "bg-emerald-500",
  completed: "bg-zinc-500",
  pending: "bg-zinc-600",
  reviewing: "bg-amber-400",
};

export function LeftPanel() {
  const projects = useAgentOS((s) => s.projects);
  const taskGroups = useAgentOS((s) => s.taskGroups);
  const tasks = useAgentOS((s) => s.tasks);
  const currentProjectId = useAgentOS((s) => s.currentProjectId);
  const currentTaskId = useAgentOS((s) => s.currentTaskId);
  const selectProject = useAgentOS((s) => s.selectProject);
  const selectTask = useAgentOS((s) => s.selectTask);

  useEffect(() => {
    if (projects.length > 0 && !currentProjectId) {
      selectProject(projects[0].id);
    }
  }, [projects, currentProjectId, selectProject]);

  return (
    <aside className="flex h-full w-[240px] flex-col border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
      <div className="border-b border-zinc-800/80 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          工作区导航
        </p>
        <p className="mt-0.5 text-xs text-zinc-400">项目 · 任务组 · 任务</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {projects.length === 0 ? (
          <p className="px-2 text-xs text-zinc-600">创建项目后显示任务树</p>
        ) : (
          projects.map((project) => {
            const groups = taskGroups.filter((g) => g.projectId === project.id);
            const isProjectActive = currentProjectId === project.id;

            return (
              <div key={project.id} className="mb-4">
                <button
                  type="button"
                  onClick={() => selectProject(project.id)}
                  className={`mb-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium transition ${
                    isProjectActive
                      ? "border border-blue-500 bg-blue-900/50 text-zinc-100"
                      : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${statusDot[project.status]}`}
                  />
                  <span className="truncate">{project.name}</span>
                </button>

                <ul className="ml-2 space-y-3 border-l border-zinc-800 pl-2">
                  {groups.map((group) => {
                    const groupTasks = tasks.filter((t) => t.groupId === group.id);
                    return (
                      <li key={group.id}>
                        <p className="px-1 text-[11px] font-semibold text-zinc-400">
                          {group.name}
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {groupTasks.map((task) => {
                            const badge = assigneeBadge(task);
                            const isSelected = currentTaskId === task.id;
                            const needsYou =
                              task.status === "pending_decision" ||
                              task.status === "pending_approval";

                            return (
                              <li key={task.id}>
                                <button
                                  type="button"
                                  onClick={() => selectTask(task.id)}
                                  className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                                    isSelected
                                      ? "border border-blue-500 bg-blue-900/50 text-blue-100"
                                      : needsYou
                                        ? "border border-amber-500/60 bg-amber-950/30 text-amber-100 hover:bg-amber-950/50"
                                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                                  }`}
                                >
                                  <span
                                    className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                                      task.status === "completed"
                                        ? "bg-emerald-500"
                                        : needsYou
                                          ? "bg-amber-400"
                                          : "bg-zinc-600"
                                    }`}
                                  />
                                  <span className="min-w-0 flex-1">
                                    <span className="line-clamp-2 leading-snug">
                                      {task.name}
                                    </span>
                                    <span
                                      className={`mt-0.5 inline-block rounded px-1 text-[9px] font-semibold ${badge.className}`}
                                    >
                                      {badge.label}
                                    </span>
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}
