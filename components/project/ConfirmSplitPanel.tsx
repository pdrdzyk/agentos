"use client";

import { useAgentOS } from "@/lib/store";

export function ConfirmSplitPanel() {
  const proposal = useAgentOS((s) => s.pendingProposal);
  const confirmSplit = useAgentOS((s) => s.confirmSplit);
  const rejectSplit = useAgentOS((s) => s.rejectSplit);

  if (!proposal) return null;

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col justify-center px-8 py-10">
      <h1 className="text-[28px] font-bold text-[#f5f5f7]">{proposal.projectName}</h1>
      <p className="mt-2 text-[15px] text-[#8e8e93]">
        {proposal.groups.length} 个任务组，确认后开始。
      </p>

      <div className="mt-8 space-y-6">
        {proposal.groups.map((g) => (
          <div key={g.name}>
            <h2 className="mb-2 px-1 text-[13px] font-medium text-[#8e8e93]">
              {g.name}
            </h2>
            <div className="ios-group">
              {g.tasks.map((t, i) => (
                <div
                  key={t.name}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    i < g.tasks.length - 1 ? "border-b ios-separator" : ""
                  }`}
                >
                  <span className="text-[15px] text-[#f5f5f7]">{t.name}</span>
                  <span className="text-[13px] text-[#8e8e93]">
                    {t.assignee === "human" ? "你" : "Agent"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={confirmSplit}
          className="w-full rounded-[12px] bg-[#0a84ff] py-3.5 text-[17px] font-medium text-white active:opacity-80"
        >
          确认
        </button>
        <button
          type="button"
          onClick={rejectSplit}
          className="w-full py-3 text-[17px] text-[#0a84ff] active:opacity-60"
        >
          重新输入
        </button>
      </div>
    </div>
  );
}
