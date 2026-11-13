"use client";

import type { StayCandidate, TripConfig } from "@/lib/types";

const TYPE_ICON: Record<string, string> = {
  entire: "🏡",
  pair: "🛏️",
  "two-rooms": "🚪",
  villa: "🏖️",
  unknown: "🏠",
};

const GRADIENTS = [
  "from-indigo-500/70 via-indigo-400/40 to-sky-400/30",
  "from-emerald-500/60 via-teal-400/40 to-cyan-300/30",
  "from-amber-500/60 via-orange-400/40 to-rose-400/30",
  "from-fuchsia-500/60 via-purple-400/40 to-indigo-400/30",
  "from-sky-500/60 via-cyan-400/40 to-emerald-300/30",
];

export default function StayCard({
  stay,
  cfg,
  onOpen,
  seed,
}: {
  stay: StayCandidate;
  cfg: TripConfig | null;
  onOpen: () => void;
  seed: number;
}) {
  const gradient = GRADIENTS[seed % GRADIENTS.length];
  const hasRange = stay.priceLow != null && stay.priceHigh != null && stay.priceHigh > stay.priceLow;

  return (
    <button
      onClick={onOpen}
      className="group animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-ink-900 text-left shadow-sm transition hover:border-white/25 hover:shadow-xl"
    >
      {/* hero */}
      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="text-5xl drop-shadow-lg transition group-hover:scale-110">{TYPE_ICON[stay.type] ?? "🏠"}</span>
        {stay.guestFavourite && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow">
            Guest favourite
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {stay.type}
        </span>
        {stay.locationArea && (
          <span className="absolute bottom-2.5 left-3 max-w-[85%] truncate text-[11px] font-medium text-white/90">
            📍 {stay.locationArea}
          </span>
        )}
      </div>

      {/* body */}
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-[2.4rem] text-sm font-semibold leading-snug text-white">
            {stay.name}
          </h3>
          <span className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-white">
            {stay.rating != null ? `★ ${stay.rating}` : "—"}
          </span>
        </div>

        <p className="text-[11px] text-slate-500">
          {stay.reviewCount != null ? `${stay.reviewCount} reviews · ` : ""}
          {stay.platform}
          {stay.reviewCount != null && stay.reviewCount <= 5 && stay.reviewCount > 0 && (
            <span className="text-amberx"> · low review mass</span>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          {[stay.bedrooms, stay.bathrooms].some((n) => n != null) && (
            <span className="text-slate-400">
              {stay.bedrooms ?? "?"}BR · {stay.bathrooms ?? "?"}BA{stay.sleeps ? ` · ${stay.sleeps} guests` : ""}
            </span>
          )}
          <span className={stay.dedicatedWorkspace ? "font-medium text-mint" : "text-rosex"}>
            {stay.dedicatedWorkspace ? "✓ desk" : "✗ no desk flag"}
          </span>
          <span className={/unverified/i.test(stay.wifiEvidence) ? "text-amberx" : "font-medium text-mint"}>
            {/unverified/i.test(stay.wifiEvidence) ? "~ wifi: ask host" : "✓ wifi cited"}
          </span>
        </div>

        {/* price strip */}
        <div className="flex items-end justify-between border-t border-white/5 pt-2.5">
          <div>
            <p className="font-mono text-base font-semibold text-white">
              {hasRange ? `₹${stay.priceLow?.toLocaleString("en-IN")}–${stay.priceHigh?.toLocaleString("en-IN")}` : stay.priceBand28n.split("✅")[0].trim()}
            </p>
            <p className="text-[10px] text-slate-500">
              28 nights · {cfg?.adults ?? 4} adults{hasRange ? " est." : ""}
            </p>
          </div>
          <span className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-semibold text-white transition group-hover:border-accent group-hover:bg-accent group-hover:text-white">
            Details
          </span>
        </div>
      </div>
    </button>
  );
}
