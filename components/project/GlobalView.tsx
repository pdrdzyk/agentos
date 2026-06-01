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
      <div className="h-full overflow-y-auto">
        <ConfirmSplitPanel />
      </div>
    );
  }

  if (projects.length === 0) {
    return <WelcomeScreen />;
  }

  if (!currentProjectId) {
    return (
      <div className="flex h-full items-center justify-center text-[15px] text-[#8e8e93]">
        选择左侧项目
      </div>
    );
  }

  return <TaskBoard />;
}
