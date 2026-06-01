"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "./layout/AppShell";
import { SplashScreen } from "./splash/SplashScreen";

export function AgentOSApp() {
  const [hydrated, setHydrated] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  if (!hydrated) {
    return <div className="h-screen bg-zinc-950" />;
  }

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      {splashDone && (
        <div className="animate-app-enter h-screen">
          <AppShell />
        </div>
      )}
    </>
  );
}
