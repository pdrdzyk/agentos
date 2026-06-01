"use client";

import { useAgentOS } from "@/lib/store";

export function ConfirmSplitPanel() {
  const proposal = useAgentOS((s) => s.pendingProposal);
  const confirmSplit = useAgentOS((s) => s.confirmSplit);
  const rejectSplit = useAgentOS((s) => s.rejectSplit);

  if (!proposal) return null;

  return (
    <div className="space-y-5 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          确认拆分方案
        </p>
        <h2 className="mt-1 text-xl font-bold text-zinc-50">
          {proposal.projectName}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          总管 AI 建议 {proposal.groups.length} 个任务组，确认后进入工作区看板。
        </p>
      </div>
      <ul className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
        {proposal.groups.map((g) => (
          <li
            key={g.name}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
          >
            <h3 className="font-semibold text-zinc-100">{g.name}</h3>
            <p className="mt-1 text-xs text-zinc-500">{g.leadAgentRole}</p>
            <p className="mt-2 rounded-md bg-zinc-900/80 px-2 py-1.5 text-xs text-zinc-400">
              <span className="font-medium text-zinc-500">完成标准 · </span>
              {g.definitionOfDone}
            </p>
            <ul className="mt-3 space-y-1.5 border-t border-zinc-800 pt-3">
              {g.tasks.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-300">{t.name}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      t.assignee === "human"
                        ? "bg-orange-500/20 text-orange-300"
                        : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {t.assignee === "human" ? "你" : "agent"}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={confirmSplit}
          className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 hover:from-emerald-500 hover:to-emerald-400"
        >
          确认并进入工作区
        </button>
        <button
          type="button"
          onClick={rejectSplit}
          className="rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
        >
          重新输入
        </button>
      </div>
    </div>
  );
}
