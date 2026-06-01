import type { Task, TaskStatus } from "./types";

export function taskStatusLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    todo: "待办",
    in_progress: "进行中",
    pending_decision: "待决策",
    pending_approval: "待审批",
    completed: "完成",
    blocked: "阻塞",
  };
  return map[status];
}

export function taskStatusClass(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    todo: "bg-zinc-700 text-zinc-200",
    in_progress: "bg-blue-600/90 text-white",
    pending_decision: "bg-amber-500/90 text-black",
    pending_approval: "bg-red-600/90 text-white",
    completed: "bg-emerald-600/90 text-white",
    blocked: "bg-zinc-600 text-zinc-300",
  };
  return map[status];
}

export function assigneeBadge(task: Task): { label: string; className: string } {
  if (task.status === "pending_decision") {
    return { label: "待决策", className: "bg-amber-500/90 text-black" };
  }
  if (task.status === "pending_approval") {
    return { label: "待审批", className: "bg-red-600/90 text-white" };
  }
  if (task.status === "completed") {
    return { label: "完成", className: "bg-emerald-600/90 text-white" };
  }
  if (task.assignee === "human") {
    return { label: "你", className: "bg-orange-500/90 text-white" };
  }
  return { label: "agent", className: "bg-blue-600/90 text-white" };
}
