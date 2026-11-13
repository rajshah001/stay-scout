import { glmChat, glmChatAll, parseJsonLoose } from "./glm";
import { verifyLinksFor } from "./deeplinks";
import type {
  DestinationResult,
  StayCandidate,
  StreamEvent,
  TripConfig,
} from "./types";

type Emit = (event: StreamEvent) => void;

const SCOUT_SYSTEM = `You are a meticulous solo travel-research agent specialising in month-long WORKATIONS (remote workers who need genuine work infrastructure, not holidays).

You research ONE destination and return a shortlist of real, verifiable stays. Rules:
- NEVER invent URLs, exact prices, ratings or review quotes. If you are not certain, label the value "est." and set a plausible band instead.
- Prefer SPECIFIC named stays you have high confidence exist (widely listed on Airbnb / Booking.com / MakeMyTrip / Goibibo / Agoda / known brands like SaffronStays, StayVista, Zostel, The Hosteller, or well-known local homestays). Use the property's real name and area. Only when no specific named stay fits a price tier, fall back to a precisely-described category (e.g. "Serviced 2BHK apartments near <area>") and add flag "category candidate — search the platform link for exact units". Include 4–6 candidates, ranked by expected value, spanning budget → comfort tiers.
- A workation stay MUST satisfy: (1) WiFi credible for video calls — cite any known evidence (listing amenity, measured speed, review reputation) or mark wifiEvidence as "unverified — confirm with host"; (2) a dedicated workspace or at least a real table; (3) bookable on a major platform; (4) priceBand28n = an honest estimated 28-night band for the full group, remembering Airbnb auto-discounts 20–50% on 28+ nights and seasonal peak surges.
- Cover BOTH configurations: entire homes that sleep the whole group AND (if cheaper) pairs of 2-person units in one property. Mark type accordingly: "entire", "pair", "two-rooms", "villa".
- For hill/coastal areas note power backup, heating (if cold season), and distance to town for evening access.
- flags: any risk, e.g. "single bathroom for 4", "peak surge likely", "mobile hotspot dependent", "shared with host family".
- sources: 2+ distinct platforms/aggregators where the stay can be cross-checked (name + url each).
Return ONLY JSON matching the schema exactly.`;

const SCOUT_SCHEMA = `{
  "destination": "string (as given)",
  "tagline": "one line: what this place is best for as a workation base",
  "stays": [{
    "name": "string",
    "type": "entire | pair | two-rooms | villa | unknown",
    "platform": "Airbnb | Booking.com | MakeMyTrip | Goibibo | Agoda | official site",
    "url": "best-known bookable URL (search page of the platform for this stay is acceptable if listing URL unknown — then add '/search' marker in flags)",
    "rating": number | null,
    "reviewCount": number | null,
    "guestFavourite": boolean | null,
    "superhost": boolean | null,
    "bedrooms": number | null,
    "bathrooms": number | null,
    "sleeps": number | null,
    "priceBand28n": "string like '₹30k–40k est.'",
    "priceLow": number | null,
    "priceHigh": number | null,
    "wifiEvidence": "string — evidence or 'unverified — confirm with host'",
    "dedicatedWorkspace": boolean | null,
    "powerBackup": "string",
    "locationArea": "string",
    "eveningAccess": "string",
    "heating": "string",
    "flags": ["string"],
    "sources": [{"name": "string", "url": "string"}]
  }],
  "bestValue": "stay name + why + expected cost",
  "cheapestDecent": "stay name + why + expected cost",
  "connectivityNotes": ["Jio/Airtel reality", "power cut reality", "backup cafe/work spots", "scooter/car rental monthly cost", "season/weather note"],
  "dropped": ["reason a common trap option was excluded"]
}`;

function nightsBetween(checkin: string, checkout: string): number {
  return Math.max(
    1,
    Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86_400_000),
  );
}

