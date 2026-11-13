"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface Toast {
  id: number;
  message: string;
  kind: "info" | "success" | "error";
}

const ToastCtx = createContext<{ toast: (message: string, kind?: Toast["kind"]) => void }>({
  toast: () => undefined,
});

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((cur) => [...cur, { id, message, kind }]);
    setTimeout(() => setToasts((cur) => cur.filter((t) => t.id !== id)), 3800);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-up rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur ${
              t.kind === "success"
                ? "border-mint/40 bg-mint/10 text-mint"
                : t.kind === "error"
                  ? "border-rosex/40 bg-rosex/10 text-rosex"
                  : "border-white/15 bg-ink-800/90 text-slate-200"
            }`}
          >
            {t.kind === "success" && "✓ "}
            {t.kind === "error" && "✗ "}
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
