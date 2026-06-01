"use client";

import { CreateProjectForm } from "./CreateProjectForm";

const FEATURES = [
  {
    title: "三焦距合一",
    desc: "导航、看板、决策同屏可见，减少切换",
  },
  {
    title: "待办置顶",
    desc: "待决策与待审批始终在最显眼位置",
  },
  {
    title: "一键改状态",
    desc: "点击标签即可更新任务，无需下拉",
  },
];

export function WelcomeScreen() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:flex-row lg:items-stretch lg:gap-12 lg:px-12">
        <div className="flex max-w-lg flex-col justify-center lg:flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            欢迎使用
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-zinc-50">
            你的 AI 团队
            <br />
            <span className="text-zinc-500">已经就位</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            输入一个项目目标，总管 AI 会拆成任务组；你在关键节点做决策，其余由
            Agent 模拟推进（MVP）。
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-900/60 text-[10px] text-blue-300">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{f.title}</p>
                  <p className="text-xs text-zinc-500">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel mt-10 w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-black/40 lg:mt-0 lg:flex lg:w-[420px] lg:shrink-0 lg:flex-col lg:justify-center">
          <h2 className="text-lg font-semibold text-zinc-100">创建第一个项目</h2>
          <p className="mt-1 text-sm text-zinc-500">
            描述你想做的事，我们会生成任务看板
          </p>
          <div className="mt-6">
            <CreateProjectForm />
          </div>
        </div>
      </div>
    </div>
  );
}
