import Link from "next/link";

const FEATURES = [
  {
    icon: "🧭",
    title: "Planner agent",
    body: "Normalises your destinations, flags season & peak-surge risks for your exact window before anyone starts googling.",
  },
  {
    icon: "🔍",
    title: "Destination scouts",
    body: "One agent per place, running in parallel. Real cross-checkable candidates — entire homes and cheaper room-pairs — with honest est. monthly pricing that accounts for 28-night discounts and peak surges.",
  },
  {
    icon: "🕵️",
    title: "Skeptical verifier",
    body: "Audits every shortlist against your hard filters. Nightly-rate traps, thin sources and missing wifi evidence get flagged, not buried.",
  },
  {
    icon: "📝",
    title: "Report composer",
    body: "A decisive markdown report: Answer-First ranking, one cost-sorted table per place, booking playbook with the host-validation message.",
  },
  {
    icon: "🔗",
    title: "One-click ground truth",
    body: "Every claim ships with the exact filtered Airbnb search (your dates, guests, WiFi), Booking, Maps and Reddit links. Agents grind — you verify.",
  },
  {
    icon: "🗺️",
    title: "Map, budget, drawers",
    body: "Destination pins with live prices, a per-trip month-cost calculator, and stay drawers with evidence and a ready-to-send host message.",
  },
];

const STEPS = [
  { n: "1", t: "Describe the trip", d: "Any destinations on earth, dates, group size, hard filters (video-call WiFi, workspace, Guest-favourite)." },
  { n: "2", t: "Agents fan out", d: "Planner → N parallel scouts → verifier → composer, streamed live while you watch." },
  { n: "3", t: "Decide & verify", d: "Cost-sorted shortlist, map, budget math, and pre-filtered listing links — then book with confidence." },
];

export default function Landing() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 sm:px-8">
      {/* nav */}
      <nav className="flex items-center justify-between py-6">
        <span className="text-lg font-bold text-white">
          Stay<span className="text-accent-soft">Scout</span>
        </span>
        <div className="flex items-center gap-3">
          <a href="#how" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">
            How it works
          </a>
          <Link href="/app" className="btn-primary !py-2 text-sm">
            Open workspace →
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="animate-fade-up py-16 text-center sm:py-24">
        <p className="mx-auto mb-4 w-fit rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent-glow">
          Powered by GLM agents · glm-5.3-flash
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Month-long workations,
          <span className="bg-gradient-to-r from-accent-soft via-accent-glow to-mint bg-clip-text text-transparent">
            {" "}
            researched in minutes
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          A team of AI agents scouts, verifies and cost-sorts real stays for your
          working month — entire homes or room-pairs, wifi evidence or honest flags,
          every claim one click away from the listing. From Wayanad to Lisbon.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/app" className="btn-primary !px-7 !py-3 text-base">
            Start a trip — free
          </Link>
          <Link href="/app?demo=1" className="btn-ghost !px-6 !py-3 text-base">
            ▶ See a verified example trip
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-600">
          No signup · trips stay in your browser · bring your own GLM key
        </p>
      </section>

      {/* features */}
      <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card p-6 transition hover:border-accent/40">
            <span className="text-2xl">{f.icon}</span>
            <h3 className="mt-3 font-semibold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.body}</p>
          </div>
        ))}
      </section>

      {/* how it works */}
      <section id="how" className="pb-24">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          How a run works
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card relative p-6">
              <span className="absolute -top-3.5 left-6 flex size-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold text-white">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center font-mono text-xs text-slate-600">
          planner ──▶ scout₁ ──▶ scout₂ ──▶ … ──▶ verifier ──▶ composer ──▶ you
        </p>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        StayScout — built from a real month-long workation hunt.{" "}
        <a
          href="https://github.com/rajshah001/stay-scout"
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 underline-offset-2 hover:underline"
        >
          GitHub ↗
        </a>
      </footer>
    </main>
  );
}
