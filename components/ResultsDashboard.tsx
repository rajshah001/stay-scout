"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BudgetCalculator from "@/components/BudgetCalculator";
import StayCard from "@/components/StayCard";
import StayDrawer from "@/components/StayDrawer";
import { useToast } from "@/components/Toast";
import { hiddenGemLinks } from "@/lib/deeplinks";
import type { DestinationResult, StayCandidate, TripConfig } from "@/lib/types";

interface DiscoverLead {
  title: string;
  url: string;
  source: string;
  extra?: string;
}

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] items-center justify-center rounded-2xl border border-white/10 bg-ink-800/60 text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

const TYPE_BADGE: Record<string, string> = {
  entire: "bg-accent/15 text-accent-glow border-accent/30",
  pair: "bg-mint/10 text-mint border-mint/30",
  "two-rooms": "bg-mint/10 text-mint border-mint/30",
  villa: "bg-amberx/10 text-amberx border-amberx/30",
  unknown: "bg-white/5 text-slate-400 border-white/10",
};

function VerifyRow({ result }: { result: DestinationResult }) {
  const links: [string, string][] = [
    ["Airbnb filtered search", result.verifyLinks.airbnb],
    ["Booking.com", result.verifyLinks.booking],
    ["Google Maps reviews", result.verifyLinks.googleMaps],
    ["Reddit intel", result.verifyLinks.reddit],
    ["Google cross-check", result.verifyLinks.google],
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {links.map(([label, url]) => (
        <a key={label} href={url} target="_blank" rel="noreferrer" className="btn-ghost !px-3 !py-1.5 text-xs">
          ↗ {label}
        </a>
      ))}
    </div>
  );
}

