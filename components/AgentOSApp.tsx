"use client";

import { useEffect, useState } from "react";
import { AppShell } from "./layout/AppShell";

export function AgentOSApp() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        加载 AgentOS…
      </div>
    );
  }

  return <AppShell />;
}
