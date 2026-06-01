import { newId } from "./id";
import type { Message, Task, TaskGroup } from "./types";

export function seedGroupMessages(group: TaskGroup, tasks: Task[]): Message[] {
  const now = Date.now();
  const base: Message[] = [
    {
      id: newId(),
      groupId: group.id,
      sender: "lead_agent",
      senderRole: group.leadAgentRole,
      content: `任务组「${group.name}」已启动。完成标准：${group.definitionOfDone}`,
      type: "system",
      createdAt: new Date(now - 600_000).toISOString(),
    },
  ];

  tasks.forEach((task, i) => {
    if (task.assignee === "agent") {
      base.push({
        id: newId(),
        groupId: group.id,
        taskId: task.id,
        sender: "agent",
        senderRole: task.agentRole,
        content: `开始处理：${task.name}`,
        type: "progress",
        createdAt: new Date(now - 500_000 + i * 30_000).toISOString(),
      });
    }
  });

  return base;
}

export function appendSimulatedProgress(
  groupId: string,
  task: Task,
): Message[] {
  if (task.status !== "in_progress") return [];

  return [
    {
      id: newId(),
      groupId,
      taskId: task.id,
      sender: "agent",
      senderRole: task.agentRole,
      content: `「${task.name}」进度 70%，等待关键节点确认。`,
      type: "progress",
      createdAt: new Date().toISOString(),
    },
  ];
}
