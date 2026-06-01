"use client";

import { LeftPanel } from "./LeftPanel";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { GlobalView } from "@/components/project/GlobalView";
import { TaskPreview } from "@/components/task/TaskPreview";
import { useAgentOS } from "@/lib/store";

export function AppShell() {
  const currentTaskId = useAgentOS((s) => s.currentTaskId);
  const currentProjectId = useAgentOS((s) => s.currentProjectId);
  const tasks = useAgentOS((s) => s.tasks);

  const currentTask = tasks.find((t) => t.id === currentTaskId) ?? null;
  const chatMode =
    currentTask?.groupId ? "group" : currentProjectId ? "project" : "global";

  return (
    <div className="flex h-screen max-h-screen bg-black">
      <LeftPanel />

      <main className="min-w-0 flex-1 overflow-hidden border-x border-white/[0.06]">
        <GlobalView />
      </main>

      <aside className="flex w-[320px] shrink-0 flex-col overflow-hidden bg-black">
        <TaskPreview task={currentTask} />
        <div className="min-h-0 flex-1 border-t border-white/[0.06]">
          <ChatPanel mode={chatMode} />
        </div>
      </aside>
    </div>
  );
}
