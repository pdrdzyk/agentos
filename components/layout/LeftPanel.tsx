"use client";

import { useAgentOS } from "@/lib/store";

const statusDot: Record<string, string> = {
  planning: "bg-amber-500",
  active: "bg-emerald-500",
  completed: "bg-zinc-500",
  pending: "bg-zinc-600",
  reviewing: "bg-amber-400",
};

export function LeftPanel() {
  const focus = useAgentOS((s) => s.focus);
  const projects = useAgentOS((s) => s.projects);
  const taskGroups = useAgentOS((s) => s.taskGroups);
  const tasks = useAgentOS((s) => s.tasks);
  const currentProjectId = useAgentOS((s) => s.currentProjectId);
  const currentGroupId = useAgentOS((s) => s.currentGroupId);
  const currentTaskId = useAgentOS((s) => s.currentTaskId);
  const setFocus = useAgentOS((s) => s.setFocus);
  const selectProject = useAgentOS((s) => s.selectProject);
  const selectGroup = useAgentOS((s) => s.selectGroup);
  const selectTask = useAgentOS((s) => s.selectTask);

  const showProjects = focus <= 2;
  const showGroupTasks = focus === 3;

  const groups = taskGroups.filter((g) => g.projectId === currentProjectId);
  const groupTasks = tasks.filter((t) => t.groupId === currentGroupId);

  return (
    <aside className="flex h-full flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 px-3 py-3">
        <p className="text-xs font-bold tracking-wider text-blue-400">AgentOS</p>
        <div className="mt-2 flex gap-1">
          {([1, 2, 3] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFocus(f)}
              className={`flex-1 rounded py-1 text-[10px] font-medium ${
                focus === f
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-500 hover:bg-zinc-900"
              }`}
            >
              焦距{f}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {showProjects && (
          <>
            <p className="px-2 py-1 text-[10px] uppercase text-zinc-600">
              项目
            </p>
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectProject(p.id)}
                className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${
                  currentProjectId === p.id && focus >= 2
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${statusDot[p.status]}`}
                />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </>
        )}

        {focus >= 2 && currentProjectId && (
          <>
            <p className="mt-3 px-2 py-1 text-[10px] uppercase text-zinc-600">
              任务组
            </p>
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => selectGroup(g.id)}
                className={`mb-1 block w-full rounded-lg px-2 py-2 text-left text-xs ${
                  currentGroupId === g.id && focus === 3
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:bg-zinc-900"
                }`}
              >
                {g.name}
              </button>
            ))}
          </>
        )}

        {showGroupTasks && (
          <>
            <p className="mt-3 px-2 py-1 text-[10px] uppercase text-zinc-600">
              任务
            </p>
            {groupTasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTask(t.id)}
                className={`mb-1 block w-full truncate rounded-lg px-2 py-2 text-left text-xs ${
                  currentTaskId === t.id
                    ? "bg-blue-950/50 text-blue-200"
                    : "text-zinc-500 hover:bg-zinc-900"
                }`}
              >
                {t.name}
              </button>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
