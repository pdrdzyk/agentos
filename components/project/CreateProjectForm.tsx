"use client";

import { useState } from "react";
import { useAgentOS } from "@/lib/store";

export function CreateProjectForm() {
  const [goal, setGoal] = useState("");
  const startProject = useAgentOS((s) => s.startProject);
  const isSplitting = useAgentOS((s) => s.isSplitting);

  return (
    <form
      className="mx-auto max-w-xl space-y-4"
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
          rows={4}
          placeholder="例如：做一个一人公司用的 Agent 任务操作系统 MVP…"
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={isSplitting || !goal.trim()}
        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {isSplitting ? "总管 AI 拆分中…" : "交给总管 AI 拆分"}
      </button>
    </form>
  );
}
