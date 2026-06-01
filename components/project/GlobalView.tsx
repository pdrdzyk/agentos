"use client";

import { CreateProjectForm } from "./CreateProjectForm";
import { ConfirmSplitPanel } from "./ConfirmSplitPanel";
import { useAgentOS } from "@/lib/store";

export function GlobalView() {
  const projects = useAgentOS((s) => s.projects);
  const tasks = useAgentOS((s) => s.tasks);
  const pendingProposal = useAgentOS((s) => s.pendingProposal);
  const selectProject = useAgentOS((s) => s.selectProject);

  const pendingApproval = tasks.filter(
    (t) => t.status === "pending_approval",
  ).length;
  const pendingDecision = tasks.filter(
    (t) => t.status === "pending_decision",
  ).length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;

  if (pendingProposal) {
    return <ConfirmSplitPanel />;
  }

  if (projects.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6">
        <h1 className="mb-2 text-2xl font-bold text-zinc-50">AgentOS</h1>
        <p className="mb-8 max-w-md text-center text-sm text-zinc-400">
          一个人 + 一支 AI 团队。输入目标，总管 AI 拆分任务，你在关键节点决策。
        </p>
        <CreateProjectForm />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-zinc-50">全局概览</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <StatCard label="进行中 Agent 任务" value={inProgress} />
        <StatCard label="待决策" value={pendingDecision} accent="amber" />
        <StatCard label="待审批" value={pendingApproval} accent="red" />
      </div>
      <h2 className="mt-8 text-sm font-medium text-zinc-400">项目</h2>
      <ul className="mt-2 space-y-2">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => selectProject(p.id)}
              className="flex w-full items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-left hover:border-zinc-600"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  p.status === "active"
                    ? "bg-emerald-500"
                    : p.status === "planning"
                      ? "bg-amber-500"
                      : "bg-zinc-500"
                }`}
              />
              <span className="font-medium text-zinc-100">{p.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <CreateProjectForm />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "amber" | "red";
}) {
  const accentClass =
    accent === "amber"
      ? "text-amber-400"
      : accent === "red"
        ? "text-red-400"
        : "text-blue-400";
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}
