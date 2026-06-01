"use client";

import { LeftPanel } from "./LeftPanel";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { GlobalView } from "@/components/project/GlobalView";
import { TaskBoard } from "@/components/board/TaskBoard";
import { TaskPreview } from "@/components/task/TaskPreview";
import { useAgentOS } from "@/lib/store";

const columnWidths: Record<1 | 2 | 3, string> = {
  1: "grid-cols-[220px_1fr_320px]",
  2: "grid-cols-[220px_1fr_300px]",
  3: "grid-cols-[200px_1fr_340px]",
};

export function AppShell() {
  const focus = useAgentOS((s) => s.focus);
  const currentTaskId = useAgentOS((s) => s.currentTaskId);
  const tasks = useAgentOS((s) => s.tasks);
  const currentProjectId = useAgentOS((s) => s.currentProjectId);

  const currentTask = tasks.find((t) => t.id === currentTaskId) ?? null;

  const chatMode =
    focus === 1 ? "global" : focus === 2 ? "project" : "group";

  return (
    <div
      className={`grid h-screen max-h-screen overflow-hidden bg-zinc-950 ${columnWidths[focus]}`}
    >
      <LeftPanel />

      <main className="min-w-0 overflow-hidden border-r border-zinc-800">
        {focus === 1 && <GlobalView />}
        {focus === 2 && currentProjectId && <TaskBoard />}
        {focus === 2 && !currentProjectId && <GlobalView />}
        {focus === 3 && <TaskPreview task={currentTask} />}
      </main>

      <section className="min-w-0 overflow-hidden bg-zinc-950">
        <ChatPanel mode={chatMode} />
      </section>
    </div>
  );
}
