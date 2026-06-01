"use client";

import { useAgentOS } from "@/lib/store";
import type { Task } from "@/lib/types";

function PreviewFrame({
  variant,
  taskName,
}: {
  variant: "A" | "B";
  taskName: string;
}) {
  const isA = variant === "A";
  return (
    <div
      className={`flex h-full min-h-[320px] flex-col rounded-xl border p-6 ${
        isA
          ? "border-blue-500/40 bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950"
          : "border-orange-400/30 bg-gradient-to-br from-zinc-100 via-white to-orange-50 text-zinc-900"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isA ? "bg-blue-600 text-white" : "bg-orange-500 text-white"
          }`}
        >
          方案 {variant}
        </span>
        <span
          className={`text-xs ${isA ? "text-zinc-400" : "text-zinc-600"}`}
        >
          预览 · {taskName}
        </span>
      </div>
      <div
        className={`grid flex-1 grid-cols-3 gap-3 ${isA ? "" : "opacity-90"}`}
      >
        <div
          className={`col-span-2 rounded-lg p-4 ${
            isA ? "bg-zinc-800/80" : "bg-white shadow-sm ring-1 ring-zinc-200"
          }`}
        >
          <div
            className={`mb-3 h-3 w-24 rounded ${isA ? "bg-zinc-600" : "bg-zinc-300"}`}
          />
          <div
            className={`mb-2 h-2 w-full rounded ${isA ? "bg-zinc-700" : "bg-zinc-200"}`}
          />
          <div
            className={`h-2 w-4/5 rounded ${isA ? "bg-zinc-700" : "bg-zinc-200"}`}
          />
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div
              className={`h-16 rounded ${isA ? "bg-blue-900/40" : "bg-orange-100"}`}
            />
            <div
              className={`h-16 rounded ${isA ? "bg-zinc-700/50" : "bg-zinc-100"}`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div
            className={`h-20 rounded-lg ${isA ? "bg-zinc-800" : "bg-zinc-50 ring-1 ring-zinc-200"}`}
          />
          <div
            className={`flex-1 rounded-lg ${isA ? "bg-zinc-800/60" : "bg-zinc-50 ring-1 ring-zinc-200"}`}
          />
        </div>
      </div>
      <p
        className={`mt-4 text-center text-sm ${
          isA ? "text-zinc-400" : "text-zinc-600"
        }`}
      >
        {isA
          ? "深色控制台布局 — 高信息密度"
          : "浅色卡片布局 — 强调可读性"}
      </p>
    </div>
  );
}

export function TaskPreview({ task }: { task: Task | null }) {
  const previewOption = useAgentOS((s) => s.previewOption);
  const setPreviewOption = useAgentOS((s) => s.setPreviewOption);
  const approveTask = useAgentOS((s) => s.approveTask);

  if (!task) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        选择左侧任务以查看预览
      </div>
    );
  }

  const showAb =
    task.status === "pending_decision" || task.previewVariant != null;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-50">{task.name}</h1>
          <p className="text-sm text-zinc-500">{task.completionCriteria}</p>
        </div>
        {task.status === "pending_approval" && (
          <button
            type="button"
            onClick={() => approveTask(task.id)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            批准
          </button>
        )}
      </header>

      {showAb && (
        <div className="flex gap-2 border-b border-zinc-800 px-6 py-2">
          {(["A", "B"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPreviewOption(key)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
                previewOption === key
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              方案 {key}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        {showAb ? (
          <PreviewFrame variant={previewOption} taskName={task.name} />
        ) : (
          <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400">任务产出</p>
            <p className="mt-2 text-zinc-200">
              {task.output ?? "Agent 执行中，暂无可视化产出。"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
