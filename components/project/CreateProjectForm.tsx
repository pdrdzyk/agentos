"use client";

import { useState } from "react";
import { useAgentOS } from "@/lib/store";

export function CreateProjectForm() {
  const [goal, setGoal] = useState("");
  const startProject = useAgentOS((s) => s.startProject);
  const isSplitting = useAgentOS((s) => s.isSplitting);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!goal.trim()) return;
        await startProject(goal.trim());
      }}
    >
      <label className="block text-sm font-medium text-zinc-300">
        项目目标
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={5}
          placeholder="例如：构建一个一人公司用的 Agent 任务操作系统，支持任务拆分、看板与 A/B 决策…"
          className="mt-2 w-full resize-none rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </label>
      <button
        type="submit"
        disabled={isSplitting || !goal.trim()}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSplitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            总管 AI 拆分中…
          </span>
        ) : (
          "交给总管 AI 拆分 →"
        )}
      </button>
    </form>
  );
}
