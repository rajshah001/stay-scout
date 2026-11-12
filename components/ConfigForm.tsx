"use client";

import { useState } from "react";
import type { TripConfig } from "@/lib/types";

const QUICK_PICKS = [
  "Madikeri, Coorg",
  "Kolagappara, Wayanad",
  "Varkala",
  "Kodaikanal",
  "Coonoor",
  "Gokarna",
  "Munnar",
  "Kalasa, Chikkamagaluru",
];

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function ConfigForm({
  onRun,
  running,
}: {
  onRun: (cfg: TripConfig) => void;
  running: boolean;
}) {
  const [destText, setDestText] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [checkin, setCheckin] = useState(todayPlus(37));
  const [checkout, setCheckout] = useState(todayPlus(65));
  const [adults, setAdults] = useState(4);
  const [currency, setCurrency] = useState("INR (₹)");
  const [seating, setSeating] = useState<TripConfig["seating"]>("entire-preferred");
  const [mustHaveWifi, setMustHaveWifi] = useState(true);
  const [mustHaveWorkspace, setMustHaveWorkspace] = useState(true);
  const [guestFavouriteOnly, setGuestFavouriteOnly] = useState(false);
  const [budgetPerMonth, setBudgetPerMonth] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

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
      <h2 className="text-lg font-semibold text-white">Plan the research run</h2>
      <p className="mt-1 text-sm text-slate-400">
        Any destinations, any dates — the agent team handles the rest.
      </p>

      {/* destinations */}
      <div className="mt-6">
        <span className="label">Destinations · pick or type</span>
        <div className="flex flex-wrap gap-2">
          {QUICK_PICKS.map((p) => (
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
          placeholder="…or type your own, semicolon-separated:  Lisbon ; Ericeira ; Madeira"
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
            placeholder="e.g. under ₹1,00,000/month total"
            className="field"
          />
        </div>
        <div>
          <span className="label">Extra context (optional)</span>
          <input
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="e.g. quiet mornings, avoid party zones, need parking"
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
