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
    currentTask && currentTask.groupId ? "group" : currentProjectId ? "project" : "global";

  return (
    <div className="grid h-screen max-h-screen grid-cols-[240px_1fr_360px] overflow-hidden bg-zinc-950">
      <LeftPanel />

      <main className="min-w-0 overflow-hidden border-r border-zinc-800 bg-zinc-950">
        <GlobalView />
      </main>

      <section className="flex min-w-0 flex-col overflow-hidden border-l border-zinc-800 bg-zinc-950">
        <div className="max-h-[45%] min-h-0 shrink-0 overflow-hidden border-b border-zinc-800">
          <TaskPreview task={currentTask} compact />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <ChatPanel mode={chatMode} />
        </div>
      </section>
    </div>
  );
}
