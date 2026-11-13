import { NextResponse } from "next/server";

/**
 * Free, keyless hidden-gem discovery — no Serper/Tavily required.
 *
 * Engines (all verified keyless):
 *  1. SearXNG  (if SEARXNG_BASE_URL is set — the open-source, self-hosted path)
 *  2. DuckDuckGo lite HTML endpoint (unofficial, keyless, per-IP rate-capped)
 *  3. OpenStreetMap Overpass (community servers; mirror-rotated, best-effort)
 *
 * Optional: r.jina.ai can read any result URL as clean markdown (keyless).
 */

export const runtime = "nodejs";

const UA = "StayScout/1.0 (workation stay research; polite crawler)";

interface DiscoverResult {
  title: string;
  url: string;
  source: "searxng" | "ddg-lite" | "mojeek" | "overpass";
  extra?: string;
}

const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

async function searxng(query: string): Promise<DiscoverResult[]> {
  const base = process.env.SEARXNG_BASE_URL;
  if (!base) return [];
  try {
    const res = await fetch(
      `${base.replace(/\/$/, "")}/search?q=${encodeURIComponent(query)}&format=json`,
      { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12_000) },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: { title?: string; url?: string; content?: string }[] };
    return (data.results ?? [])
      .slice(0, 10)
      .map((r) => ({
        title: r.title ?? r.url ?? "result",
        url: r.url ?? "",
        source: "searxng" as const,
        extra: r.content?.slice(0, 200),
      }))
      .filter((r) => r.url);
  } catch {
    return [];
  }
}

async function ddgLite(query: string): Promise<DiscoverResult[]> {
  try {
    const res = await fetch(
      `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12_000) },
    );
    if (!res.ok) return [];
    const html = await res.text();
    const out: DiscoverResult[] = [];
    const re =
      /<a rel="nofollow" href="\/\/duckduckgo\.com\/l\/\?uddg=([^&"]+)[^"]*" class='result-link'>([^<]+)<\/a>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && out.length < 10) {
      const url = decodeURIComponent(m[1]);
      const title = m[2].trim();
      if (!/^https?:\/\//.test(url)) continue;
      if (out.some((r) => r.url === url)) continue;
      out.push({ title, url, source: "ddg-lite" });
    }
    return out;
  } catch {
    return [];
  }
}

/** Mojeek: independent index, keyless HTML. Politeness-capped; often 403s abused IPs. */
async function mojeek(query: string): Promise<DiscoverResult[]> {
  try {
    const res = await fetch(`https://www.mojeek.com/search?q=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const out: DiscoverResult[] = [];
    const re = /<a class="title[^"]*" href="(https?:\/\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && out.length < 10) {
      if (out.some((r) => r.url === m![1])) continue;
      out.push({ title: m[2].trim(), url: m[1], source: "mojeek" });
    }
    return out;
  } catch {
    return [];
  }
}

async function overpass(lat: number, lng: number): Promise<DiscoverResult[]> {
  const d = 0.12; // ≈ ±13 km box
  const bbox = `${lat - d},${lng - d},${lat + d},${lng + d}`;
  const q = `[out:json][timeout:10];(node(${bbox})[tourism~"guest_house|homestay|hostel|apartment"];way(${bbox})[tourism~"guest_house|homestay|apartment"];);out center 15;`;
  for (const mirror of OVERPASS_MIRRORS) {
    try {
      const res = await fetch(mirror, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
        body: new URLSearchParams({ data: q }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        elements?: { tags?: Record<string, string>; lat?: number; center?: { lat: number; lon: number } }[];
      };
      const out = (data.elements ?? [])
        .filter((e) => e.tags?.name)
        .slice(0, 12)
        .map((e) => {
          const t = e.tags ?? {};
          const latV = e.lat ?? e.center?.lat ?? 0;
          const lonV = e.center?.lon ?? 0;
          return {
            title: t.name,
            url: `https://www.openstreetmap.org/?mlat=${latV}&mlon=${lonV}#map=17/${latV}/${lonV}`,
            source: "overpass" as const,
            extra: [t.tourism, t.phone ?? t["contact:phone"], t.website ?? t["contact:website"]]
              .filter(Boolean)
              .join(" · "),
          };
        });
      if (out.length > 0) return out;
    } catch {
      continue; // next mirror
    }
  }
  return [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const place = searchParams.get("place")?.trim();
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  if (!place) {
    return NextResponse.json({ error: "place is required" }, { status: 400 });
  }

  const query = `${place} homestay OR guest house OR "serviced apartment" workation`;
  const engines: string[] = [];
  const [web, osm] = await Promise.all([
    (async () => {
      const sx = await searxng(query);
      if (sx.length > 0) {
        engines.push("searxng");
        return sx;
      }
      const ddg = await ddgLite(query);
      if (ddg.length > 0) {
        engines.push("ddg-lite");
        return ddg;
      }
      const mj = await mojeek(query);
      if (mj.length > 0) {
        engines.push("mojeek");
        return mj;
      }
      engines.push("all-keyless-engines-throttled");
      return [];
    })(),
    Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)
      ? overpass(lat, lng)
      : Promise.resolve([]),
  ]);
  if (osm.length > 0) engines.push("overpass");

  return NextResponse.json(
    {
      place,
      query,
      engines,
      web: web.filter(
        (r) => !/facebook|twitter|x\.com|pinterest|tripadvisor\/Attraction/i.test(r.url),
      ),
      osm,
      tip: "Paste promising URLs into r.jina.ai to read page content as text (keyless).",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
