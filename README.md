# 🏔️ StayScout

**Multi-agent workation stay research — scout → verify → cost-sort, for any destinations.**

StayScout operationalises the workflow of a serious month-long-stay hunt: enter your destinations, dates and work requirements, and a team of GLM agents researches every place in parallel — planner, destination scouts, a skeptical verifier, and a report composer — then hands you a decisive, cost-sorted shortlist where **every AI claim is one click away from ground truth** (pre-filtered Airbnb searches with your dates, guests and WiFi filters; Booking; Google Maps reviews; Reddit intel).

## ✨ What it does

```
┌─────────┐   ┌─────────────────────────┐   ┌───────────┐   ┌──────────┐
│ Planner │ → │ N destination Scouts    │ → │ Verifier  │ → │ Composer │
│ 1 call  │   │ (parallel, ≤4 at once)  │   │ 1 call    │   │ 1 call   │
└─────────┘   └─────────────────────────┘   └───────────┘   └──────────┘
      live SSE progress → results dashboard → markdown report export
```

- **Planner** — normalises destinations, flags season/peak risks for your window
- **Scouts** — one agent per destination; returns 4–6 real, cross-checkable candidates covering entire homes *and* cheaper room-pairs, with honest `est.` pricing for 28+ nights (Airbnb monthly discounts), wifi evidence or explicit "confirm with host", workspace, power backup, evening access, and 2+ sources each
- **Verifier** — audits every shortlist against your hard filters; flags nightly-rate traps, thin sources, missing evidence
- **Composer** — final markdown report: *Answer First* ranking → one cost-sorted table per place → booking playbook with the host-validation message → cost snapshot
- **Human verification built in** — per destination, one-click deep links recreate the exact filtered searches (Airbnb with WiFi + dates + guests + monthly pricing, Booking, Google Maps, Reddit) — the agents grind, you verify

## 🚀 Quick start

```bash
npm install
cp .env.example .env.local   # add your GLM API key
npm run dev                  # http://localhost:3000
```

### Configuration (`.env.local`)

```bash
GLM_API_KEY=your_glm_api_key_here
GLM_BASE_URL=https://api.z.ai/api/paas/v4   # Z.ai OpenAI-compatible endpoint
GLM_MODEL=glm-5.3-flash
```

Any OpenAI-compatible endpoint works — point `GLM_BASE_URL` at it and set your `GLM_MODEL`.

## 🧭 Using it

1. Pick or type up to 8 destinations (villages, towns, "Lisbon; Madeira" — anything)
2. Set dates, number of working adults, seating preference (entire home vs. room-pairs), hard filters (video-call WiFi, dedicated workspace, Guest-favourite only), budget
3. Watch the agent team run live — each scout streams its shortlist as it lands
4. Open each destination's **Verify live** links to confirm against real listings
5. Copy or download the final markdown report

## 🧱 Stack

Next.js 14 (App Router) · Tailwind CSS · SSE streaming · GLM (`glm-5.3-flash`) via the OpenAI-compatible API — no other runtime dependencies.

## 🔒 Notes

- Your API key lives in `.env.local` (gitignored) and is only used server-side in the `/api/research` route.
- Agent shortlists are AI-knowledge-driven candidates with source links — the product's design assumption is the same one a good human researcher follows: *never book without opening the listing and asking the host the validation question (the playbook template is in every report).*

## 📄 License

MIT
