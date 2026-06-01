"use client";

import type { Decision } from "@/lib/types";
import { useAgentOS } from "@/lib/store";

export function DecisionCard({ decision }: { decision: Decision }) {
  const resolveDecision = useAgentOS((s) => s.resolveDecision);
  const setPreviewOption = useAgentOS((s) => s.setPreviewOption);
  const chosen = decision.chosenOption;

  return (
    <div className="ios-group my-2">
      <p className="border-b border-white/[0.08] px-4 py-3 text-[15px] font-medium text-[#f5f5f7]">
        {decision.question}
      </p>
      {decision.options.map((opt, i) => (
        <button
          key={opt.label}
          type="button"
          disabled={!!chosen}
          onClick={() => {
            if (opt.previewKey) setPreviewOption(opt.previewKey);
            resolveDecision(decision.id, opt.label);
          }}
          className={`w-full px-4 py-3.5 text-left text-[15px] transition active:bg-[#2c2c2e] ${
            i < decision.options.length - 1 ? "border-b ios-separator" : ""
          } ${chosen === opt.label ? "text-[#0a84ff]" : "text-[#0a84ff]"}`}
        >
          {opt.label}
          {opt.description && (
            <span className="mt-0.5 block text-[13px] text-[#8e8e93]">
              {opt.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
