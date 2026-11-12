"use client";

import { useCallback, useRef, useState } from "react";
import ConfigForm from "@/components/ConfigForm";
import AgentTimeline from "@/components/AgentTimeline";
import ResultsDashboard from "@/components/ResultsDashboard";
import type {
  AgentStatus,
  DestinationResult,
  StreamEvent,
  TripConfig,
} from "@/lib/types";

export default function Home() {
  const [phase, setPhase] = useState<string>("idle");
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<DestinationResult[]>([]);
  const [report, setReport] = useState("");
  const [cfg, setCfg] = useState<TripConfig | null>(null);
  const [error, setError] = useState("");
  const cfgRef = useRef<TripConfig | null>(null);

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

  const run = useCallback(async (config: TripConfig) => {
    cfgRef.current = config;
    setCfg(config);
    setAgents([]);
    setLogs({});
    setResults([]);
    setReport("");
    setError("");
    setPhase("connecting");

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
              setPhase(event.phase);
              break;
            case "agent":
              upsertAgent(event.agent);
              break;
            case "log":
              pushLog(event.agentId, event.line);
              break;
            case "destination":
              setResults((cur) => {
                const idx = cur.findIndex(
                  (r) => r.destination === event.result.destination,
                );
                if (idx === -1) return [...cur, event.result];
                const next = [...cur];
                next[idx] = event.result;
                return next;
              });
              break;
            case "report":
              setReport((cur) => (event.markdown.length > cur.length ? event.markdown : cur));
              break;
            case "error":
              setError(event.message);
              break;
            case "done":
              setPhase((p) => (p === "done" ? p : "done"));
              break;
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase("error");
    }
  }, [pushLog, upsertAgent]);

  const running = phase !== "idle" && phase !== "done" && phase !== "error";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      {/* header */}
      <header className="animate-fade-up mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay<span className="text-accent-soft">Scout</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 sm:text-base">
            Multi-agent workation stay research — scout → verify → cost-sort, for any destinations.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-accent-glow">
          glm-5.3-flash
        </div>
      </header>

      <ConfigForm onRun={run} running={running} />

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

      {results.length > 0 && (
        <div className="mt-5">
          <ResultsDashboard results={results} report={report} cfg={cfg} />
        </div>
      )}

      <footer className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
        StayScout · every AI claim ships with one-click ground-truth links — the human verifies, the agents grind.
      </footer>
    </main>
  );
}
