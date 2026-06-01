"use client";

import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "正在加载工作空间…",
  "连接 Agent 编排网络…",
  "同步任务与决策引擎…",
  "系统就绪",
];

const MIN_MS = 2400;

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, BOOT_LINES.length - 1));
    }, 550);

    const doneTimer = setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      clearInterval(lineTimer);
      setExiting(true);
      setTimeout(onComplete, 520);
    }, MIN_MS);

    return () => {
      clearInterval(lineTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 ${
        exiting ? "animate-splash-exit" : ""
      }`}
      aria-hidden={exiting}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.2) 0%, transparent 55%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div
            className="absolute inset-0 rounded-2xl border border-blue-500/30 animate-splash-ring"
            style={{
              borderTopColor: "rgba(59,130,246,0.8)",
              borderRightColor: "transparent",
            }}
          />
          <div className="animate-splash-logo flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-900/50">
            <svg
              viewBox="0 0 32 32"
              className="h-9 w-9 text-white"
              fill="none"
              aria-hidden
            >
              <path
                d="M8 10h16M8 16h12M8 22h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="24" cy="22" r="3" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-zinc-50">
          Agent<span className="text-blue-400">OS</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          一个人 · 一支 AI 团队 · 一个操作系统
        </p>

        <div className="mt-10 h-1 w-56 overflow-hidden rounded-full bg-zinc-800">
          <div className="splash-progress-bar h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-500" />
        </div>

        <p className="mt-4 h-5 font-mono text-xs text-zinc-400 transition-opacity duration-300">
          {BOOT_LINES[lineIndex]}
        </p>
      </div>

      <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
        MVP · 工作空间版
      </p>
    </div>
  );
}