function dateRangeNote(cfg: TripConfig): string {
  const nights = nightsBetween(cfg.checkin, cfg.checkout);
  const start = new Date(cfg.checkin).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const end = new Date(cfg.checkout).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${start} → ${end} (${nights} nights)`;
}

/* ------------------------------------------------------------------ */
/* Stage 1 — planner                                                   */
/* ------------------------------------------------------------------ */

async function runPlanner(cfg: TripConfig, emit: Emit): Promise<void> {
  emit({ type: "phase", phase: "planning", detail: "Normalising destinations and trip shape" });
  const raw = await glmChat(
    [
      {
        role: "system",
        content:
          "You are the planner agent of a workation-stay research team. Return ONLY JSON.",
      },
      {
        role: "user",
        content: `Trip: ${cfg.destinations.join(", ")} | ${dateRangeNote(cfg)} | ${cfg.adults} working adults | currency ${cfg.currency} | seating preference: ${cfg.seating} | must-have: wifi=${cfg.mustHaveWifi}, workspace=${cfg.mustHaveWorkspace}, guestFavouriteOnly=${cfg.guestFavouriteOnly} | budget: ${cfg.budgetPerMonth || "flexible"} | extra: ${cfg.extraNotes || "none"}.

Return JSON: {"normalizedDestinations": ["primary town/village name per destination, with region, e.g. 'Madikeri, Coorg, Karnataka'"], "coordinates": [{"name": "exact normalized destination string", "lat": number, "lng": number}], "pockets": [{"near": "exact normalized destination string", "names": ["2-4 lesser-known micro-localities, villages or offbeat pockets where travelers actually stay within reach of that destination, e.g. 'Chongey Tar, Gangtok' or 'Okhrey, West Sikkim'"]}], "seasonNote": "one line on weather/peak season for the dates", "risks": ["one-line risks to watch, e.g. peak surge, landslide zones, wifi-weak areas"]}`,
      },
    ],
    { json: true, temperature: 0.2, maxTokens: 1600 },
  );
  const plan = parseJsonLoose<{
    normalizedDestinations: string[];
    coordinates?: { name: string; lat: number; lng: number }[];
    pockets?: { near: string; names: string[] }[];
    seasonNote: string;
    risks: string[];
  }>(raw);
  emit({
    type: "phase",
    phase: "plan-ready",
    detail: plan.seasonNote,
  });
  (plan as unknown as { risks?: string[] }).risks?.forEach((r) =>
    emit({ type: "log", agentId: "planner", line: r }),
  );
  // stash normalized names + coordinates + micro-locality pockets for scouts
  (cfg as TripConfig & { __normalized?: string[] }).__normalized =
    plan.normalizedDestinations;
  (cfg as TripConfig & { __coords?: Record<string, { lat: number; lng: number }> }).__coords =
    Object.fromEntries(
      (plan.coordinates ?? [])
        .filter((c) => typeof c.lat === "number" && typeof c.lng === "number")
        .map((c) => [c.name, { lat: c.lat, lng: c.lng }]),
    );
  (cfg as TripConfig & { __pockets?: Record<string, string[]> }).__pockets =
    Object.fromEntries(
      (plan.pockets ?? []).map((p) => [p.near, p.names ?? []]),
    );
}

/* ------------------------------------------------------------------ */
/* Stage 2 — destination scouts (parallel)                             */
/* ------------------------------------------------------------------ */

async function scoutOne(
  place: string,
  cfg: TripConfig,
  emit: Emit,
  agentId: string,
): Promise<DestinationResult> {
  emit({
    type: "agent",
    agent: { id: agentId, name: `Scout · ${place}`, role: "Destination scout", destination: place, phase: "running" },
  });
  emit({ type: "log", agentId, line: `Researching stays for ${place}…` });

  const seatingNote =
    cfg.seating === "entire-preferred"
      ? "Prefer entire homes for the whole group; include room-pairs only when dramatically cheaper."
      : cfg.seating === "pair-ok"
        ? "Actively include 2-person unit pairs in one property when cheaper than entire homes."
        : "Any configuration that seats the group comfortably.";

  const pockets =
    (cfg as TripConfig & { __pockets?: Record<string, string[]> }).__pockets;
  const pocketNames: string[] = [];
  for (const [near, names] of Object.entries(pockets ?? {})) {
    if (place.includes(near.split(",")[0].trim()) || near.includes(place.split(",")[0].trim())) {
      pocketNames.push(...names);
    }
  }
  const pocketsNote = pocketNames.length
    ? `\nMicro-localities you MUST also consider for hidden gems (small homestays in these pockets are exactly what mainstream lists miss): ${pocketNames.join("; ")}`
    : "";

  const user = `Research destination: ${place}
Trip window: ${dateRangeNote(cfg)} · ${cfg.adults} working adults · currency ${cfg.currency} · budget ${cfg.budgetPerMonth || "flexible"}
${seatingNote}
Hard filters: wifi-for-calls=${cfg.mustHaveWifi} · dedicated workspace=${cfg.mustHaveWorkspace} · guest-favourite-only=${cfg.guestFavouriteOnly}
Extra context from the team lead: ${cfg.extraNotes || "none"}${pocketsNote}

Produce the shortlist JSON now. If stock for this destination is genuinely thin (small village), say so in the tagline/flags and include the best realistic alternative within reach, flagged in flags as "alternative area".

HIDDEN-GEM TIER (required): include 1–2 "hidden gem lead" entries — small, under-reviewed, single-platform or Instagram/word-of-mouth-marketed properties in micro-localities that mainstream lists miss. Mark each with flag "hidden gem lead — low review mass, verify on platform/socials before booking". Set their evidence fields honestly (wifiEvidence: "unverified — confirm with host") and keep priceLow/priceHigh as honest bands. A hidden-gem lead counts toward your 4–6 candidates only if it does not displace a better-evidenced option; otherwise extend to at most 7 total.`;

  try {
    const raw = await glmChat(
      [
        { role: "system", content: SCOUT_SYSTEM },
        { role: "user", content: `${user}\n\nJSON schema:\n${SCOUT_SCHEMA}` },
      ],
      { json: true, temperature: 0.35, maxTokens: 6000 },
    );
    const parsed = parseJsonLoose<Partial<DestinationResult>>(raw);
    const stays: StayCandidate[] = (parsed.stays ?? [])
      .map((s) => {
        const stay: StayCandidate = {
          name: s.name ?? "Unknown stay",
          type: (s.type as StayCandidate["type"]) ?? "unknown",
          platform: s.platform ?? "Airbnb",
          url: s.url ?? "",
          rating: typeof s.rating === "number" ? s.rating : null,
          reviewCount: typeof s.reviewCount === "number" ? s.reviewCount : null,
          guestFavourite: typeof s.guestFavourite === "boolean" ? s.guestFavourite : null,
          superhost: typeof s.superhost === "boolean" ? s.superhost : null,
          bedrooms: s.bedrooms ?? null,
          bathrooms: s.bathrooms ?? null,
          sleeps: s.sleeps ?? null,
          priceBand28n: s.priceBand28n ?? "price on request",
          priceLow: typeof s.priceLow === "number" ? s.priceLow : null,
          priceHigh: typeof s.priceHigh === "number" ? s.priceHigh : null,
          wifiEvidence: s.wifiEvidence ?? "unverified — confirm with host",
          dedicatedWorkspace:
            typeof s.dedicatedWorkspace === "boolean" ? s.dedicatedWorkspace : null,
          powerBackup: s.powerBackup ?? "unknown",
          locationArea: s.locationArea ?? "",
          eveningAccess: s.eveningAccess ?? "",
          heating: s.heating ?? "",
          flags: Array.isArray(s.flags) ? s.flags : [],
          sources: Array.isArray(s.sources) ? s.sources : [],
        };
        // sort key: low bound of the 28-night band
        if (stay.priceLow == null) {
          const m = stay.priceBand28n.match(/[\d][\d,.]*\s*(k|L|lakh)?/i);
          if (m) {
            let n = parseFloat(m[0].replace(/,/g, ""));
            const unit = (m[1] ?? "").toLowerCase();
            if (unit === "k") n *= 1_000;
            if (unit === "l" || unit === "lakh") n *= 100_000;
            stay.priceLow = n;
          }
        }
        return stay;
      })
      .sort((a, b) => (a.priceLow ?? Infinity) - (b.priceLow ?? Infinity));

    emit({ type: "log", agentId, line: `${stays.length} candidates shortlisted` });
    emit({
      type: "agent",
      agent: { id: agentId, name: `Scout · ${place}`, role: "Destination scout", destination: place, phase: "done", detail: `${stays.length} stays` },
    });

    return {
      destination: place,
      tagline: parsed.tagline ?? "",
      stays,
      bestValue: parsed.bestValue ?? "",
      cheapestDecent: parsed.cheapestDecent ?? "",
      connectivityNotes: Array.isArray(parsed.connectivityNotes)
        ? parsed.connectivityNotes
        : [],
      dropped: Array.isArray(parsed.dropped) ? parsed.dropped : [],
      verifyLinks: verifyLinksFor(place, cfg),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    emit({
      type: "agent",
      agent: { id: agentId, name: `Scout · ${place}`, role: "Destination scout", destination: place, phase: "error", detail: message },
    });
    return {
      destination: place,
      tagline: "",
      stays: [],
      bestValue: "",
      cheapestDecent: "",
      connectivityNotes: [],
      dropped: [],
      verifyLinks: verifyLinksFor(place, cfg),
      error: message,
    };
  }
}

/* ------------------------------------------------------------------ */
/* Stage 3 — verifier                                                  */
/* ------------------------------------------------------------------ */

interface VerifierOutput {
  reviews: { destination: string; verdict: string; confidence: "high" | "medium" | "low" }[];
  corrections: string[];
}

async function runVerifier(
  cfg: TripConfig,
  results: DestinationResult[],
  emit: Emit,
): Promise<VerifierOutput> {
  const agentId = "verifier";
  emit({
    type: "agent",
    agent: { id: agentId, name: "Verifier", role: "Cross-validation & ranking", phase: "running" },
  });
  emit({ type: "log", agentId, line: "Cross-checking shortlists against the hard filters…" });

  const summary = results
    .map(
      (r) =>
        `## ${r.destination}\n${r.stays
          .map(
            (s) =>
              `- ${s.name} | ${s.platform} | ${s.priceBand28n} | wifi: ${s.wifiEvidence} | workspace: ${s.dedicatedWorkspace} | flags: ${s.flags.join("; ") || "none"} | sources: ${s.sources.length}`,
          )
          .join("\n")}`,
    )
    .join("\n\n");

  try {
    const raw = await glmChat(
      [
        {
          role: "system",
          content:
            "You are the verification agent. You audit travel shortlists for a workation. Be skeptical: wifi claims without evidence, missing sources, prices that look like 2-night holiday rates instead of monthly rates, and configurations that don't seat the group are all failures. Return ONLY JSON.",
        },
        {
          role: "user",
          content: `Trip: ${cfg.destinations.join(", ")} · ${dateRangeNote(cfg)} · ${cfg.adults} adults · must-have wifi=${cfg.mustHaveWifi} workspace=${cfg.mustHaveWorkspace} · seating=${cfg.seating}

