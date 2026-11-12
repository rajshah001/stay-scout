"use client";

import { useMemo, useState } from "react";
import type { DestinationResult, TripConfig } from "@/lib/types";

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
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost !px-3 !py-1.5 text-xs"
        >
          ↗ {label}
        </a>
      ))}
    </div>
  );
}

function DestinationPanel({
  result,
  cfg,
}: {
  result: DestinationResult;
  cfg: TripConfig;
}) {
  const stays = result.stays;
  const numericLow = stays.filter((s) => s.priceLow != null);

  return (
    <div className="animate-fade-up space-y-4">
      {/* verdict */}
      <div className="rounded-2xl border border-accent/25 bg-accent/8 p-5">
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-white">{result.destination}</span>
          {result.tagline && <span className="text-slate-400"> — {result.tagline}</span>}
        </p>
        {result.bestValue && (
          <p className="mt-2 text-sm text-mint">
            🏆 <span className="font-medium text-white">Best value:</span> {result.bestValue}
          </p>
        )}
        {result.cheapestDecent && (
          <p className="mt-1 text-sm text-amberx">
            💰 <span className="font-medium text-white">Cheapest decent:</span> {result.cheapestDecent}
          </p>
        )}
        {result.error && (
          <p className="mt-2 text-sm text-rosex">Scout error: {result.error}</p>
        )}
      </div>

      {/* verify links */}
      <div>
        <p className="label">Verify live · exact filtered searches for your dates &amp; group</p>
        <VerifyRow result={result} />
      </div>

      {/* stays table */}
      <div className="overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Option</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">28-night cost</th>
              <th className="px-4 py-3">Config &amp; notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stays.map((s, i) => (
              <tr key={`${s.name}-${i}`} className="align-top transition hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                <td className="max-w-[220px] px-4 py-3">
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-accent-glow underline-offset-2 hover:underline"
                    >
                      {s.name} ↗
                    </a>
                  ) : (
                    <span className="font-medium text-white">{s.name}</span>
                  )}
                  <p className="mt-0.5 text-xs text-slate-500">{s.platform}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${TYPE_BADGE[s.type] ?? TYPE_BADGE.unknown}`}>
                    {s.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.rating != null ? (
                    <span className="text-amberx">★ {s.rating}</span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                  {s.reviewCount != null && (
                    <span className="ml-1 text-xs text-slate-500">({s.reviewCount})</span>
                  )}
                  {s.guestFavourite && (
                    <span className="ml-1 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent-glow">
                      GF
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white">
                  {s.priceBand28n}
                  <p className="mt-0.5 font-sans text-[11px] text-slate-500">{s.sources.length} source(s)</p>
                </td>
                <td className="max-w-[340px] px-4 py-3 text-xs leading-relaxed text-slate-400">
                  {[s.bedrooms, s.bathrooms].some((n) => n != null) && (
                    <span className="text-slate-300">
                      {s.bedrooms ?? "?"}BR · {s.bathrooms ?? "?"}BA
                      {s.sleeps ? ` · sleeps ${s.sleeps}` : ""} ·{" "}
                    </span>
                  )}
                  <span className="text-slate-300">{s.wifiEvidence}</span>
                  {s.dedicatedWorkspace != null && (
                    <span className={s.dedicatedWorkspace ? " text-mint" : " text-rosex"}>
                      {" "}
                      · workspace: {s.dedicatedWorkspace ? "yes" : "no"}
                    </span>
                  )}
                  {s.powerBackup && s.powerBackup !== "unknown" && (
                    <span> · backup: {s.powerBackup}</span>
                  )}
                  {s.locationArea && <span> · {s.locationArea}</span>}
                  {s.flags.length > 0 && (
                    <span className=" text-amberx"> · {s.flags.join(" · ")}</span>
                  )}
                </td>
              </tr>
            ))}
            {stays.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No candidates returned — try re-running or widening the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* connectivity + dropped */}
      {result.connectivityNotes.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="label">On the ground</p>
            <ul className="space-y-1.5 text-xs leading-relaxed text-slate-400">
              {result.connectivityNotes.map((n, i) => (
                <li key={i}>• {n}</li>
              ))}
            </ul>
          </div>
          {result.dropped.length > 0 && (
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
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
  );
}

export default function ResultsDashboard({
  results,
  report,
  cfg,
}: {
  results: DestinationResult[];
  report: string;
  cfg: TripConfig | null;
}) {
  const [tab, setTab] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [copied, setCopied] = useState(false);

  const ranking = useMemo(
    () =>
      results
        .map((r) => {
          const lows = r.stays.map((s) => s.priceLow).filter((n): n is number => n != null);
          return { dest: r.destination, min: lows.length ? Math.min(...lows) : null, result: r };
        })
        .sort((a, b) => (a.min ?? Infinity) - (b.min ?? Infinity)),
    [results],
  );

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
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
  };

  const active = results[tab];

  return (
    <div className="space-y-5">
      {/* global ranking */}
      <div className="card animate-fade-up p-5">
        <h2 className="text-lg font-semibold text-white">Destination ranking</h2>
        <p className="mt-0.5 text-xs text-slate-500">sorted by lowest estimated 28-night cost for {cfg?.adults ?? 4} adults</p>
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
                  {r.min != null ? `from ${r.min.toLocaleString()} ${cfg?.currency ?? ""}` : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tabs */}
      <div className="flex flex-wrap gap-2">
        {results.map((r, i) => (
          <button
            key={r.destination}
            onClick={() => setTab(i)}
            className={`chip ${i === tab ? "chip-active" : ""}`}
          >
            {r.destination.split(",")[0]}
            <span className="ml-1.5 text-slate-500">{r.stays.length}</span>
          </button>
        ))}
        <button onClick={() => setShowReport((s) => !s)} className={`chip ${showReport ? "chip-active" : ""}`}>
          📄 Final report
        </button>
      </div>

      {active && <DestinationPanel result={active} cfg={cfg as TripConfig} />}

      {/* report */}
      {showReport && report && (
        <div className="card animate-fade-up p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Final report</h2>
            <div className="flex gap-2">
              <button onClick={copyReport} className="btn-ghost text-xs">
                {copied ? "✓ copied" : "copy markdown"}
              </button>
              <button onClick={downloadReport} className="btn-primary text-xs">
                download .md
              </button>
            </div>
          </div>
          <pre className="mt-4 max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-xl border border-white/8 bg-ink-950/80 p-5 font-mono text-xs leading-relaxed text-slate-300">
            {report}
          </pre>
        </div>
      )}
    </div>
  );
}
