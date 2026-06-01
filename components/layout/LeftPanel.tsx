"use client";

import { useEffect } from "react";
import { useAgentOS } from "@/lib/store";

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
    <aside className="flex w-[220px] shrink-0 flex-col bg-[#1c1c1e]/50">
      <div className="px-4 pb-2 pt-5">
        <p className="text-[13px] font-semibold text-[#f5f5f7]">AgentOS</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {projects.length === 0 ? (
          <p className="px-2 py-4 text-[13px] text-[#8e8e93]">暂无项目</p>
        ) : (
          projects.map((project) => {
            const groups = taskGroups.filter((g) => g.projectId === project.id);
            const active = currentProjectId === project.id;

            return (
              <div key={project.id} className="mb-4">
                <button
                  type="button"
                  onClick={() => selectProject(project.id)}
                  className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-[14px] font-medium transition ${
                    active
                      ? "bg-[#2c2c2e] text-[#f5f5f7]"
                      : "text-[#8e8e93] hover:text-[#f5f5f7]"
                  }`}
                >
                  {project.name}
                </button>

                {active && (
                  <ul className="space-y-3 pl-1">
                    {groups.map((group) => (
                      <li key={group.id}>
                        <p className="mb-1 px-2 text-[11px] font-medium text-[#636366]">
                          {group.name}
                        </p>
                        <ul className="space-y-0.5">
                          {tasks
                            .filter((t) => t.groupId === group.id)
                            .map((task) => (
                              <li key={task.id}>
                                <button
                                  type="button"
                                  onClick={() => selectTask(task.id)}
                                  className={`w-full truncate rounded-md px-2 py-1.5 text-left text-[13px] transition ${
                                    currentTaskId === task.id
                                      ? "bg-[#0a84ff]/20 text-[#0a84ff]"
                                      : "text-[#8e8e93] hover:bg-[#2c2c2e]/80"
                                  }`}
                                >
                                  {task.name}
                                </button>
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}
