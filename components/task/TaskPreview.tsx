"use client";

import { useAgentOS } from "@/lib/store";
import type { Task } from "@/lib/types";

function PreviewFrame({
  variant,
  taskName,
  compact,
}: {
  variant: "A" | "B";
  taskName: string;
  compact?: boolean;
}) {
  const isA = variant === "A";
  return (
    <div
      className={`flex flex-col rounded-lg border p-4 ${
        compact ? "min-h-[140px]" : "min-h-[320px]"
      } ${
        isA
          ? "border-blue-500/40 bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950"
          : "border-orange-400/30 bg-gradient-to-br from-zinc-100 via-white to-orange-50 text-zinc-900"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            isA ? "bg-blue-600 text-white" : "bg-orange-500 text-white"
          }`}
        >
          方案 {variant}
        </span>
        {!compact && (
          <span className={`text-xs ${isA ? "text-zinc-400" : "text-zinc-600"}`}>
            预览 · {taskName}
          </span>
        )}
      </div>
      <div className={`grid flex-1 gap-2 ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
        <div
          className={`rounded-md p-2 ${compact ? "col-span-1" : "col-span-2"} ${
            isA ? "bg-zinc-800/80" : "bg-white ring-1 ring-zinc-200"
          }`}
        >
          <div className={`mb-2 h-2 w-16 rounded ${isA ? "bg-zinc-600" : "bg-zinc-300"}`} />
          <div className={`h-1.5 w-full rounded ${isA ? "bg-zinc-700" : "bg-zinc-200"}`} />
        </div>
        {!compact && (
          <div className={`rounded-md ${isA ? "bg-zinc-800/60" : "bg-zinc-50"}`} />
        )}
      </div>
    </div>
  );
}

export function TaskPreview({
  task,
  compact = false,
}: {
  task: Task | null;
  compact?: boolean;
}) {
  const previewOption = useAgentOS((s) => s.previewOption);
  const setPreviewOption = useAgentOS((s) => s.setPreviewOption);
  const approveTask = useAgentOS((s) => s.approveTask);

  if (!task) {
    return (
      <div className="flex h-full min-h-[120px] items-center justify-center bg-zinc-900 px-4 text-center text-xs text-zinc-500">
        点击任务查看详情与预览
      </div>
    );
  }

  const showAb =
    task.status === "pending_decision" || task.previewVariant != null;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-900">
      <header className="shrink-0 border-b border-zinc-800 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-zinc-50">
              {task.name}
            </h1>
            <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
              {task.completionCriteria}
            </p>
          </div>
          {task.status === "pending_approval" && (
            <button
              type="button"
              onClick={() => approveTask(task.id)}
              className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
            >
              批准
            </button>
          )}
        </div>

        {showAb && (
          <div className="mt-2 flex gap-1.5">
            {(["A", "B"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPreviewOption(key)}
                className={`rounded-md px-3 py-1 text-xs font-medium ${
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
      </header>

      <div className="flex-1 overflow-auto p-4">
        {showAb ? (
          <PreviewFrame
            variant={previewOption}
            taskName={task.name}
            compact={compact}
          />
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs text-zinc-500">任务产出</p>
            <p className="mt-2 text-sm text-zinc-300">
              {task.output ?? "Agent 执行中，暂无可视化产出。"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
