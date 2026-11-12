"use client";

import { useState } from "react";
import type { TripConfig } from "@/lib/types";
import { REGION_SETS } from "@/lib/plans";

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function ConfigForm({
  initial,
  initialName,
  onNameChange,
  onRun,
  running,
}: {
  initial?: TripConfig | null;
  initialName?: string;
  onNameChange?: (name: string) => void;
  onRun: (cfg: TripConfig) => void;
  running: boolean;
}) {
  const [planName, setPlanName] = useState(initialName ?? "");
  const [activeSet, setActiveSet] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>(initial?.destinations?.filter((d) => REGION_SETS.some((r) => r.places.includes(d))) ?? []);
  const [destText, setDestText] = useState(
    initial?.destinations
      ?.filter((d) => !picked.includes(d))
      .join("; ") ?? "",
  );
  const [checkin, setCheckin] = useState(initial?.checkin ?? todayPlus(37));
  const [checkout, setCheckout] = useState(initial?.checkout ?? todayPlus(65));
  const [adults, setAdults] = useState(initial?.adults ?? 4);
  const [currency, setCurrency] = useState(initial?.currency ?? "INR (₹)");
  const [seating, setSeating] = useState<TripConfig["seating"]>(initial?.seating ?? "entire-preferred");
  const [mustHaveWifi, setMustHaveWifi] = useState(initial?.mustHaveWifi ?? true);
  const [mustHaveWorkspace, setMustHaveWorkspace] = useState(initial?.mustHaveWorkspace ?? true);
  const [guestFavouriteOnly, setGuestFavouriteOnly] = useState(initial?.guestFavouriteOnly ?? false);
  const [budgetPerMonth, setBudgetPerMonth] = useState(initial?.budgetPerMonth ?? "");
  const [extraNotes, setExtraNotes] = useState(initial?.extraNotes ?? "");

  const setName = (value: string) => {
    setPlanName(value);
    onNameChange?.(value);
  };

  const applySet = (setLabel: string) => {
    const set = REGION_SETS.find((r) => r.label === setLabel);
    if (!set) return;
    setActiveSet(setLabel === activeSet ? null : setLabel);
    setPicked(setLabel === activeSet ? [] : set.places);
  };

  const togglePick = (p: string) =>
    setPicked((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const destinations = [
    ...picked,
    ...destText
      .split(/[;\n]/)
      .map((s) => s.trim())
      .filter(Boolean),
  ];

  const submit = () => {
    if (destinations.length === 0) return;
    onRun({
      destinations,
      checkin,
      checkout,
      adults,
      currency,
      seating,
      mustHaveWifi,
      mustHaveWorkspace,
      guestFavouriteOnly,
      budgetPerMonth,
      extraNotes,
    });
  };

  return (
    <div className="card animate-fade-up p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <span className="label">Trip name</span>
          <input
            value={planName}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. South India Dec 2026 · Portugal summer · Bali month"
            className="field text-base font-semibold"
          />
        </div>
      </div>

      <h2 className="sr-only">Plan the research run</h2>

      {/* destinations */}
      <div className="mt-6">
        <span className="label">Quick-start sets</span>
        <div className="flex flex-wrap gap-2">
          {REGION_SETS.map((r) => (
            <button
              key={r.label}
              onClick={() => applySet(r.label)}
              className={`chip ${activeSet === r.label ? "chip-active" : ""}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <span className="label mt-4">Destinations · tap to include/exclude, or type your own</span>
        <div className="flex flex-wrap gap-2">
          {(REGION_SETS.find((r) => r.label === activeSet)?.places ?? []).map((p) => (
            <button
              key={p}
              onClick={() => togglePick(p)}
              className={`chip ${picked.includes(p) ? "chip-active" : ""}`}
            >
              {p}
            </button>
          ))}
        </div>
        <textarea
          value={destText}
          onChange={(e) => setDestText(e.target.value)}
          rows={2}
          placeholder="…anywhere on earth, semicolon-separated:  Lisbon ; Ericeira ; Tarifa ; Pokhara"
          className="field mt-3 resize-none font-mono text-xs"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          {destinations.length} destination{destinations.length === 1 ? "" : "s"} · max 8 per run
        </p>
      </div>

      {/* dates + guests */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <span className="label">Check-in</span>
          <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className="field" />
        </div>
        <div>
          <span className="label">Check-out</span>
          <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} className="field" />
        </div>
        <div>
          <span className="label">Working adults</span>
          <input
            type="number"
            min={1}
            max={12}
            value={adults}
            onChange={(e) => setAdults(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
            className="field"
          />
        </div>
        <div>
          <span className="label">Currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="field">
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>
      </div>

      {/* seating + hard filters */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <span className="label">Seating preference</span>
          <div className="flex flex-col gap-1.5">
            {(
              [
                ["entire-preferred", "Entire home for the group"],
                ["pair-ok", "Entire home or cheaper room-pairs"],
                ["any", "Anything that seats us"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSeating(value)}
                className={`chip text-left ${seating === value ? "chip-active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="label">Hard filters</span>
          <div className="flex flex-col gap-1.5">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
              <input type="checkbox" checked={mustHaveWifi} onChange={(e) => setMustHaveWifi(e.target.checked)} className="size-4 accent-indigo-500" />
              WiFi must handle video calls
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
              <input type="checkbox" checked={mustHaveWorkspace} onChange={(e) => setMustHaveWorkspace(e.target.checked)} className="size-4 accent-indigo-500" />
              Dedicated workspace / real desk
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
              <input type="checkbox" checked={guestFavouriteOnly} onChange={(e) => setGuestFavouriteOnly(e.target.checked)} className="size-4 accent-indigo-500" />
              Airbnb Guest-favourite stays only
            </label>
          </div>
        </div>
      </div>

      {/* budget + notes */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <span className="label">Monthly budget (optional)</span>
          <input
            value={budgetPerMonth}
            onChange={(e) => setBudgetPerMonth(e.target.value)}
            placeholder="e.g. under ₹1,00,000/month total · €2,500/month"
            className="field"
          />
        </div>
        <div>
          <span className="label">Extra context (optional)</span>
          <input
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="e.g. quiet mornings, walkable cafés, avoid monsoon belt"
            className="field"
          />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Powered by <span className="font-mono text-accent-glow">glm-5.3-flash</span> · every claim ships with a one-click verification link
        </p>
        <button onClick={submit} disabled={running || destinations.length === 0} className="btn-primary">
          {running ? "Researching…" : "Run agent research →"}
        </button>
      </div>
    </div>
  );
}
