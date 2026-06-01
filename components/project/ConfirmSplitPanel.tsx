"use client";

import { useAgentOS } from "@/lib/store";

export function ConfirmSplitPanel() {
  const proposal = useAgentOS((s) => s.pendingProposal);
  const confirmSplit = useAgentOS((s) => s.confirmSplit);
  const rejectSplit = useAgentOS((s) => s.rejectSplit);

  if (!proposal) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-xl border border-blue-500/30 bg-zinc-900/80 p-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">
          确认拆分方案 · {proposal.projectName}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          总管 AI 建议分为 {proposal.groups.length} 个任务组，确认后进入看板。
        </p>
      </div>
      <ul className="space-y-3">
        {proposal.groups.map((g) => (
          <li
            key={g.name}
            className="rounded-lg border border-zinc-700 bg-zinc-950/50 p-4"
          >
            <h3 className="font-medium text-zinc-100">{g.name}</h3>
            <p className="mt-1 text-xs text-zinc-500">{g.leadAgentRole}</p>
            <p className="mt-2 text-xs text-zinc-400">
              <span className="text-zinc-500">DoD：</span>
              {g.definitionOfDone}
            </p>
            <ul className="mt-2 space-y-1">
              {g.tasks.map((t) => (
                <li key={t.name} className="text-xs text-zinc-300">
                  · {t.name}{" "}
                  <span className="text-zinc-500">
                    ({t.assignee === "human" ? "你" : "agent"})
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={confirmSplit}
          className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          确认并开始
        </button>
        <button
          type="button"
          onClick={rejectSplit}
          className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          重新输入
        </button>
      </div>
    </div>
  );
}
