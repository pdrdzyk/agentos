"use client";

import type { Decision } from "@/lib/types";
import { useAgentOS } from "@/lib/store";

export function DecisionCard({ decision }: { decision: Decision }) {
  const resolveDecision = useAgentOS((s) => s.resolveDecision);
  const setPreviewOption = useAgentOS((s) => s.setPreviewOption);
  const chosen = decision.chosenOption;

  return (
    <div className="rounded-xl border border-amber-500/50 bg-zinc-900 p-3 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
        待你决策
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{decision.question}</p>
      <div className="mt-3 flex flex-col gap-2">
        {decision.options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            disabled={!!chosen}
            onClick={() => {
              if (opt.previewKey) setPreviewOption(opt.previewKey);
              resolveDecision(decision.id, opt.label);
            }}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
              chosen === opt.label
                ? "border-emerald-500 bg-emerald-950/50"
                : "border-zinc-600 hover:border-amber-500/60 hover:bg-zinc-800"
            } disabled:opacity-70`}
          >
            <span className="font-semibold text-zinc-100">{opt.label}</span>
            <p className="mt-0.5 text-xs text-zinc-400">{opt.description}</p>
          </button>
        ))}
      </div>
      {chosen && (
        <p className="mt-2 text-xs text-emerald-400">已选择：{chosen}</p>
      )}
    </div>
  );
}
