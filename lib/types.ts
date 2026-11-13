export type RoomConfig = "entire" | "pair" | "two-rooms" | "villa" | "unknown";

export interface StayCandidate {
  name: string;
  type: RoomConfig;
  platform: string;
  url: string;
  rating: number | null;
  reviewCount: number | null;
  guestFavourite: boolean | null;
  superhost: boolean | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sleeps: number | null;
  /** estimated 28-night price for the whole group, in trip currency, e.g. "₹30,291" or "₹40k–80k est." */
  priceBand28n: string;
  /** numeric low end of priceBand28n used for sorting, same currency */
  priceLow: number | null;
  priceHigh: number | null;
  wifiEvidence: string;
  dedicatedWorkspace: boolean | null;
  powerBackup: string;
  locationArea: string;
  eveningAccess: string;
  heating: string;
  flags: string[];
  sources: { name: string; url: string }[];
}

export interface DestinationResult {
  destination: string;
  tagline: string;
  stays: StayCandidate[];
  bestValue: string;
  cheapestDecent: string;
  connectivityNotes: string[];
  dropped: string[];
  verifyLinks: VerifyLinks;
  coords?: { lat: number; lng: number };
  error?: string;
}

export interface VerifyLinks {
  airbnb: string;
  booking: string;
  googleMaps: string;
  reddit: string;
  google: string;
}

export interface TripConfig {
  destinations: string[];
  checkin: string; // yyyy-mm-dd
  checkout: string; // yyyy-mm-dd
  adults: number;
  currency: string;
  seating: "entire-preferred" | "pair-ok" | "any";
  mustHaveWifi: boolean;
  mustHaveWorkspace: boolean;
  guestFavouriteOnly: boolean;
  budgetPerMonth: string;
  extraNotes: string;
}

export type AgentPhase = "pending" | "running" | "done" | "error";

export interface AgentStatus {
  id: string;
  name: string;
  role: string;
  destination?: string;
  phase: AgentPhase;
  detail?: string;
}

export type StreamEvent =
  | { type: "config"; config: TripConfig }
  | { type: "phase"; phase: string; detail?: string }
  | { type: "agent"; agent: AgentStatus }
  | { type: "log"; agentId: string; line: string }
  | { type: "destination"; result: DestinationResult }
  | { type: "report"; markdown: string }
  | { type: "error"; message: string; agentId?: string }
  | { type: "done" };
