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
  const currentTaskId = useAgentOS((s) => s.currentTaskId);
  const taskGroups = useAgentOS((s) => s.taskGroups);
  const tasks = useAgentOS((s) => s.tasks);

  const activeGroupId = useMemo(() => {
    if (currentTaskId) {
      return tasks.find((t) => t.id === currentTaskId)?.groupId ?? currentGroupId;
    }
    return currentGroupId;
  }, [currentTaskId, currentGroupId, tasks]);

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
    if (mode === "group" && activeGroupId) {
      return messages.filter((m) => m.groupId === activeGroupId);
    }
    return [];
  }, [messages, mode, currentProjectId, activeGroupId, taskGroups]);

  const pendingDecisions = useMemo(() => {
    if (!activeGroupId) return [];
    const groupTaskIds = new Set(
      tasks.filter((t) => t.groupId === activeGroupId).map((t) => t.id),
    );
    return decisions.filter(
      (d) => groupTaskIds.has(d.taskId) && !d.chosenOption,
    );
  }, [decisions, activeGroupId, tasks]);

  const groupName = taskGroups.find((g) => g.id === activeGroupId)?.name;

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <header className="shrink-0 border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-100">消息流</h2>
        <p className="text-xs text-zinc-500">
          {groupName ? `任务组 · ${groupName}` : "总管 AI · 模拟"}
        </p>
      </header>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {filtered.length === 0 && pendingDecisions.length === 0 ? (
          <p className="text-center text-xs text-zinc-600">
            选中任务后显示群聊
          </p>
        ) : (
          filtered.map((m) => <ChatMessage key={m.id} message={m} />)
        )}
        {pendingDecisions.map((d) => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
    </div>
  );
}
