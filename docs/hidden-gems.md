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

A server-side discovery stage (`discover()`) using a search API (Serper / Tavily / Bing) or Instagram scraping — run between planner and scouts, feeding raw URLs into the scout context. The pipeline is structured so this slots in without changing the agent contracts; it's deliberately not built in because the product ships with no paid-API requirements beyond the GLM key.
