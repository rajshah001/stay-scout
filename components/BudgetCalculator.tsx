"use client";

import { useMemo, useState } from "react";
import type { DestinationResult, TripConfig } from "@/lib/types";

interface Assumptions {
  rentLow: boolean; // use cheapest credible vs comfort pick
  scooter: number;
  connectivityKit: number;
  foodPerPerson: number;
  coworking: number;
}

const SCOOTER_HINT: Record<string, number> = {
  "Kolagappara, Wayanad": 5000,
  "Madikeri, Coorg": 10000,
  "Kalasa, Chikkamagaluru": 7000,
  Munnar: 3500,
  Kodaikanal: 0, // rentals reportedly banned — autos
  Varkala: 10000,
  Gokarna: 7500,
  Coonoor: 0, // car instead
};

export default function BudgetCalculator({
  results,
  cfg,
}: {
  results: DestinationResult[];
  cfg: TripConfig | null;
}) {
  const [rentLow, setRentLow] = useState(true);
  const [scooterOverride, setScooterOverride] = useState<Record<string, number>>({});
  const [foodPerPerson, setFoodPerPerson] = useState(15000);
  const [connectivityKit, setConnectivityKit] = useState(4000);
  const [coworking, setCoworking] = useState(0);

  const rows = useMemo(() => {
    return results
      .map((r) => {
        const lows = r.stays.map((s) => s.priceLow).filter((n): n is number => n != null);
        const rent = lows.length
          ? rentLow
            ? Math.min(...lows)
            : (() => {
                // comfort pick: cheapest stay with GF badge or rating ≥ 4.8, else median
                const comfort = r.stays.filter(
                  (s) => (s.guestFavourite || (s.rating ?? 0) >= 4.8) && s.priceLow != null,
                );
                const vals = (comfort.length ? comfort : r.stays)
                  .map((s) => s.priceLow ?? Infinity)
                  .filter((n) => n !== Infinity)
                  .sort((a, b) => a - b);
                return vals[Math.floor(vals.length / 2)] ?? Math.min(...lows);
              })()
          : null;
        const scooter =
          scooterOverride[r.destination] ??
          SCOOTER_HINT[r.destination] ??
          5000;
        const adults = cfg?.adults ?? 4;
        const total =
          (rent ?? 0) +
          scooter +
          connectivityKit +
          foodPerPerson * adults +
          coworking;
        return {
          destination: r.destination,
          rent,
          scooter,
          total,
          perPerson: Math.round(total / adults),
          href: r.verifyLinks.airbnb,
        };
      })
      .sort((a, b) => a.total - b.total);
  }, [results, rentLow, scooterOverride, connectivityKit, foodPerPerson, coworking, cfg]);

  const max = Math.max(...rows.map((r) => r.total), 1);
  const currency = cfg?.currency ?? "₹";
  const fmt = (n: number) => n.toLocaleString("en-IN");

  return (
    <div className="animate-fade-up space-y-5">
      {/* assumptions */}
      <div className="card p-5">
        <h3 className="font-semibold text-white">Assumptions</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="label">Rent tier</span>
            <div className="flex gap-1.5">
              <button onClick={() => setRentLow(true)} className={`chip flex-1 ${rentLow ? "chip-active" : ""}`}>
                Cheapest credible
              </button>
              <button onClick={() => setRentLow(false)} className={`chip flex-1 ${!rentLow ? "chip-active" : ""}`}>
                Comfort
              </button>
            </div>
          </div>
          <div>
            <span className="label">Food & misc / person / month</span>
            <input
              type="number"
              value={foodPerPerson}
              step={1000}
              onChange={(e) => setFoodPerPerson(Math.max(0, Number(e.target.value) || 0))}
              className="field font-mono"
            />
          </div>
          <div>
            <span className="label">Connectivity kit (one-off)</span>
            <input
              type="number"
              value={connectivityKit}
              step={500}
              onChange={(e) => setConnectivityKit(Math.max(0, Number(e.target.value) || 0))}
              className="field font-mono"
            />
          </div>
          <div>
            <span className="label">Coworking / month (optional)</span>
            <input
              type="number"
              value={coworking}
              step={1000}
              onChange={(e) => setCoworking(Math.max(0, Number(e.target.value) || 0))}
              className="field font-mono"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Rent uses each destination&apos;s verified agent prices; scooter defaults come from per-place
          research (editable below). {cfg?.currency ?? "₹"} · {cfg?.adults ?? 4} adults.
        </p>
      </div>

      {/* comparison */}
      <div className="card p-5">
        <h3 className="font-semibold text-white">
          Estimated month cost · {fmt(rows[0]?.total ?? 0)} – {fmt(rows[rows.length - 1]?.total ?? 0)} {currency}
        </h3>
        <div className="mt-5 space-y-4">
          {rows.map((r, i) => (
            <div key={r.destination}>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-white">
                  <span className="mr-2 text-slate-500">{i + 1}</span>
                  {r.destination.split(",")[0]}
                </p>
                <p className="font-mono text-sm text-accent-glow">
                  {fmt(r.total)} {currency}
                  <span className="ml-2 text-xs text-slate-500">
                    ({fmt(r.perPerson)}/person)
                  </span>
                </p>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full transition-all ${i === 0 ? "bg-gradient-to-r from-mint to-emerald-400" : "bg-gradient-to-r from-accent to-accent-soft"}`}
                  style={{ width: `${Math.max(6, (r.total / max) * 100)}%` }}
                />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-slate-500">
                <span>rent {r.rent != null ? fmt(r.rent) : "—"}</span>
                <span className="flex items-center gap-1">
                  scooter
                  <input
                    type="number"
                    value={r.scooter}
                    step={500}
                    onChange={(e) =>
                      setScooterOverride((cur) => ({
                        ...cur,
                        [r.destination]: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-16 rounded border border-white/10 bg-ink-800 px-1 py-0.5 text-right text-[11px] text-slate-300 outline-none focus:border-accent/60"
                  />
                </span>
                <span>kit {fmt(connectivityKit)}</span>
                <span>food×{cfg?.adults ?? 4} {fmt(foodPerPerson * (cfg?.adults ?? 4))}</span>
                {coworking > 0 && <span>coworking {fmt(coworking)}</span>}
                <a href={r.href} target="_blank" rel="noreferrer" className="text-accent-glow hover:underline">
                  stays ↗
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-500">
          Estimates only — rent bands are agent estimates unless marked live; everything else is an
          editable assumption. Travel to/from the region is excluded.
        </p>
      </div>
    </div>
  );
}
