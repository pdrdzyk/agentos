"use client";

import { useEffect, useRef, useState } from "react";

const MIN_MS = 1600;

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const doneTimer = setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setExiting(true);
      setTimeout(onComplete, 400);
    }, MIN_MS);

    return () => clearTimeout(doneTimer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black ${
        exiting ? "animate-splash-exit" : ""
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#0a84ff]">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="currentColor" aria-hidden>
          <path d="M6 7h12v2H6V7zm0 4h9v2H6v-2zm0 4h6v2H6v-2z" opacity="0.95" />
        </svg>
      </div>
      <p className="mt-5 text-[22px] font-semibold tracking-tight text-[#f5f5f7]">
        AgentOS
      </p>
      <div className="mt-8 h-[3px] w-28 overflow-hidden rounded-full bg-[#2c2c2e]">
        <div className="splash-bar-fill h-full rounded-full bg-[#0a84ff]" />
      </div>
    </div>
  );
}
