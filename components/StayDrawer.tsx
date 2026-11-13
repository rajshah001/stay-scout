"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { StayCandidate, TripConfig } from "@/lib/types";
import { airbnbRoomUrl } from "@/lib/deeplinks";

export default function StayDrawer({
  stay,
  cfg,
  destination,
  onClose,
}: {
  stay: StayCandidate | null;
  cfg: TripConfig | null;
  destination: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // portal target + escape key + body scroll lock
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!stay) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [stay, onClose]);

  const hostMessage = useMemo(() => {
    if (!stay || !cfg) return "";
    const rooms =
      stay.type === "pair" || stay.type === "two-rooms"
        ? "both rooms/units"
        : "the whole place";
    return [
      `Hi! We're ${cfg.adults} colleagues planning a workation from ${cfg.checkin} to ${cfg.checkout} (${Math.round(
        (new Date(cfg.checkout).getTime() - new Date(cfg.checkin).getTime()) / 86_400_000,
      )} nights) and would love to book ${rooms}.`,
      "",
      "We'll all be on video calls 9am–6pm, so could you help with:",
      "1. A recent WiFi speed-test screenshot (upload + download Mbps)",
      "2. What your power backup runs — does the router stay online in a cut?",
      stay.heating && !/n\/a/i.test(stay.heating)
        ? "3. Heating/hot-water setup during cold nights"
        : "3. Hot-water reliability",
      "4. Your best rate for the full month (we know 28+ nights usually carries a discount)",
      "",
      "Thanks!",
    ].join("\n");
  }, [stay, cfg]);

  if (!stay || !mounted) return null;

  const verifyUrl =
    stay.platform === "Airbnb" && /airbnb\.(com|co\.in)\/rooms\//.test(stay.url) && cfg
      ? airbnbRoomUrl(stay.url, cfg)
      : stay.url;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(hostMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const rows: [string, React.ReactNode][] = [
    ["Platform", stay.platform],
    [
      "Rating",
      stay.rating != null
        ? `★ ${stay.rating}${stay.reviewCount ? ` (${stay.reviewCount} reviews)` : ""}${stay.guestFavourite ? " · Guest favourite" : ""}${stay.superhost ? " · Superhost" : ""}`
        : "no rating data",
    ],
    [
      "Config",
      `${stay.bedrooms ?? "?"}BR · ${stay.bathrooms ?? "?"}BA${stay.sleeps ? ` · sleeps ${stay.sleeps}` : ""} · type: ${stay.type}`,
    ],
    ["28-night price", stay.priceBand28n],
    ["WiFi evidence", stay.wifiEvidence],
    [
      "Workspace",
      stay.dedicatedWorkspace == null ? "unknown" : stay.dedicatedWorkspace ? "✅ dedicated" : "❌ not listed",
    ],
    ["Power backup", stay.powerBackup],
    ["Location", stay.locationArea],
    ["Evening access", stay.eveningAccess],
    ["Heating", stay.heating || "—"],
  ];

  return createPortal(
    <div className="fixed inset-0 z-[90] flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="animate-fade-up relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-white/10 bg-ink-900 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-white/10 bg-ink-900 px-6 pb-4 pt-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-accent-glow">{destination}</p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-white">{stay.name}</h2>
          </div>
          <button onClick={onClose} className="btn-ghost !px-2.5 !py-1 text-xs" title="Close (Esc)">
            ✕
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* price + cta */}
          <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 to-accent/5 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">28-night estimate</p>
            <p className="mt-1 font-mono text-xl text-white">{stay.priceBand28n}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={verifyUrl} target="_blank" rel="noreferrer" className="btn-primary !py-2 text-xs">
                Open listing with our dates ↗
              </a>
              {stay.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="btn-ghost !py-2 text-xs">
                  {s.name} ↗
                </a>
              ))}
            </div>
          </div>

          {/* facts */}
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {rows.map(([k, v], i) => (
              <div
                key={k}
                className={`grid grid-cols-[120px_1fr] gap-3 px-4 py-3 text-sm ${i % 2 ? "bg-white/[0.03]" : ""}`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{k}</span>
                <span className="leading-relaxed text-slate-300">{v}</span>
              </div>
            ))}
          </div>

          {/* flags */}
          {stay.flags.length > 0 && (
            <div className="rounded-2xl border border-amberx/30 bg-amberx/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amberx">Flags</p>
              <ul className="mt-1.5 space-y-1 text-sm text-amberx/90">
                {stay.flags.map((f, i) => (
                  <li key={i}>⚠️ {f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* host message */}
          <div>
            <div className="flex items-center justify-between">
              <p className="label !mb-0">Host validation message</p>
              <button onClick={copyMessage} className="btn-ghost !px-3 !py-1 text-xs">
                {copied ? "✓ copied" : "copy"}
              </button>
            </div>
            <pre className="mt-2 whitespace-pre-wrap rounded-2xl border border-white/10 bg-ink-950/70 p-4 font-mono text-xs leading-relaxed text-slate-300">
              {hostMessage}
            </pre>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
