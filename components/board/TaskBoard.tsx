"use client";

import { TaskCard } from "./TaskCard";
import { useAgentOS } from "@/lib/store";
import type { Task } from "@/lib/types";

function isInterventionTask(task: Task) {
  return (
    task.status === "pending_decision" || task.status === "pending_approval"
  );
}

export function TaskBoard() {
  const currentProjectId = useAgentOS((s) => s.currentProjectId);
  const taskGroups = useAgentOS((s) => s.taskGroups);
  const tasks = useAgentOS((s) => s.tasks);
  const projects = useAgentOS((s) => s.projects);

  const project = projects.find((p) => p.id === currentProjectId);
  const groups = taskGroups.filter((g) => g.projectId === currentProjectId);
  const projectTasks = tasks.filter((t) =>
    groups.some((g) => g.id === t.groupId),
  );
  const interventionTasks = projectTasks.filter(isInterventionTask);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="shrink-0 border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-50">
          {project?.name ?? "工作区"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          待处理置顶 · 点击下方状态标签即可切换
        </p>
      </header>

      <div className="flex-1 overflow-y-auto">
        <section className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            需要你介入
          </h2>
          {interventionTasks.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-500">
              暂无待处理
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {interventionTasks.map((task) => (
                <TaskCard key={task.id} task={task} variant="intervention" />
              ))}
            </div>
          )}
        </section>

        <section className="px-6 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            全部任务
          </h2>
          <div className="mt-4 space-y-8">
            {groups.map((group) => {
              const groupTasks = tasks
                .filter((t) => t.groupId === group.id)
                .filter((t) => !isInterventionTask(t));

              return (
                <div key={group.id}>
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-zinc-200">
                      {group.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {group.leadAgentRole}
                    </p>
                  </div>
                  {groupTasks.length === 0 ? (
                    <p className="text-xs text-zinc-600">
                      该组任务均在「需要你介入」区域
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {groupTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
