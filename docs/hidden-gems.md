# 💎 The Hidden-Gem Playbook

*Case study: Eden's Homestay, Chongey Tar (Gangtok) — and the generalizable recipe for finding stays that mainstream lists never show.*

## The miss

During a Sikkim research run, the agents shortlisted 5 regions (Gangtok, Pelling, Namchi, Lachung/Lachen, Ravangla) with ~29 sourced candidates — and missed **Eden's Homestay** in **Chongey Tar**, a micro-locality ~6–7 km from central Gangtok. The property is real, loved, and virtually invisible to conventional research:

- marketed almost entirely via **Instagram** ([@edenshomestaysikkim](https://www.instagram.com/edenshomestaysikkim) — "live the slow life… miss the sunrise or sunset")
- **Agoda 9.5/10 — from a single review** ([listing](https://www.agoda.com/edens-homestay/hotel/gangtok-in.html)); Booking.com 9.0 ([listing](https://www.booking.com/hotel/in/edens-homestay.html))
- sits in a residential ridge pocket, not a "destination"

## Why the pipeline missed it (post-mortem)

| # | Gap | Mechanism |
|---|---|---|
| 1 | **Fame bias** | The planner expands a state into its 5 famous hubs. Chongey Tar never became a query. |
| 2 | **Knowledge floor** | Scouts reason from training data. An Instagram-marketed homestay with 1 OTA review is below the reliable-knowledge floor — and the no-fabrication rule (correctly) blocks inventing it. |
| 3 | **Evidence-bar suppression** | "1 review" scores as risk → filtered out, never surfaced. Hidden gems look exactly like risks at screening time. |
| 4 | **Channel mismatch** | The property's *only* marketing channel is Instagram. An Airbnb-first OTA pipeline structurally cannot see it. |

## The recipe (now built into StayScout)

**Layer 1 — Planner micro-locality pockets.** The planner is instructed to expand every destination into its *lesser-known pockets* — villages, ridges, offbeat neighbourhoods where travelers actually stay (Chongey Tar, Okhrey, Rmetek…). Scouts receive these as mandatory consideration zones.

**Layer 2 — Scout hidden-gem tier.** Every scout must surface 1–2 under-reviewed / single-platform / social-marketed leads, flagged `hidden gem lead — low review mass, verify on platform/socials`. Evidence fields stay honest ("unverified — confirm with host"). Gems get *surfaced*, never auto-trusted.

**Layer 3 — Discovery Kit (human-in-the-loop).** Agents can't browse (by design of most LLM API plans). Each destination ships six one-click queries that find exactly this class of property:
1. `"<area>" homestay site:instagram.com` — Instagram-only marketing
2. `"<area>" workation OR "month" homestay` on Reddit (r/WorkationIndia, r/SoloTravel_India) — first-person month-stay reports
3. Google Maps `homestay near <area>` — 20–150-review properties absent from OTAs
4. offbeat blog sweep (`-site:airbnb.com -site:booking.com blog OR "how to reach"`)
5. `site:makemytrip.com OR site:goibibo.com <area> homestay` — Indian OTA long tail
6. hostel/Zostel-belt private rooms — cheap work bases

**Layer 4 — Honest validation.** A gem enters the shortlist as a *lead*: thin-evidence flags stay visible, the host-validation message (speedtest, backup scope, monthly rate) is mandatory before money moves.

## What would take this from 90% to 100% automated

**Done — `GET /api/discover` (free, keyless):** the product now ships an automated discovery stage with a rotation of free engines (verified by live testing from a clean IP):

| Engine | Status | Notes |
|---|---|---|
| **SearXNG** (self-hosted) | ✅ reliable | The genuinely free & open-source answer. One Docker container, JSON API, aggregates 200+ engines. Set `SEARXNG_BASE_URL`. Public instances usually bot-wall JSON. |
| **DuckDuckGo lite** | ⚠️ keyless, flaky | Worked in testing; throttles per-IP after repeated hits. Unofficial. |
| **Mojeek** | ⚠️ keyless, flaky | Independent index; 403s abused networks. |
| **Overpass (OpenStreetMap)** | ⚠️ keyless, best-effort | Maps mapped guest houses/homestays with coordinates. Community servers hit capacity; mirror-rotated (overpass-api.de → kumi → private.coffee). |
| **r.jina.ai** | ✅ keyless | Reads any result URL as clean markdown — verified live pulling an Agoda listing. |
| Marginalia | 🔑 free key now required | Open-source independent index; great for the indie web. |
| Serper / Tavily | 💰 freemium | The user asked for alternatives to these — SearXNG self-host is the drop-in free replacement. |

UI: the **💎 Hidden-gem hunt** box has an **"▶ Auto-discover (free · no API key)"** button — it runs DDG-lite/OSM discovery for the destination and lets you append any result to the trip as a flagged hidden-gem lead with one click. When the keyless engines throttle, the manual kit above still works, and self-hosting SearXNG makes auto-discovery fully reliable forever.
