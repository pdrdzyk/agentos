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
      return messages.filter((m) => m.sender === "orchestrator").slice(-15);
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

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 py-3">
        <h2 className="text-[13px] font-medium text-[#8e8e93]">消息</h2>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 && pendingDecisions.length === 0 ? (
          <p className="py-8 text-center text-[15px] text-[#636366]">暂无消息</p>
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
