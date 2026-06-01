"use client";

import { LeftPanel } from "./LeftPanel";
import { TopBar } from "./TopBar";
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
    currentTask && currentTask.groupId
      ? "group"
      : currentProjectId
        ? "project"
        : "global";

  return (
    <div className="app-mesh-bg flex h-screen max-h-screen flex-col overflow-hidden">
      <TopBar />
      <div className="grid min-h-0 flex-1 grid-cols-[240px_1fr_360px]">
        <LeftPanel />

        <main className="min-w-0 overflow-hidden border-r border-zinc-800/80">
          <GlobalView />
        </main>

        <section className="flex min-w-0 flex-col overflow-hidden border-l border-zinc-800/80 bg-zinc-950/60 backdrop-blur-sm">
          <div className="max-h-[42%] min-h-[160px] shrink-0 overflow-hidden border-b border-zinc-800/80">
            <TaskPreview task={currentTask} compact />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <ChatPanel mode={chatMode} />
          </div>
        </section>
      </div>
    </div>
  );
}
