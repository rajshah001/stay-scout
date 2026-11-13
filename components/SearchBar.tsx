"use client";

import type { Plan } from "@/lib/plans";

export default function SearchBar({
  plan,
  editing,
  onToggleEdit,
  onRun,
  running,
}: {
  plan: Plan;
  editing: boolean;
  onToggleEdit: () => void;
  onRun: (cfg: import("@/lib/types").TripConfig) => void;
  running: boolean;
}) {
  const cfg = plan.config;
  const nights =
    cfg
      ? Math.max(
          1,
          Math.round((new Date(cfg.checkout).getTime() - new Date(cfg.checkin).getTime()) / 86_400_000),
        )
      : 28;
  const destSummary =
    cfg?.destinations.slice(0, 2).join(", ") +
    (cfg && cfg.destinations.length > 2 ? ` +${cfg.destinations.length - 2} more` : "");

  return (
    <div className="animate-fade-up mb-6 space-y-3">
      {/* Airbnb-style search bar */}
      <button
        onClick={onToggleEdit}
        className="flex w-full items-stretch overflow-hidden rounded-full border border-white/15 bg-ink-900/90 py-1.5 pl-6 pr-1.5 text-left shadow-lg transition hover:border-white/30 hover:shadow-xl"
      >
        <span className="flex min-w-0 flex-[1.2] flex-col justify-center border-r border-white/10 px-2 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Trip</span>
          <span className="truncate text-sm font-semibold text-white">{plan.name}</span>
        </span>
        <span className="flex min-w-0 flex-[1.6] flex-col justify-center border-r border-white/10 px-4 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Destinations</span>
          <span className="truncate text-sm text-slate-200">{destSummary || "not set"}</span>
        </span>
        <span className="hidden flex-1 flex-col justify-center border-r border-white/10 px-4 py-1.5 sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Dates</span>
          <span className="truncate text-sm text-slate-200">
            {cfg
              ? `${new Date(cfg.checkin).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(cfg.checkout).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${nights}n`
              : "—"}
          </span>
        </span>
        <span className="hidden flex-1 flex-col justify-center px-4 py-1.5 md:flex">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Who</span>
          <span className="truncate text-sm text-slate-200">{cfg?.adults ?? 4} working adults</span>
        </span>
        <span className="my-auto flex items-center gap-2 pl-2 pr-2">
          <span className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white">
            {editing ? "Close" : "Edit brief"}
          </span>
        </span>
      </button>

      {/* quick re-run */}
      {cfg && !editing && (
        <div className="flex items-center justify-between px-2">
          <p className="text-[11px] text-slate-500">
            {plan.results.length} destination{plan.results.length === 1 ? "" : "s"} researched
            {plan.status === "done" ? " · report ready" : ""}
          </p>
          <button
            onClick={() => onRun(cfg)}
            disabled={running}
            className="rounded-full border border-accent/50 px-4 py-1.5 text-xs font-semibold text-accent-glow transition hover:bg-accent/15 disabled:opacity-40"
          >
            ↻ Re-run research
          </button>
        </div>
      )}
    </div>
  );
}
