"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ConfigForm from "@/components/ConfigForm";
import AgentTimeline from "@/components/AgentTimeline";
import ResultsDashboard from "@/components/ResultsDashboard";
import { createPlan, loadPlans, persistPlans, type Plan } from "@/lib/plans";
import { buildDemoReport, DEMO_CONFIG, DEMO_COORDS, DEMO_RESULTS } from "@/lib/demo";
import type {
  AgentStatus,
  DestinationResult,
  StreamEvent,
  TripConfig,
} from "@/lib/types";

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<string>("idle");
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");
  const resultsRef = useRef<DestinationResult[]>([]);
  const hydrating = useRef(false);
  const phaseRef = useRef<string>("idle");

  const setPhaseSafe = useCallback((p: string) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const active = plans.find((p) => p.id === activeId) ?? null;
  const running =
    active?.status === "running" && phase !== "done" && phase !== "error";

  // hydrate trips from localStorage once
  useEffect(() => {
    const wantsDemo =
      typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "1";
    const stored = loadPlans();
    if (wantsDemo) {
      const demo = createPlan("Demo — South India (verified)");
      demo.status = "done";
      demo.config = DEMO_CONFIG;
      demo.results = DEMO_RESULTS;
      demo.report = buildDemoReport();
      const next = [demo, ...stored];
      persistPlans(next);
      setPlans(next);
      setActiveId(demo.id);
      hydrate(demo);
      return;
    }
    if (stored.length > 0) {
      setPlans(stored);
      setActiveId(stored[0].id);
      hydrate(stored[0]);
    } else {
      const first = createPlan();
      setPlans([first]);
      setActiveId(first.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hydrate = (plan: Plan) => {
    hydrating.current = true;
    resultsRef.current = plan.results;
    setAgents([]);
    setLogs({});
    setError("");
    setPhaseSafe(
      plan.status === "done" || plan.status === "error"
        ? plan.status
        : plan.status === "running"
          ? "done" // a reload mid-run: treat as finished snapshot
          : "idle",
    );
    hydrating.current = false;
  };

  const updateActive = useCallback(
    (patch: Partial<Plan> | ((p: Plan) => Partial<Plan>)) => {
      setPlans((cur) => {
        const next = cur.map((p) =>
          p.id === activeId
            ? {
                ...p,
                ...(typeof patch === "function" ? patch(p) : patch),
                updatedAt: Date.now(),
              }
            : p,
        );
        persistPlans(next);
        return next;
      });
    },
    [activeId],
  );

  const upsertAgent = useCallback((agent: AgentStatus) => {
    setAgents((cur) => {
      const idx = cur.findIndex((a) => a.id === agent.id);
      if (idx === -1) return [...cur, agent];
      const next = [...cur];
      next[idx] = agent;
      return next;
    });
  }, []);

  const pushLog = useCallback((agentId: string, line: string) => {
    setLogs((cur) => ({
      ...cur,
      [agentId]: [...(cur[agentId] ?? []), line],
    }));
  }, []);

  const switchPlan = (plan: Plan) => {
    if (running) return;
    setActiveId(plan.id);
    hydrate(plan);
  };

  const newTrip = () => {
    if (running) return;
    const plan = createPlan(plans.length > 0 ? `Trip ${plans.length + 1}` : undefined);
    setPlans((cur) => {
      const next = [plan, ...cur];
      persistPlans(next);
      return next;
    });
    setActiveId(plan.id);
    hydrate(plan);
  };

  const loadDemoTrip = () => {
    if (running) return;
    if (plans.some((p) => p.name.startsWith("Demo —"))) {
      const existing = plans.find((p) => p.name.startsWith("Demo —"))!;
      setActiveId(existing.id);
      hydrate(existing);
      return;
    }
    const demo = createPlan("Demo — South India (verified)");
    demo.status = "done";
    demo.config = DEMO_CONFIG;
    demo.results = DEMO_RESULTS;
    demo.report = buildDemoReport();
    setPlans((cur) => {
      const next = [demo, ...cur];
      persistPlans(next);
      return next;
    });
    setActiveId(demo.id);
    hydrate(demo);
  };

  const deletePlan = (id: string) => {
    if (running && id === activeId) return;
    setPlans((cur) => {
      const next = cur.filter((p) => p.id !== id);
      persistPlans(next);
      return next;
    });
    if (id === activeId) {
      const remaining = plans.filter((p) => p.id !== id);
      const fallback = remaining[0] ?? createPlan();
      if (remaining.length === 0) {
        setPlans([fallback]);
        persistPlans([fallback]);
      }
      setActiveId(fallback.id);
      hydrate(fallback);
    }
  };

  const run = useCallback(
    async (config: TripConfig) => {
      if (!activeId) return;
      setError("");
      setAgents([]);
      setLogs({});
      resultsRef.current = [];
      setPhaseSafe("connecting");
      updateActive({ status: "running", config, results: [], report: "" });

      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            let event: StreamEvent;
            try {
              event = JSON.parse(line.slice(5).trim()) as StreamEvent;
            } catch {
              continue;
            }
            switch (event.type) {
              case "phase":
                setPhaseSafe(event.phase);
                break;
              case "agent":
                upsertAgent(event.agent);
                break;
              case "log":
                pushLog(event.agentId, event.line);
                break;
              case "destination":
                resultsRef.current = [
                  ...resultsRef.current.filter(
                    (r) => r.destination !== event.result.destination,
                  ),
                  event.result,
                ];
                updateActive({ results: resultsRef.current });
                break;
              case "report":
                updateActive((p) => ({ report: p.report + event.markdown }));
                break;
              case "error":
                setError(event.message);
                updateActive({ status: "error" });
                break;
              case "done": {
                const final = phaseRef.current === "error" ? "error" : "done";
                setPhaseSafe(final);
                updateActive({ status: final });
                break;
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setPhaseSafe("error");
        updateActive({ status: "error" });
      }
    },
    [activeId, pushLog, updateActive, upsertAgent],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      {/* header */}
      <header className="animate-fade-up mb-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay<span className="text-accent-soft">Scout</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 sm:text-base">
            Multi-agent workation stay research — any destinations, anywhere on earth.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-accent-glow">
          glm-5.3-flash
        </div>
      </header>

      {/* trip bar */}
      <div className="animate-fade-up mb-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Trips
        </span>
        {plans.map((p) => (
          <span
            key={p.id}
            className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              p.id === activeId
                ? "border-accent bg-accent/20 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25"
            }`}
          >
            <button onClick={() => switchPlan(p)} className="max-w-[220px] truncate">
              {p.name}
              {p.status === "done" && <span className="ml-1 text-mint">✓</span>}
              {p.status === "running" && <span className="ml-1 text-accent-glow">●</span>}
            </button>
            <button
              onClick={() => deletePlan(p.id)}
              title="Delete trip"
              className="text-slate-500 opacity-0 transition hover:text-rosex group-hover:opacity-100"
            >
              ×
            </button>
          </span>
        ))}
        <button
          onClick={newTrip}
          disabled={running}
          className="chip !border-accent/50 text-accent-glow disabled:opacity-40"
        >
          ＋ New trip
        </button>
        <button onClick={loadDemoTrip} disabled={running} className="chip disabled:opacity-40">
          ▶ Demo trip
        </button>
      </div>

      {active && (
        <ConfigForm
          key={active.id}
          initial={active.config}
          initialName={active.name}
          onNameChange={(name) => updateActive({ name: name.trim() || active.name })}
          onRun={run}
          running={!!running}
        />
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-rosex/40 bg-rosex/10 p-4 text-sm text-rosex">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {agents.length > 0 && (
        <div className="mt-5">
          <AgentTimeline agents={agents} logs={logs} phase={phase} />
        </div>
      )}

      {active && active.results.length > 0 && (
        <div className="mt-5">
          <ResultsDashboard results={active.results} report={active.report} cfg={active.config} coords={active.name.startsWith("Demo") ? DEMO_COORDS : undefined} />
        </div>
      )}

      <footer className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
        StayScout · every AI claim ships with one-click ground-truth links — the human verifies, the agents grind.
      </footer>
    </main>
  );
}