function StaysPanel({
  result,
  cfg,
  onOpenStay,
  onAddLead,
}: {
  result: DestinationResult;
  cfg: TripConfig | null;
  onOpenStay: (stay: StayCandidate) => void;
  onAddLead: (destination: string, lead: DiscoverLead) => void;
}) {
  const [discovering, setDiscovering] = useState(false);
  const [leads, setLeads] = useState<DiscoverLead[]>([]);
  const [discoverNote, setDiscoverNote] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [intelOpen, setIntelOpen] = useState(false);
  const [verdictOpen, setVerdictOpen] = useState(false);

  const runDiscovery = async () => {
    setDiscovering(true);
    setDiscoverNote("");
    try {
      const c = result.coords;
      const qs = new URLSearchParams({ place: result.destination });
      if (c) {
        qs.set("lat", String(c.lat));
        qs.set("lng", String(c.lng));
      }
      const res = await fetch(`/api/discover?${qs.toString()}`);
      const data = await res.json();
      setLeads([...(data.osm ?? []), ...(data.web ?? [])].slice(0, 14));
      setDiscoverNote(
        `engines: ${(data.engines ?? []).join(" + ") || "none responded — try again shortly"} · tip: ${data.tip ?? ""}`,
      );
    } catch {
      setDiscoverNote("Discovery failed — check your connection and retry.");
    } finally {
      setDiscovering(false);
    }
  };

  return (
    <div className="animate-fade-up space-y-4">
      {/* verdict — compact, expandable */}
      <div className="rounded-2xl border border-accent/25 bg-accent/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">{result.destination.split(",")[0]}</span>
              {result.tagline && <span className="text-slate-400"> — {result.tagline}</span>}
            </p>
            {result.bestValue && (
              <p className="mt-1.5 truncate text-sm text-mint">
                🏆 <span className="font-medium text-white">Best:</span> {result.bestValue}
              </p>
            )}
          </div>
          <button
            onClick={() => setVerdictOpen((o) => !o)}
            className="shrink-0 rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            {verdictOpen ? "▴ less" : "▾ detail"}
          </button>
        </div>
        {verdictOpen && (
          <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
            {result.cheapestDecent && (
              <p className="text-sm text-amberx">
                💰 <span className="font-medium text-white">Cheapest decent:</span> {result.cheapestDecent}
              </p>
            )}
            {result.error && <p className="text-sm text-rosex">Scout error: {result.error}</p>}
          </div>
        )}
      </div>

      {/* tools — one collapsed section containing verify + hunt */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        <button
          onClick={() => setToolsOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            🧰 Verify live &amp; hidden-gem tools
          </span>
          <span className="text-xs text-slate-500">{toolsOpen ? "▴ hide" : "▾ show"}</span>
        </button>
        {toolsOpen && (
          <div className="space-y-4 border-t border-white/5 px-4 pb-4 pt-3">
            <div>
              <p className="label">Verify live · exact filtered searches for your dates &amp; group</p>
              <VerifyRow result={result} />
            </div>
            <div className="rounded-xl border border-mint/25 bg-mint/5 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-mint">
                  💎 Hidden-gem hunt — for the Instagram-only, single-village stays lists miss
                </p>
                <button
                  onClick={runDiscovery}
                  disabled={discovering}
                  className="btn-ghost !border-mint/40 !py-1 text-xs text-mint disabled:opacity-40"
                >
                  {discovering ? "Scanning free engines…" : "▶ Auto-discover"}
                </button>
              </div>
              {discoverNote && <p className="mt-2 text-[10px] text-slate-500">{discoverNote}</p>}
              {leads.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  {leads.map((l) => (
                    <div
                      key={l.url}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <span className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                        {l.source}
                      </span>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-0 flex-1 truncate text-xs text-accent-glow hover:underline"
                        title={l.url}
                      >
                        {l.title}
                      </a>
                      {l.extra && (
                        <span className="hidden truncate text-[10px] text-slate-500 lg:block">{l.extra}</span>
                      )}
                      <button
                        onClick={() => onAddLead(result.destination, l)}
                        title="Add as hidden gem lead to this trip"
                        className="shrink-0 rounded-lg border border-mint/40 px-2 py-1 text-[10px] font-semibold text-mint transition hover:bg-mint/10"
                      >
                        + lead
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {hiddenGemLinks(result.destination).map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    title={l.why}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-mint/50 hover:text-white"
                  >
                    <span className="font-semibold text-white">{l.label}</span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{l.why}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* stays — the hero content */}
      <div>
        <p className="mb-3 px-1 text-xs text-slate-500">
          {result.stays.length} options · sorted low → high · click a card for full evidence
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {result.stays.map((s, i) => (
            <StayCard
              key={`${s.name}-${i}`}
              stay={s}
              cfg={cfg}
              seed={i}
              onOpen={() => onOpenStay(s)}
            />
          ))}
        </div>
        {result.stays.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-500">
            No candidates returned — try re-running or widening the filters.
          </div>
        )}
      </div>

      {/* local intel — collapsed */}
      {(result.connectivityNotes.length > 0 || result.dropped.length > 0) && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <button
            onClick={() => setIntelOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              📍 Local intel{result.dropped.length > 0 ? ` & dropped (${result.dropped.length})` : ""}
            </span>
            <span className="text-xs text-slate-500">{intelOpen ? "▴ hide" : "▾ show"}</span>
          </button>
          {intelOpen && (
            <div className="grid gap-3 border-t border-white/5 p-4 sm:grid-cols-2">
              {result.connectivityNotes.length > 0 && (
                <div>
                  <p className="label">On the ground</p>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-slate-400">
                    {result.connectivityNotes.map((n, i) => (
                      <li key={i}>• {n}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.dropped.length > 0 && (
                <div>
                  <p className="label">Dropped during research</p>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-slate-400">
                    {result.dropped.map((n, i) => (
                      <li key={i}>✗ {n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsDashboard({
  results,
  report,
  cfg,
  coords,
  onAddLead,
}: {
  results: DestinationResult[];
  report: string;
  cfg: TripConfig | null;
  coords?: Record<string, { lat: number; lng: number }>;
  onAddLead?: (destination: string, lead: DiscoverLead) => void;
}) {
  const [tab, setTab] = useState<"stays" | "map" | "budget" | "report">("stays");
  const [dest, setDest] = useState(0);
  const [openStay, setOpenStay] = useState<StayCandidate | null>(null);
  const { toast } = useToast();

  const ranking = useMemo(
    () =>
      results
        .map((r) => {
          const lows = r.stays.map((s) => s.priceLow).filter((n): n is number => n != null);
          return { dest: r.destination, min: lows.length ? Math.min(...lows) : null };
        })
        .sort((a, b) => (a.min ?? Infinity) - (b.min ?? Infinity)),
    [results],
  );

  const pins = useMemo(
    () =>
      results
        .map((r) => {
          const c = coords?.[r.destination];
          if (!c) return null;
          const lows = r.stays.map((s) => s.priceLow).filter((n): n is number => n != null);
          return {
            destination: r.destination,
            lat: c.lat,
            lng: c.lng,
            label: r.stays[0]?.name ?? "stays",
            fromPrice: lows.length
              ? `${cfg?.currency ?? "₹"}${Math.min(...lows).toLocaleString("en-IN")}`
              : null,
            href: r.verifyLinks.airbnb,
          };
        })
        .filter((p): p is NonNullable<typeof p> => p != null),
    [results, coords, cfg],
  );

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report);
      toast("Report copied to clipboard", "success");
    } catch {
      toast("Clipboard unavailable in this browser", "error");
    }
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workation-stay-report.md";
    a.click();
    URL.revokeObjectURL(url);
    toast("Report downloaded", "success");
  };

  const active = results[dest];

  return (
    <div className="space-y-5">
      <div className="card animate-fade-up p-5">
        <h2 className="text-lg font-semibold text-white">Destination ranking</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          sorted by lowest estimated 28-night cost for {cfg?.adults ?? 4} adults
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ranking.map((r, i) => (
            <div
              key={r.dest}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/20 text-xs font-bold text-accent-glow">
                {i + 1}
              </span>
              <div>
                <p className="text-xs font-semibold text-white">{r.dest.split(",")[0]}</p>
                <p className="font-mono text-[10px] text-slate-400">
                  {r.min != null ? `from ${r.min.toLocaleString("en-IN")} ${cfg?.currency ?? ""}` : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["stays", "🏘️ Stays"],
            ["map", `🗺️ Map${pins.length ? ` (${pins.length})` : ""}`],
            ["budget", "💰 Budget"],
            ["report", "📄 Final report"],
          ] as const
        ).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`chip ${tab === key ? "chip-active" : ""}`}>
            {label}
          </button>
        ))}
        {tab === "stays" && results.length > 1 && (
          <span className="ml-2 flex flex-wrap gap-1.5">
            {results.map((r, i) => (
              <button
                key={r.destination}
                onClick={() => setDest(i)}
                className={`chip !px-2.5 !py-1 text-[11px] ${i === dest ? "chip-active" : ""}`}
              >
                {r.destination.split(",")[0]}
                <span className="ml-1 text-slate-500">{r.stays.length}</span>
              </button>
            ))}
          </span>
        )}
      </div>

      {tab === "stays" && active && (
        <StaysPanel result={active} cfg={cfg} onOpenStay={setOpenStay} onAddLead={onAddLead ?? (() => undefined)} />
      )}

      {tab === "map" && (
        <div className="animate-fade-up">
          {pins.length > 0 ? (
            <MapView pins={pins} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-500">
              Map pins appear once destinations carry coordinates (live runs get them from the planner
              agent; the demo trip ships with them).
            </div>
          )}
        </div>
      )}

      {tab === "budget" && <BudgetCalculator results={results} cfg={cfg} />}

      {tab === "report" && (
        <div className="animate-fade-up card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Final report</h2>
            <div className="flex gap-2">
              <button onClick={copyReport} className="btn-ghost text-xs">
                copy markdown
              </button>
              <button onClick={downloadReport} className="btn-primary text-xs">
                download .md
              </button>
            </div>
          </div>
          <div className="mt-4 max-h-[70vh] overflow-auto rounded-xl border border-white/10 bg-ink-950/70 p-6 text-sm leading-relaxed text-slate-300 [&_a]:text-accent-glow [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-accent/40 [&_blockquote]:bg-accent/5 [&_blockquote]:py-1 [&_code]:font-mono [&_code]:text-xs [&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_hr]:border-white/10 [&_li]:my-0.5 [&_p]:my-2 [&_strong]:text-white [&_table]:my-3 [&_table]:w-full [&_table_td]:border [&_table_td]:border-white/10 [&_table_td]:px-2 [&_table_td]:py-1 [&_table_th]:border [&_table_th]:border-white/10 [&_table_th]:bg-white/5 [&_table_th]:px-2 [&_table_th]:py-1 [&_table_th]:text-left">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report || "Report will appear here once the run completes."}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <StayDrawer
        stay={openStay}
        cfg={cfg}
        destination={active?.destination ?? ""}
        onClose={() => setOpenStay(null)}
      />
    </div>
  );
}
