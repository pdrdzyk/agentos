"use client";

import { useState } from "react";
import { useAgentOS } from "@/lib/store";

export function CreateProjectForm() {
  const [goal, setGoal] = useState("");
  const startProject = useAgentOS((s) => s.startProject);
  const isSplitting = useAgentOS((s) => s.isSplitting);

  return (
    <form
      className="ios-group p-1"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!goal.trim()) return;
        await startProject(goal.trim());
      }}
    >
      <label className="block px-4 pt-4">
        <span className="text-[13px] text-[#8e8e93]">项目目标</span>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={4}
          placeholder="你想完成什么？"
          className="mt-2 w-full resize-none bg-transparent text-[17px] text-[#f5f5f7] placeholder:text-[#636366] focus:outline-none"
        />
      </label>
      <div className="border-t border-white/[0.08] p-3">
        <button
          type="submit"
          disabled={isSplitting || !goal.trim()}
          className="w-full rounded-[10px] bg-[#0a84ff] py-3.5 text-[17px] font-medium text-white transition active:opacity-80 disabled:opacity-40"
        >
          {isSplitting ? "正在拆分…" : "继续"}
        </button>
      </div>
    </form>
  );
}