Shortlists:
${summary}

Return JSON: {"reviews":[{"destination":"...","verdict":"one-paragraph audit: does the shortlist satisfy the hard filters? which stays are strongest/weakest and why","confidence":"high|medium|low"}],"corrections":["actionable correction lines, e.g. 'X's price looks like a nightly holiday rate — treat as est.'"]}`,
        },
      ],
      { json: true, temperature: 0.2, maxTokens: 3000 },
    );
    const out = parseJsonLoose<VerifierOutput>(raw);
    for (const r of out.reviews ?? []) {
      emit({
        type: "log",
        agentId,
        line: `${r.destination}: ${r.verdict} (confidence: ${r.confidence})`,
      });
    }
    emit({
      type: "agent",
      agent: { id: agentId, name: "Verifier", role: "Cross-validation & ranking", phase: "done", detail: `${out.reviews?.length ?? 0} audits` },
    });
    return out;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    emit({ type: "agent", agent: { id: agentId, name: "Verifier", role: "Cross-validation & ranking", phase: "error", detail: message } });
    return { reviews: [], corrections: [message] };
  }
}

/* ------------------------------------------------------------------ */
/* Stage 4 — composer (streams markdown)                               */
/* ------------------------------------------------------------------ */

async function runComposer(
  cfg: TripConfig,
  results: DestinationResult[],
  verifier: VerifierOutput,
  emit: Emit,
): Promise<string> {
  const agentId = "composer";
  emit({
    type: "agent",
    agent: { id: agentId, name: "Composer", role: "Final report", phase: "running" },
  });

  const dataJson = JSON.stringify(
    {
      trip: { window: dateRangeNote(cfg), adults: cfg.adults, currency: cfg.currency, seating: cfg.seating, budget: cfg.budgetPerMonth || "flexible" },
      destinations: results,
      verifier,
    },
    null,
    1,
  );

  const SYSTEM = `You are the report composer for a workation-stay research team. You produce a decisive, scannable markdown report in this exact structure:

