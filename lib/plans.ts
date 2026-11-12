import type { DestinationResult, TripConfig } from "./types";

export interface Plan {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  status: "draft" | "running" | "done" | "error";
  config: TripConfig | null;
  results: DestinationResult[];
  report: string;
}

const KEY = "stayscout.plans.v1";

export function loadPlans(): Plan[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const plans = JSON.parse(raw) as Plan[];
    return Array.isArray(plans) ? plans : [];
  } catch {
    return [];
  }
}

export function persistPlans(plans: Plan[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(plans));
  } catch {
    /* storage full/unavailable — plans stay in-memory */
  }
}

export function createPlan(name?: string): Plan {
  const now = Date.now();
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `plan-${now}`,
    name: name ?? `Trip ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
    createdAt: now,
    updatedAt: now,
    status: "draft",
    config: null,
    results: [],
    report: "",
  };
}

export interface RegionSet {
  label: string;
  places: string[];
}

/** Curated quick-start sets — purely shortcuts; any destination can be typed. */
export const REGION_SETS: RegionSet[] = [
  {
    label: "🇮🇳 South India",
    places: [
      "Madikeri, Coorg",
      "Kolagappara, Wayanad",
      "Varkala",
      "Kodaikanal",
      "Coonoor",
      "Gokarna",
      "Munnar",
      "Kalasa, Chikkamagaluru",
    ],
  },
  {
    label: "🌴 Kerala",
    places: ["Varkala", "Fort Kochi", "Munnar", "Wayanad", "Alleppey", "Marari Beach"],
  },
  {
    label: "🏔️ Himalayas",
    places: ["Rishikesh", "Dharamkot, McLeod Ganj", "Bir, Himachal", "Jibhi", "Mukteshwar", "Almora"],
  },
  {
    label: "🌏 Global nomad hubs",
    places: ["Lisbon", "Ericeira", "Madeira", "Chiang Mai", "Canggu, Bali", "Da Nang", "Medellín"],
  },
  {
    label: "🏝️ SEA beach months",
    places: ["Uluwatu, Bali", "Da Nang", "Koh Phangan", "Nusa Lembongan", "Siargao"],
  },
];
