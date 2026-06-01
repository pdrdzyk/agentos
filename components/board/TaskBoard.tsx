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
  const groupIds = new Set(groups.map((g) => g.id));
  const projectTasks = tasks.filter((t) => groupIds.has(t.groupId));
  const interventionTasks = projectTasks.filter(isInterventionTask);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="shrink-0 px-8 pb-2 pt-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#f5f5f7]">
          {project?.name ?? "项目"}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <section className="mb-8">
          <h2 className="mb-2 px-1 text-[13px] font-medium uppercase tracking-wide text-[#8e8e93]">
            需要你处理
          </h2>
          {interventionTasks.length === 0 ? (
            <p className="px-1 py-6 text-[15px] text-[#8e8e93]">暂无待处理</p>
          ) : (
            <div className="ios-group">
              {interventionTasks.map((task, i) => (
                <div
                  key={task.id}
                  className={i < interventionTasks.length - 1 ? "border-b ios-separator" : ""}
                >
                  <TaskCard task={task} highlight />
                </div>
              ))}
            </div>
          )}
        </section>

        {groups.map((group) => {
          const groupTasks = tasks
            .filter((t) => t.groupId === group.id)
            .filter((t) => !isInterventionTask(t));

          if (groupTasks.length === 0) return null;

          return (
            <section key={group.id} className="mb-6">
              <h2 className="mb-2 px-1 text-[13px] font-medium text-[#8e8e93]">
                {group.name}
              </h2>
              <div className="ios-group">
                {groupTasks.map((task, i) => (
                  <div
                    key={task.id}
                    className={i < groupTasks.length - 1 ? "border-b ios-separator" : ""}
                  >
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