# 🏔️ Workation Stay Shortlist — <trip title>
(one-line context: dates, guests, currency)

## 🎯 The Answer First
| Rank | Destination | 🏆 Pick | 28-night cost (${cfg.adults} adults) | Status | Link |  — one row per destination, then a one-line recommendation in a blockquote.

Then ONE section per destination (merge ALL findings into a single table, sorted low → high cost for the full group):
# N · <Destination>
> verdict blockquote: best value + cheapest + key caveat
| # | Option | Type | Rating | 28-night cost | Config & notes |   (Type: Entire / Pair / 2 rooms / Villa; add ✅ live / ⚠️ caveat / 💡 lead markers; make Option a markdown link to the stay URL)
followed by: **❌ dropped:** line, and **On the ground:** connectivity/logistics bullets.

## 📋 Booking playbook  (6 numbered steps incl. the host-validation message template)

## 💰 Cost snapshot  (table: destination | cheapest credible | comfort pick | delta vs cheapest destination)

Style rules: prices keep the "est." label when uncertain; never drop the est./unverified markers; keep every URL; prefer ₹ formatting like ₹30,291 or ₹30k–40k; be decisive but honest about what needs host confirmation. Output ONLY the markdown, no preamble.`;

  // Stream composer tokens via the non-stream chat then chunk-emit, to keep
  // the SSE protocol simple and the client render incremental.
  const markdown = await glmChat(
    [
      { role: "system", content: SYSTEM },
      { role: "user", content: `Compose the final report from this research payload:\n\n${dataJson}` },
    ],
    { temperature: 0.3, maxTokens: 8000 },
  );

  // chunked emit for a streaming feel
  const chunkSize = 400;
  for (let i = 0; i < markdown.length; i += chunkSize) {
    emit({ type: "report", markdown: markdown.slice(i, i + chunkSize) });
    await new Promise((r) => setTimeout(r, 15));
  }
  emit({
    type: "agent",
    agent: { id: agentId, name: "Composer", role: "Final report", phase: "done", detail: `${markdown.length} chars` },
  });
  return markdown;
}

/* ------------------------------------------------------------------ */
/* Orchestrator                                                        */
/* ------------------------------------------------------------------ */

export async function runResearch(cfg: TripConfig, emit: Emit): Promise<void> {
  emit({ type: "config", config: cfg });
  try {
    await runPlanner(cfg, emit);
    emit({ type: "phase", phase: "scouting", detail: `${cfg.destinations.length} destination scouts in parallel` });

    const cfgX = cfg as TripConfig & {
      __normalized?: string[];
      __coords?: Record<string, { lat: number; lng: number }>;
    };
    const normalized = cfgX.__normalized ?? cfg.destinations;
    const coords = cfgX.__coords ?? {};

    const results: DestinationResult[] = [];
    const tasks = normalized.map((place, i) => ({ place, agentId: `scout-${i}` }));
    // run scouts with bounded concurrency, streaming per-place results as they land
    let cursor = 0;
    const concurrency = Math.min(4, tasks.length);
    await Promise.all(
      Array.from({ length: concurrency }, async () => {
        while (cursor < tasks.length) {
          const t = tasks[cursor++];
          const result = await scoutOne(t.place, cfg, emit, t.agentId);
          result.coords = coords[t.place] ?? coords[normalized[tasks.indexOf(t)]] ?? result.coords;
          // tolerate key drift: nearest match by prefix
          if (!result.coords) {
            const key = Object.keys(coords).find((k) => k.includes(t.place.split(",")[0].trim()));
            if (key) result.coords = coords[key];
          }
          emit({ type: "destination", result });
          results.push(result);
        }
      }),
    );

    const verifier = await runVerifier(cfg, results, emit);
    emit({ type: "phase", phase: "composing", detail: "Writing the final report" });
    const markdown = await runComposer(cfg, results, verifier, emit);
    emit({ type: "report", markdown });
    emit({ type: "phase", phase: "done" });
    emit({ type: "done" });
  } catch (err) {
    emit({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    });
    emit({ type: "done" });
  }
}
