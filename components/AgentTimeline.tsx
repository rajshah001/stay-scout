"use client";

import type { AgentStatus } from "@/lib/types";

const PHASE_STYLE: Record<string, string> = {
  pending: "bg-slate-600",
  running: "bg-accent animate-pulse-dot",
  done: "bg-mint",
  error: "bg-rosex",
};

export default function AgentTimeline({
  agents,
  logs,
  phase,
}: {
  agents: AgentStatus[];
  logs: Record<string, string[]>;
  phase: string;
}) {
  return (
    <div className="card animate-fade-up p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Agent team</h2>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-glow">
          {phase === "done" ? "complete" : phase.replace("-", " ")}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl border p-3.5 transition ${
              a.phase === "error"
                ? "border-rosex/40 bg-rosex/5"
                : a.phase === "done"
                  ? "border-mint/30 bg-mint/5"
                  : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`size-2.5 shrink-0 rounded-full ${PHASE_STYLE[a.phase]}`} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{a.name}</p>
                <p className="truncate text-xs text-slate-500">{a.role}</p>
              </div>
            </div>
            {(logs[a.id]?.length ?? 0) > 0 && (
              <ul className="mt-2.5 space-y-1 border-t border-white/5 pt-2.5">
                {logs[a.id].slice(-3).map((line, i) => (
                  <li key={i} className="line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {line.length > 180 ? `${line.slice(0, 180)}…` : line}
                  </li>
                ))}
              </ul>
            )}
            {a.detail && (
              <p className="mt-1.5 text-xs font-medium text-accent-glow">{a.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
