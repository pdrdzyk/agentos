"use client";

import { ConfirmSplitPanel } from "./ConfirmSplitPanel";
import { WelcomeScreen } from "./WelcomeScreen";
import { TaskBoard } from "@/components/board/TaskBoard";
import { useAgentOS } from "@/lib/store";

export function GlobalView() {
  const projects = useAgentOS((s) => s.projects);
  const pendingProposal = useAgentOS((s) => s.pendingProposal);
  const currentProjectId = useAgentOS((s) => s.currentProjectId);

  if (pendingProposal) {
    return (
      <div className="flex h-full items-center justify-center overflow-y-auto p-6">
        <div className="glass-panel w-full max-w-2xl rounded-2xl p-2">
          <ConfirmSplitPanel />
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return <WelcomeScreen />;
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
