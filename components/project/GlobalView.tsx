"use client";

import { CreateProjectForm } from "./CreateProjectForm";
import { ConfirmSplitPanel } from "./ConfirmSplitPanel";
import { TaskBoard } from "@/components/board/TaskBoard";
import { useAgentOS } from "@/lib/store";

export function GlobalView() {
  const projects = useAgentOS((s) => s.projects);
  const pendingProposal = useAgentOS((s) => s.pendingProposal);
  const currentProjectId = useAgentOS((s) => s.currentProjectId);

  if (pendingProposal) {
    return (
      <div className="flex h-full items-center justify-center overflow-y-auto p-6">
        <ConfirmSplitPanel />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6">
        <h1 className="mb-2 text-2xl font-bold text-zinc-50">AgentOS</h1>
        <p className="mb-8 max-w-md text-center text-sm text-zinc-400">
          一个人 + 一支 AI 团队。输入目标，总管 AI 拆分任务，你在关键节点决策。
        </p>
        <CreateProjectForm />
      </div>
    );
  }

  if (!currentProjectId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        在左侧选择一个项目
      </div>
    );
  }

  return <TaskBoard />;
}
