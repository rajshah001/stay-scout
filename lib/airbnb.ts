import type { TripConfig } from "./types";

/**
 * Live Airbnb listing enrichment — keyless, via r.jina.ai rendering of the
 * filtered Airbnb search page (dates + guests + WiFi baked into the URL).
 * Returns REAL listings: room id, title, area, badge, config, live monthly price.
 * Yield is whatever the search page renders before capture (1–6 cards typical).
 */

const JINA = "https://r.jina.ai/";

export interface LiveListing {
  roomId: string;
  url: string;
  title: string;
  typeArea: string;
  badge: string;
  config: string;
  monthlyPrice: string;
  originalPrice: string;
  raw: string;
}

function airbnbUrl(place: string, cfg: Pick<TripConfig, "checkin" | "checkout" | "adults">) {
  const slug = place
    .trim()
    .split(/\s*,\s*|\s+/)
    .map((p) => p.replace(/[^\w-]/g, ""))
    .filter(Boolean)
    .join("--");
  return (
    `https://www.airbnb.co.in/s/${slug}/homes` +
    `?checkin=${cfg.checkin}&checkout=${cfg.checkout}&adults=${cfg.adults}` +
    `&amenities%5B%5D=4&price_filter_input_type=1&price_filter_num_nights=28&search_mode=regular_search`
  );
}

function parseCards(markdown: string): LiveListing[] {
  const out: LiveListing[] = [];
  const seen = new Set<string>();
  // card boundaries: every distinct room link
  const marker = /https:\/\/www\.airbnb\.co\.in\/rooms\/(\d{15,})/g;
  const marks: { id: string; idx: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = marker.exec(markdown))) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      marks.push({ id: m[1], idx: m.index });
    }
    if (marks.length > 12) break;
  }
  for (let i = 0; i < marks.length; i++) {
    const chunk = markdown.slice(marks[i].idx, i + 1 < marks.length ? marks[i + 1].idx : marks[i].idx + 3000);
    const lines = chunk
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("![") && !l.startsWith("[](") && !l.startsWith("[!["));
    const cfgLineIdx = lines.findIndex((l) => /bedrooms?/.test(l) && /bathrooms?/.test(l));
    if (cfgLineIdx === -1) continue; // not a listing card
    const title = lines[cfgLineIdx - 1] ?? "";
    const typeArea = lines[cfgLineIdx - 2] ?? "";
    const badgeLine = lines.find((l) => /Guest favourite|Superhost|New place to stay|Top guest/i.test(l));
    const priceMatch = chunk.match(/₹([\d,]+)\s*(?:₹[\d,]+\s*)?monthly, originally ₹([\d,]+)/);
    const monthly = priceMatch ? `₹${priceMatch[1]}` : chunk.match(/₹[\d,]+/)?.[0] ?? "";
    if (!title) continue;
    out.push({
      roomId: marks[i].id,
      url: `https://www.airbnb.co.in/rooms/${marks[i].id}`,
      title,
      typeArea,
      badge: badgeLine?.replace(/New/g, "").trim() ?? "",
      config: lines[cfgLineIdx],
      monthlyPrice: monthly,
      originalPrice: priceMatch ? `₹${priceMatch[2]}` : "",
      raw: chunk.slice(0, 600),
    });
  }
  return out;
}

export async function airbnbDiscover(
  place: string,
  cfg: Pick<TripConfig, "checkin" | "checkout" | "adults">,
): Promise<{ listings: LiveListing[]; url: string; error?: string }> {
  const url = airbnbUrl(place, cfg);
  // r.jina.ai renders incrementally & caches per-URL: do up to 3 cache-busted
  // captures and merge unique listings until we have a useful count.
  const merged: LiveListing[] = [];
  const seen = new Set<string>();
  let lastError: string | undefined;
  for (let attempt = 0; attempt < 3 && merged.length < 4; attempt++) {
    try {
      const target = attempt === 0 ? url : `${url}&cachebust=${Date.now()}-${attempt}`;
      const res = await fetch(`${JINA}${target}`, {
        headers: {
          "User-Agent": "StayScout/1.0",
          "X-Wait-For-Selector": "[data-testid=card-container]",
          "X-Timeout": "40",
          "X-Return-Format": "markdown",
        },
        signal: AbortSignal.timeout(75_000),
      });
      if (!res.ok) {
        lastError = `jina ${res.status}`;
        continue;
      }
      const md = await res.text();
      if (md.length < 4000) {
        lastError = "page shell only — Airbnb didn't render";
        continue;
      }
      let added = 0;
      for (const c of parseCards(md)) {
        if (!seen.has(c.roomId)) {
          seen.add(c.roomId);
          merged.push(c);
          added++;
        }
      }
      if (added === 0) break; // identical capture — stop early
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }
  return { listings: merged, url, error: merged.length === 0 ? lastError : undefined };
}