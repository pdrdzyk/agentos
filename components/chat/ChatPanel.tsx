"use client";

import { useMemo } from "react";
import { ChatMessage } from "./ChatMessage";
import { DecisionCard } from "./DecisionCard";
import { useAgentOS } from "@/lib/store";

export function ChatPanel({ mode }: { mode: "global" | "project" | "group" }) {
  const messages = useAgentOS((s) => s.messages);
  const decisions = useAgentOS((s) => s.decisions);
  const currentProjectId = useAgentOS((s) => s.currentProjectId);
  const currentGroupId = useAgentOS((s) => s.currentGroupId);
  const taskGroups = useAgentOS((s) => s.taskGroups);
  const tasks = useAgentOS((s) => s.tasks);

  const filtered = useMemo(() => {
    if (mode === "global") {
      return messages.filter((m) => m.sender === "orchestrator").slice(-20);
    }
    if (mode === "project" && currentProjectId) {
      const groupIds = new Set(
        taskGroups
          .filter((g) => g.projectId === currentProjectId)
          .map((g) => g.id),
      );
      return messages.filter((m) => groupIds.has(m.groupId));
    }
    if (mode === "group" && currentGroupId) {
      return messages.filter((m) => m.groupId === currentGroupId);
    }
    return [];
  }, [messages, mode, currentProjectId, currentGroupId, taskGroups]);

  const pendingDecisions = useMemo(() => {
    if (mode !== "group" || !currentGroupId) return [];
    const groupTaskIds = new Set(
      tasks.filter((t) => t.groupId === currentGroupId).map((t) => t.id),
    );
    return decisions.filter(
      (d) => groupTaskIds.has(d.taskId) && !d.chosenOption,
    );
  }, [decisions, mode, currentGroupId, tasks]);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">
          {mode === "global" && "总管 AI"}
          {mode === "project" && "项目上下文"}
          {mode === "group" && "任务组群聊"}
        </h2>
        <p className="text-xs text-zinc-500">模拟 Agent 消息流 · MVP</p>
      </header>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {filtered.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {pendingDecisions.map((d) => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
    </div>
  );
}
