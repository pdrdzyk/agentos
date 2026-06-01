"use client";

import { TaskStatusPicker } from "./TaskStatusPicker";
import { useAgentOS } from "@/lib/store";
import type { Task } from "@/lib/types";

export function TaskPreview({ task }: { task: Task | null }) {
  const previewOption = useAgentOS((s) => s.previewOption);
  const setPreviewOption = useAgentOS((s) => s.setPreviewOption);
  const approveTask = useAgentOS((s) => s.approveTask);

  if (!task) {
    return (
      <div className="flex h-[200px] items-center justify-center px-6 text-center text-[15px] text-[#8e8e93]">
        选择任务
      </div>
    );
  }

  const showAb =
    task.status === "pending_decision" || task.previewVariant != null;

  return (
    <div className="flex max-h-[50%] min-h-[200px] flex-col overflow-hidden">
      <div className="shrink-0 px-5 pt-5">
        <h2 className="text-[17px] font-semibold text-[#f5f5f7]">{task.name}</h2>
        <p className="mt-1 text-[13px] leading-snug text-[#8e8e93]">
          {task.completionCriteria}
        </p>

        {task.status === "pending_approval" && (
          <button
            type="button"
            onClick={() => approveTask(task.id)}
            className="mt-4 w-full rounded-[10px] bg-[#0a84ff] py-2.5 text-[15px] font-medium text-white"
          >
            批准
          </button>
        )}

        {showAb && (
          <div className="mt-4 flex rounded-[10px] bg-[#2c2c2e] p-1">
            {(["A", "B"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPreviewOption(key)}
                className={`flex-1 rounded-[8px] py-1.5 text-[13px] font-medium transition ${
                  previewOption === key
                    ? "bg-[#636366] text-[#f5f5f7]"
                    : "text-[#8e8e93]"
                }`}
              >
                方案 {key}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {showAb ? (
          <div
            className={`rounded-xl p-4 ${
              previewOption === "A"
                ? "bg-[#1c1c1e]"
                : "bg-[#f5f5f7] text-black"
            }`}
          >
            <p className="text-[13px] opacity-70">界面预览</p>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-20 rounded bg-current opacity-20" />
              <div className="h-2 w-full rounded bg-current opacity-15" />
              <div className="mt-4 h-16 rounded-lg bg-current opacity-10" />
            </div>
          </div>
        ) : (
          <p className="text-[15px] text-[#8e8e93]">
            {task.output ?? "暂无预览内容"}
          </p>
        )}

        <div className="mt-5">
          <TaskStatusPicker taskId={task.id} current={task.status} />
        </div>
      </div>
    </div>
  );
}
