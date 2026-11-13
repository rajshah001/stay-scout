"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Plan } from "@/lib/plans";

export default function TopNavbar({
  plans,
  activeId,
  running,
  onSwitch,
  onNew,
  onDemo,
  onDelete,
}: {
  plans: Plan[];
  activeId: string | null;
  running: boolean;
  onSwitch: (plan: Plan) => void;
  onNew: () => void;
  onDemo: () => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = plans.find((p) => p.id === activeId);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-40 mb-7 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        {/* brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-soft text-sm font-bold text-white shadow-lg shadow-accent/25">
            S
          </span>
          <span className="text-base font-bold text-white">
            Stay<span className="text-accent-soft">Scout</span>
          </span>
          <span className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
            Workspace
          </span>
        </Link>

        {/* trips dropdown + actions */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              disabled={running}
              className="btn-ghost !py-1.5 text-xs disabled:opacity-40"
            >
              <span className="max-w-[180px] truncate">
                {active ? active.name : "Select trip"}
              </span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">
                {plans.length}
              </span>
              <span className="text-slate-500">▾</span>
            </button>
            {open && (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-2xl">
                <p className="border-b border-white/5 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Saved trips
                </p>
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-1 border-b border-white/5 px-2 py-1 ${p.id === activeId ? "bg-accent/10" : ""}`}
                  >
                    <button
                      onClick={() => {
                        onSwitch(p);
                        setOpen(false);
                      }}
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-slate-200 transition hover:bg-white/5"
                    >
                      <span className="truncate">{p.name}</span>
                      {p.status === "done" && <span className="text-mint">✓</span>}
                      {p.status === "running" && <span className="text-accent-glow">●</span>}
                      <span className="ml-auto shrink-0 text-[10px] text-slate-600">
                        {new Date(p.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      title="Delete trip"
                      className="shrink-0 rounded px-1.5 py-1 text-slate-600 transition hover:text-rosex"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {plans.length === 0 && (
                  <p className="px-4 py-3 text-xs text-slate-500">No trips yet</p>
                )}
                <button
                  onClick={() => {
                    onNew();
                    setOpen(false);
                  }}
                  disabled={running}
                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-accent-glow transition hover:bg-white/5 disabled:opacity-40"
                >
                  ＋ New trip
                </button>
                <button
                  onClick={() => {
                    onDemo();
                    setOpen(false);
                  }}
                  disabled={running}
                  className="w-full border-t border-white/5 px-4 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/5 disabled:opacity-40"
                >
                  ▶ Demo trip (verified example)
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onNew}
            disabled={running}
            className="btn-primary !px-3.5 !py-1.5 text-xs disabled:opacity-40"
          >
            ＋ New trip
          </button>

          <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
          <a
            href="https://github.com/rajshah001/stay-scout"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            className="hidden rounded-lg px-2 py-1.5 text-slate-400 transition hover:text-white sm:block"
          >
            <svg viewBox="0 0 16 16" className="size-4 fill-current">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
