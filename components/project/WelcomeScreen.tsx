"use client";

import { CreateProjectForm } from "./CreateProjectForm";

export function WelcomeScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-[34px] font-bold tracking-tight text-[#f5f5f7]">
          AgentOS
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[#8e8e93]">
          输入目标，AI 帮你拆任务。你只在关键处做决定。
        </p>
      </div>
      <div className="mt-10 w-full max-w-md">
        <CreateProjectForm />
      </div>
    </div>
  );
}
