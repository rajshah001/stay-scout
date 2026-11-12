import type { TripConfig, VerifyLinks } from "./types";

/**
 * Deep-link builders that recreate the exact verification searches used in a
 * manual workation research workflow: filtered Airbnb monthly search, Booking,
 * Google Maps reviews, Reddit and plain Google — so every agent claim is
 * one click away from ground truth.
 */

const encodeParam = (k: string, v: string) =>
  `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;

function nightsBetween(checkin: string, checkout: string): number {
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

function slugifyPlace(place: string): string {
  return place
    .trim()
    .split(/\s*,\s*|\s+/)
    .map((p) => p.replace(/[^\w-]/g, ""))
    .filter(Boolean)
    .join("--");
}

export function airbnbSearchUrl(place: string, cfg: TripConfig): string {
  const nights = nightsBetween(cfg.checkin, cfg.checkout);
  const params: string[] = [
    encodeParam("checkin", cfg.checkin),
    encodeParam("checkout", cfg.checkout),
    `adults=${cfg.adults}`,
    // amenity id 4 = Wifi on Airbnb's filter system
    encodeParam("amenities[]", "4"),
    "price_filter_input_type=1",
    `price_filter_num_nights=${Math.min(nights, 28) >= 28 ? 28 : nights}`,
    "search_mode=regular_search",
  ];
  if (cfg.seating === "entire-preferred") {
    params.push(encodeParam("room_types[]", "Entire home/apt"));
  }
  if (cfg.guestFavouriteOnly) {
    // Guest-favourite collection page
    return `https://www.airbnb.com/s/${slugifyPlace(place)}/homes/guest-favorites?${params.join("&")}`;
  }
  return `https://www.airbnb.com/s/${slugifyPlace(place)}/homes?${params.join("&")}`;
}

export function airbnbRoomUrl(roomUrl: string, cfg: TripConfig): string {
  try {
    const u = new URL(roomUrl);
    u.searchParams.set("check_in", cfg.checkin);
    u.searchParams.set("check_out", cfg.checkout);
    u.searchParams.set("adults", String(cfg.adults));
    return u.toString();
  } catch {
    return roomUrl;
  }
}

export function bookingSearchUrl(place: string, cfg: TripConfig): string {
  const params = new URLSearchParams({
    ss: place,
    checkin: cfg.checkin,
    checkout: cfg.checkout,
    group_adults: String(cfg.adults),
    no_rooms: cfg.seating === "entire-preferred" ? "1" : "2",
    group_children: "0",
  });
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

export function googleMapsUrl(place: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(
    `best rated homestay serviced apartment ${place}`,
  )}`;
}

export function redditUrl(place: string): string {
  return `https://www.reddit.com/search/?q=${encodeURIComponent(
    `${place} workation wifi remote work stay`,
  )}&sort=new`;
}

export function googleSearchUrl(place: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(
    `${place} monthly stay workation wifi review site:airbnb.com OR site:booking.com OR site:makemytrip.com`,
  )}`;
}

export function verifyLinksFor(place: string, cfg: TripConfig): VerifyLinks {
  return {
    airbnb: airbnbSearchUrl(place, cfg),
    booking: bookingSearchUrl(place, cfg),
    googleMaps: googleMapsUrl(place),
    reddit: redditUrl(place),
    google: googleSearchUrl(place),
  };
}
