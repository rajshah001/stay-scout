import type { DestinationResult, TripConfig } from "./types";

/**
 * Demo trip — the real, human-verified South India research this product was
 * built from (live Airbnb prices captured 12–13 Nov 2026 for 20 Dec 2026 →
 * 17 Jan 2027, 4 adults, WiFi filter, monthly discount applied). Lets anyone
 * explore StayScout without an API key.
 */

export const DEMO_CONFIG: TripConfig = {
  destinations: [
    "Madikeri, Coorg",
    "Kolagappara, Wayanad",
    "Varkala",
    "Kodaikanal",
    "Coonoor",
    "Gokarna",
    "Munnar",
    "Kalasa, Chikkamagaluru",
  ],
  checkin: "2026-12-20",
  checkout: "2027-01-17",
  adults: 4,
  currency: "INR (₹)",
  seating: "entire-preferred",
  mustHaveWifi: true,
  mustHaveWorkspace: true,
  guestFavouriteOnly: false,
  budgetPerMonth: "flexible",
  extraNotes: "4 colleagues on video calls 9–6; prefer walkable evenings",
};

export const DEMO_COORDS: Record<string, { lat: number; lng: number }> = {
  "Madikeri, Coorg": { lat: 12.4242, lng: 75.7382 },
  "Kolagappara, Wayanad": { lat: 11.6969, lng: 76.2203 },
  Varkala: { lat: 8.7379, lng: 76.7163 },
  Kodaikanal: { lat: 10.2381, lng: 77.4892 },
  Coonoor: { lat: 11.3539, lng: 76.7957 },
  Gokarna: { lat: 14.555, lng: 74.332 },
  Munnar: { lat: 10.0889, lng: 77.0595 },
  "Kalasa, Chikkamagaluru": { lat: 13.1997, lng: 75.5045 },
};

const airbnb = (id: string) => `https://www.airbnb.com/rooms/${id}`;

export const DEMO_RESULTS: DestinationResult[] = [
  {
    destination: "Kolagappara, Wayanad",
    tagline: "Cheapest verified guest-favourite homes with real workspaces; village quiet, town 15 min",
    bestValue: "4 Season Homestay WFH villa — ₹35,500/mo published with WiFi + power backup (verify wifi first)",
    cheapestDecent: "Chembra 2BR entire home — ₹30,291 live on Airbnb (GF 4.86, dedicated workspace)",
    stays: [
      { name: "Two bedroom near Chembra peak", type: "entire", platform: "Airbnb", url: airbnb("1720207511196989172"), rating: 4.86, reviewCount: 7, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 1, sleeps: 4, priceBand28n: "₹30,291 ✅ ← ₹1,04,200 (–71%)", priceLow: 30291, priceHigh: 30291, wifiEvidence: "WiFi + long-stay amenities ✅", dedicatedWorkspace: true, powerBackup: "unverified — confirm with host", locationArea: "Chembra side", eveningAccess: "Meppadi/Kalpetta by scooter", heating: "n/a", flags: ["few reviews (7)"], sources: [{ name: "Airbnb", url: airbnb("1720207511196989172") }] },
      { name: "4 Season Homestay (WFH villa)", type: "entire", platform: "official site", url: "https://www.homestaysofindia.com/kerala-wayanad-4-season-homestay-wfh", rating: null, reviewCount: null, guestFavourite: null, superhost: false, bedrooms: 2, bathrooms: 1, sleeps: 6, priceBand28n: "₹35,500 published", priceLow: 35500, priceHigh: 35500, wifiEvidence: "WiFi + power backup + hot water included in tariff", dedicatedWorkspace: true, powerBackup: "inverter listed", locationArea: "4 km from Sulthan Bathery", eveningAccess: "easiest town runs of the belt", heating: "n/a", flags: ["single-source — get written confirmation + wifi video-call test"], sources: [{ name: "Homestays of India", url: "https://www.homestaysofindia.com/kerala-wayanad-4-season-homestay-wfh" }] },
      { name: "Scenic Homes Wayanad — Room 1 + sibling", type: "pair", platform: "Airbnb", url: airbnb("825022267966252122"), rating: 4.74, reviewCount: 38, guestFavourite: true, superhost: true, bedrooms: 2, bathrooms: 1, sleeps: 4, priceBand28n: "₹22,425 + ₹23,715 = ₹46,140 ✅", priceLow: 46140, priceHigh: 46140, wifiEvidence: "WiFi + dedicated workspace in both units", dedicatedWorkspace: true, powerBackup: "ask host", locationArea: "inside Kolagapaara village", eveningAccess: "village life itself", heating: "n/a", flags: ["shared 3BR/1BA house — confirm guest-only + bathrooms"], sources: [{ name: "Airbnb", url: airbnb("825022267966252122") }, { name: "Airbnb sibling", url: airbnb("961644009868561342") }] },
      { name: "The Fika casa Farm stay", type: "entire", platform: "Airbnb", url: airbnb("1292414967218907982"), rating: 4.88, reviewCount: 40, guestFavourite: true, superhost: false, bedrooms: 4, bathrooms: 3, sleeps: 8, priceBand28n: "₹87,487 ✅", priceLow: 87487, priceHigh: 87487, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Wayanad plantation belt", eveningAccess: "Sulthan Bathery ~15 min", heating: "n/a", flags: [], sources: [{ name: "Airbnb", url: airbnb("1292414967218907982") }] },
      { name: "Mayoor Vihar, Sulthan Bathery", type: "two-rooms", platform: "Airbnb", url: airbnb("931539562476373515"), rating: 4.83, reviewCount: 170, guestFavourite: true, superhost: false, bedrooms: 3, bathrooms: 3, sleeps: 6, priceBand28n: "₹30,393/room ≈ ₹60,786 ✅", priceLow: 60786, priceHigh: 60786, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Sulthan Bathery", eveningAccess: "in town", heating: "n/a", flags: ["💡 ask for whole-house buyout to one group"], sources: [{ name: "Airbnb", url: airbnb("931539562476373515") }] },
    ],
    connectivityNotes: ["Jio/Airtel strong on the NH-766 town belt, patchy in plantations — carry both SIMs", "Backup cafés: Walnut Cakes & CCD (Kalpetta), Wilton (Sulthan Bathery)", "Scooter monthly ₹4,000–5,500", "Dec–Jan: dry, 15–28°C, misty mornings", "Bandipur 9pm–6am ban is Karnataka-side only"],
    dropped: ["Tranquil Resort (₹2.5L+/mo)", "StayVista Novera (₹15–27k/night)", "anything in the 2024 Mundakkai–Chooralmala–Meppadi landslide zone"],
    verifyLinks: { airbnb: "https://www.airbnb.com/s/Kolagappara--India/homes?adults=4&checkin=2026-12-20&checkout=2027-01-17&amenities%5B%5D=4&price_filter_num_nights=28", booking: "https://www.booking.com/searchresults.html?ss=Wayanad&group_adults=4", googleMaps: "https://www.google.com/maps/search/homestay+Wayanad", reddit: "https://www.reddit.com/search/?q=Wayanad%20workation%20wifi", google: "https://www.google.com/search?q=Wayanad+monthly+stay+workation" },
  },
  {
    destination: "Madikeri, Coorg",
    tagline: "Best overall balance — central guest-favourite homes with workspaces, walkable evenings, best Dec–Jan weather",
    bestValue: "Summergreen Town House — ₹62,686/mo live, central Madikeri, workspace + rooftop to work",
    cheapestDecent: "Ritha's Homestay ₹47,988 (accept 1 bathroom + thin record)",
    stays: [
      { name: "Ritha's Homestay, Uluguli", type: "entire", platform: "Airbnb", url: airbnb("1407580801444913286"), rating: null, reviewCount: null, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 1, sleeps: 4, priceBand28n: "₹47,988 ✅", priceLow: 47988, priceHigh: 47988, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Uluguli, ~4 km", eveningAccess: "auto to town", heating: "n/a", flags: ["1 bathroom", "thin track record"], sources: [{ name: "Airbnb", url: airbnb("1407580801444913286") }] },
      { name: "Summergreen Coorg Town House", type: "entire", platform: "Airbnb", url: airbnb("617787776942409048"), rating: 4.89, reviewCount: 53, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 5, priceBand28n: "₹62,686 ✅ ← ₹1,29,382 (–52%)", priceLow: 62686, priceHigh: 62686, wifiEvidence: "WiFi ✅ + 'rooftop to work' in listing", dedicatedWorkspace: true, powerBackup: "host 11 yrs, 100% response — ask", locationArea: "central Madikeri", eveningAccess: "walk to market & Kodava restaurants", heating: "n/a", flags: [], sources: [{ name: "Airbnb", url: airbnb("617787776942409048") }] },
      { name: "TSM: Spacious 2BHK Stay", type: "entire", platform: "Airbnb", url: airbnb("1548632938420103679"), rating: 4.96, reviewCount: 28, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 6, priceBand28n: "₹70,641 ✅", priceLow: 70641, priceHigh: 70641, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Madikeri", eveningAccess: "town", heating: "n/a", flags: ["homemade food available"], sources: [{ name: "Airbnb", url: airbnb("1548632938420103679") }] },
      { name: "Keerthis Homestay", type: "entire", platform: "Airbnb", url: airbnb("1309258554931549892"), rating: 4.85, reviewCount: 88, guestFavourite: false, superhost: true, bedrooms: 3, bathrooms: 2, sleeps: 6, priceBand28n: "₹80,692 ✅", priceLow: 80692, priceHigh: 80692, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Madikeri", eveningAccess: "town", heating: "n/a", flags: [], sources: [{ name: "Airbnb", url: airbnb("1309258554931549892") }] },
      { name: "Green Cove Homestay", type: "entire", platform: "Airbnb", url: airbnb("850149693412605717"), rating: 4.95, reviewCount: 120, guestFavourite: true, superhost: false, bedrooms: 3, bathrooms: 3, sleeps: 6, priceBand28n: "₹95k–1.25L est.", priceLow: 95000, priceHigh: 125000, wifiEvidence: "17 Mbps dual-band claimed + workspace", dedicatedWorkspace: true, powerBackup: "unverified", locationArea: "<1 km Raja's Seat", eveningAccess: "walkable", heating: "n/a", flags: ["premium pick"], sources: [{ name: "Airbnb", url: airbnb("850149693412605717") }, { name: "Agoda 9.8", url: "https://www.agoda.com/green-cove-homestay/hotel/coorg-in.html" }] },
    ],
    connectivityNotes: ["r/coorg: 'Jio faster, Airtel more stable' — carry both", "Madikeri town = shortest power cuts (estates lose towers for days)", "Cafés: Velvet Coffee Co, Beans Talk, Mandala, Jack's, Bigcup (4.7★)", "Scooter monthly ₹8,000–12,000", "10–27°C, driest season"],
    dropped: ["Sam's Nest Virajpet (dropped out when WiFi filter applied — doesn't claim WiFi)", "SaffronStays/StayVista/Lohono (₹14–23k/night)"],
    verifyLinks: { airbnb: "https://www.airbnb.com/s/Madikeri--India/homes?adults=4&checkin=2026-12-20&checkout=2027-01-17&amenities%5B%5D=4&price_filter_num_nights=28", booking: "https://www.booking.com/searchresults.html?ss=Madikeri&group_adults=4", googleMaps: "https://www.google.com/maps/search/homestay+Madikeri", reddit: "https://www.reddit.com/search/?q=Coorg%20workation%20wifi", google: "https://www.google.com/search?q=Madikeri+monthly+stay+workation" },
  },
  {
    destination: "Kalasa, Chikkamagaluru",
    tagline: "Best quiet+village value — validated stock sits in the Sringeri/Mudigere belts 20–40 min out",
    bestValue: "SRINGeRI Kuppalli Kavimane — ₹60,998/mo live, Top Guest favourite 5.0 (36), sleeps 8",
    cheapestDecent: "SRINGeRI ₹60,998 — mandatory host wifi test (no Kalasa-area listing has review-level wifi proof)",
    stays: [
      { name: "SRINGeRI, Kuppalli Kavimane", type: "entire", platform: "Airbnb", url: airbnb("1654888481171448178"), rating: 5.0, reviewCount: 36, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 8, priceBand28n: "₹60,998 ✅ ← ₹78,658", priceLow: 60998, priceHigh: 60998, wifiEvidence: "WiFi ✅ (filter-verified) — hotspot-backed likely", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Koppa Rural (~35 min from Kalasa)", eveningAccess: "Sringeri belt", heating: "n/a", flags: ["🏆 best price-to-space in study"], sources: [{ name: "Airbnb", url: airbnb("1654888481171448178") }] },
      { name: "Nandini Homestay, Kigga", type: "entire", platform: "Airbnb", url: airbnb("1429440139333227080"), rating: 4.87, reviewCount: 31, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 3, sleeps: 5, priceBand28n: "₹65,096 ✅", priceLow: 65096, priceHigh: 65096, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Kigga, near Sringeri", eveningAccess: "Sringeri town", heating: "n/a", flags: [], sources: [{ name: "Airbnb", url: airbnb("1429440139333227080") }] },
      { name: "Hegde Residency 2BHK", type: "entire", platform: "Airbnb", url: airbnb("1440341921369099729"), rating: 4.68, reviewCount: 50, guestFavourite: false, superhost: true, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹70,327 ✅", priceLow: 70327, priceHigh: 70327, wifiEvidence: "town apartment — best wifi certainty", dedicatedWorkspace: null, powerBackup: "town supply", locationArea: "Chikmagalur town (1.5 h from Kalasa)", eveningAccess: "town cafés", heating: "n/a", flags: ["alternative base"], sources: [{ name: "Airbnb", url: airbnb("1440341921369099729") }] },
      { name: "Aaroha Living", type: "entire", platform: "Airbnb", url: airbnb("1701534436301130734"), rating: 4.86, reviewCount: 29, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 1, sleeps: 4, priceBand28n: "₹93,533 ✅", priceLow: 93533, priceHigh: 93533, wifiEvidence: "WiFi ✅ — branded 'Workation stay'", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Guddethota, Charmadi belt", eveningAccess: "estate roads", heating: "n/a", flags: [], sources: [{ name: "Airbnb", url: airbnb("1701534436301130734") }] },
      { name: "Milan Farm Stay, Bilagola", type: "entire", platform: "Airbnb", url: airbnb("804934854034152061"), rating: 4.97, reviewCount: 211, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 5, priceBand28n: "₹1,51,994 ✅ (peak; base ₹2,500/n — negotiate)", priceLow: 151994, priceHigh: 151994, wifiEvidence: "listing documents 41 Mbps + workspace", dedicatedWorkspace: true, powerBackup: "unverified", locationArea: "Bilagola, Chikmagalur–Mudigere rd", eveningAccess: "75–90 min to Kalasa", heating: "n/a", flags: ["host family upstairs", "veg-only"], sources: [{ name: "Airbnb", url: airbnb("804934854034152061") }, { name: "Justdial 4.9", url: "https://www.justdial.com/Chikmagalur/Milan-Farm-Stay-Mudigere/9999P8262-8262-170723181306-Z8C6_BZDET/bookings" }] },
    ],
    connectivityNotes: ["Assume all estate wifi is hotspot-backed — Jio + Airtel mandatory (Jio wider in ghats)", "Laptop cafés are in Chikmagalur town (1.5–2 h) — plan on hotspots", "Scooter ₹300–550/day; Gearz monthly ~₹6,999 (rentals in Chikmagalur/Mudigere)", "Dec–Jan = peak coffee harvest, estates lively", "12–25°C"],
    dropped: ["StayVista Cicada (no kitchen access)", "Kalasa-proper stock (1-room homestays, zero work evidence)"],
    verifyLinks: { airbnb: "https://www.airbnb.com/s/Kalasa--India/homes?adults=4&checkin=2026-12-20&checkout=2027-01-17&amenities%5B%5D=4&price_filter_num_nights=28", booking: "https://www.booking.com/searchresults.html?ss=Kalasa&group_adults=4", googleMaps: "https://www.google.com/maps/search/homestay+Kalasa", reddit: "https://www.reddit.com/search/?q=Chikkamagaluru%20workation%20wifi", google: "https://www.google.com/search?q=Kalasa+monthly+stay" },
  },
  {
    destination: "Munnar",
    tagline: "Best scenery; genuinely workable if you stay ≤10 km from town — cold nights + fog need backup checks",
    bestValue: "Cozy Clouds Serviced Apartments — est. ₹40–80k, entire 2BHK with workspace (get speedtest first)",
    cheapestDecent: "Eden Thottam ₹75,605 live (4.79/66)",
    stays: [
      { name: "Cozy Clouds Serviced Apartments", type: "entire", platform: "Airbnb", url: airbnb("1667335501516941524"), rating: 4.84, reviewCount: 25, guestFavourite: false, superhost: true, bedrooms: 2, bathrooms: 2, sleeps: 6, priceBand28n: "₹40–80k est.", priceLow: 40000, priceHigh: 80000, wifiEvidence: "unverified — confirm with host", dedicatedWorkspace: true, powerBackup: "unverified", locationArea: "Kunchithanny (~9 km)", eveningAccess: "drive to town", heating: "geyser — confirm", flags: ["est. band — confirm dates"], sources: [{ name: "Airbnb", url: airbnb("1667335501516941524") }, { name: "CozyCozy 9.8", url: "https://www.cozycozy.com/us/munnar-apartments" }] },
      { name: "Eden Thottam", type: "entire", platform: "Airbnb", url: airbnb("1007142197095547572"), rating: 4.79, reviewCount: 66, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 3, sleeps: 5, priceBand28n: "₹75,605 ✅ ← ₹1,30,038", priceLow: 75605, priceHigh: 75605, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Idukki — check distance", eveningAccess: "unverified", heating: "geyser — confirm", flags: [], sources: [{ name: "Airbnb", url: airbnb("1007142197095547572") }] },
      { name: "Sun Mount Riverview Cottages", type: "entire", platform: "Airbnb", url: airbnb("32949868"), rating: 4.99, reviewCount: 74, guestFavourite: true, superhost: false, bedrooms: 3, bathrooms: 3, sleeps: 6, priceBand28n: "₹84,860 ✅", priceLow: 84860, priceHigh: 84860, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Mankulam (~40 km)", eveningAccess: "⚠️ remote", heating: "n/a", flags: ["remote location"], sources: [{ name: "Airbnb", url: airbnb("32949868") }] },
      { name: "Adam's Villa (entire 1st floor)", type: "entire", platform: "Airbnb", url: airbnb("1745601801852803186"), rating: 5.0, reviewCount: 20, guestFavourite: true, superhost: false, bedrooms: 3, bathrooms: 2, sleeps: 6, priceBand28n: "₹1,24,653 ✅", priceLow: 124653, priceHigh: 124653, wifiEvidence: "WiFi + dedicated workspace ✅", dedicatedWorkspace: true, powerBackup: "unverified", locationArea: "Pump House ~3 km from town", eveningAccess: "best on list", heating: "geyser", flags: ["town access pick"], sources: [{ name: "Airbnb", url: airbnb("1745601801852803186") }] },
    ],
    connectivityNotes: ["Jio best in town; avoid Jio AirFiber for VPN", "KSEB cuts real — ask inverter + router backup", "Coworking: Monkey Tribe / Our Workstation (₹5–25k/mo)", "Scooter monthly ₹3,000–3,500 (Shalom 9495216798)", "Nights 7°C or lower + dense mist — test hot water day 1"],
    dropped: ["BHRS Residency (cockroach review)", "Munnar Suncity (7.8★)", "Windermere/StayVista (₹5.4–18k/night)"],
    verifyLinks: { airbnb: "https://www.airbnb.com/s/Munnar--India/homes?adults=4&checkin=2026-12-20&checkout=2027-01-17&amenities%5B%5D=4&price_filter_num_nights=28", booking: "https://www.booking.com/searchresults.html?ss=Munnar&group_adults=4", googleMaps: "https://www.google.com/maps/search/apartment+Munnar", reddit: "https://www.reddit.com/search/?q=Munnar%20workation%20wifi", google: "https://www.google.com/search?q=Munnar+monthly+stay" },
  },
  {
    destination: "Kodaikanal",
    tagline: "Cool-hill vibe, smarter as a room-pair — heating + 6–8 h power cuts push cost/risk up",
    bestValue: "compact Bedroom pair ≈₹64k — GF 4.83 with dedicated workspace (ask host for Bedrooms 1 & 2)",
    cheapestDecent: "Misty Mountains ₹73,157 live (4.46/126) — or Happy Moon ₹52,135 (no reviews yet)",
    stays: [
      { name: "Happy Moon Villa, Attuvampatti", type: "entire", platform: "Airbnb", url: airbnb("1743472347175264087"), rating: null, reviewCount: null, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 6, priceBand28n: "₹52,135 ✅", priceLow: 52135, priceHigh: 52135, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Attuvampatti", eveningAccess: "auto ~15 min", heating: "unverified", flags: ["no reviews yet — unproven"], sources: [{ name: "Airbnb", url: airbnb("1743472347175264087") }] },
      { name: "compact Bedroom 3 (+ siblings 1 & 2)", type: "pair", platform: "Airbnb", url: airbnb("1416435506981048060"), rating: 4.83, reviewCount: 41, guestFavourite: true, superhost: true, bedrooms: 1, bathrooms: 1, sleeps: 2, priceBand28n: "₹31,960/room ≈ ₹64k pair ✅", priceLow: 63920, priceHigh: 63920, wifiEvidence: "WiFi + dedicated workspace ✅", dedicatedWorkspace: true, powerBackup: "unverified", locationArea: "Kodaikanal house", eveningAccess: "ask host", heating: "unverified", flags: ["🏆 new best-value Kodai pick", "confirm siblings + bathroom sharing"], sources: [{ name: "Airbnb", url: airbnb("1416435506981048060") }] },
      { name: "Misty Mountains UR D16", type: "entire", platform: "Airbnb", url: airbnb("33068590"), rating: 4.46, reviewCount: 126, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 5, priceBand28n: "₹73,157 ✅ ← ₹1,02,976", priceLow: 73157, priceHigh: 73157, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Kodaikanal", eveningAccess: "near town", heating: "unverified", flags: ["weakest rating of live picks"], sources: [{ name: "Airbnb", url: airbnb("33068590") }] },
      { name: "Prems Cottage", type: "entire", platform: "Airbnb", url: airbnb("52660640"), rating: 4.84, reviewCount: 129, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 6, priceBand28n: "₹86,167 ✅", priceLow: 86167, priceHigh: 86167, wifiEvidence: "WiFi across entire area (speed unstated)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Naidupuram — walk to lake", eveningAccess: "best location-for-money", heating: "none listed — buy heaters", flags: ["pantry only, no full kitchen"], sources: [{ name: "Airbnb", url: airbnb("52660640") }, { name: "co-working-desk variant", url: airbnb("634645069316234404") }] },
      { name: "Zhagaram Cottage – House of Mist", type: "entire", platform: "Airbnb", url: airbnb("698496103449672529"), rating: 4.97, reviewCount: 190, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 3, sleeps: 6, priceBand28n: "₹1.35–1.9L est.", priceLow: 135000, priceHigh: 190000, wifiEvidence: "'WiFi 38 Mbps' + separate power backup for the modem", dedicatedWorkspace: true, powerBackup: "full-house backup", locationArea: "Vilpatti (~6 km)", eveningAccess: "auto 15 min", heating: "wood fireplace", flags: ["premium, work-engineered"], sources: [{ name: "Airbnb", url: airbnb("698496103449672529") }, { name: "MMT 4.5 (92)", url: "https://www.makemytrip.com/" }] },
    ],
    connectivityNotes: ["Jio most reliable in town; Airtel patchy outside centre", "TANGEDCO planned cuts 6–8 h → modem-backup stays win", "Cafés: Muncheez, Altaf, Pastry Corner, Kantina", "Scooter rentals reportedly banned — verify, else autos", "Nights 5–10°C, frost normal (0°C Dec 2025) — heaters non-negotiable"],
    dropped: ["StayVista (₹22.7k+/night)", "Luxunlock Skyfall (4.42★, bad road)", "Andhaadhi (1 bathroom)"],
    verifyLinks: { airbnb: "https://www.airbnb.com/s/Kodaikanal--India/homes?adults=4&checkin=2026-12-20&checkout=2027-01-17&amenities%5B%5D=4&price_filter_num_nights=28", booking: "https://www.booking.com/searchresults.html?ss=Kodaikanal&group_adults=4", googleMaps: "https://www.google.com/maps/search/cottage+Kodaikanal", reddit: "https://www.reddit.com/search/?q=Kodaikanal%20workation%20wifi", google: "https://www.google.com/search?q=Kodaikanal+monthly+stay" },
  },
  {
    destination: "Varkala",
    tagline: "Best beach + café social life — cliff is peak-priced; the verified wifi champ sits on the quiet side",
    bestValue: "Om Shanti Apartments — est. ₹1.0–1.4L, 'Fast WiFi 100+ Mbps' + 2 remote-work desks + inverter",
    cheapestDecent: "NelliTree, Edava — est. ₹75k+ (GF 4.98/90, wifi unreviewed)",
    stays: [
      { name: "NelliTree Experience, Edava", type: "entire", platform: "Airbnb", url: airbnb("969910277130540166"), rating: 4.98, reviewCount: 90, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 1, sleeps: 4, priceBand28n: "₹75k–1.15L est.", priceLow: 75000, priceHigh: 115000, wifiEvidence: "listing claims fast WiFi — no guest wifi review quotes", dedicatedWorkspace: true, powerBackup: "home inverter", locationArea: "Edava, ~2 km to quiet beach", eveningAccess: "10-min ride to North Cliff", heating: "n/a", flags: ["1 bathroom for 4", "wifi unreviewed"], sources: [{ name: "Airbnb", url: airbnb("969910277130540166") }, { name: "Booking.com", url: "https://www.booking.com/hotel/in/nelli-tree.en-gb.html" }] },
      { name: "Quiet 2BR Near Beach — Private Retreat", type: "entire", platform: "Airbnb", url: airbnb("1290328547247228361"), rating: 4.87, reviewCount: 30, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹80k–1.2L est.", priceLow: 80000, priceHigh: 120000, wifiEvidence: "'Fast WiFi 100+ Mbps' listing claim — single-source", dedicatedWorkspace: true, powerBackup: "per listing", locationArea: "residential lane, ~10 min walk to cliff", eveningAccess: "cliff cafés", heating: "n/a", flags: ["single-source"], sources: [{ name: "Airbnb", url: airbnb("1290328547247228361") }] },
      { name: "Om Shanti Apartments", type: "entire", platform: "Airbnb", url: airbnb("1375259364785987340"), rating: 4.9, reviewCount: 62, guestFavourite: true, superhost: true, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹1.0–1.4L est.", priceLow: 100000, priceHigh: 140000, wifiEvidence: "'Fast WiFi (100+ Mbps)' + guest quote: 'excellent Wi-Fi, two desks for remote work'", dedicatedWorkspace: true, powerBackup: "inverter in every apt", locationArea: "Thiruvambadi Rd, 7–10 min walk to North Cliff", eveningAccess: "cliff cafés & sunset", heating: "n/a", flags: ["🏆 best wifi evidence in Varkala — email host for monthly rate"], sources: [{ name: "Airbnb", url: airbnb("1375259364785987340") }, { name: "Booking.com", url: "https://www.booking.com/hotel/in/om-shanti-apartments.html" }, { name: "official site", url: "https://om-shanti-varkala.in" }] },
      { name: "Lime Haus 2BHK", type: "entire", platform: "Airbnb", url: airbnb("1720865665415586685"), rating: 4.69, reviewCount: 16, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹1,26,746 ✅", priceLow: 126746, priceHigh: 126746, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "250 m to beach", eveningAccess: "cliff", heating: "n/a", flags: [], sources: [{ name: "Airbnb", url: airbnb("1720865665415586685") }] },
      { name: "2BHK Private Pool Villa", type: "entire", platform: "Airbnb", url: airbnb("1739750957047262334"), rating: 5.0, reviewCount: 6, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 3, sleeps: 5, priceBand28n: "₹3,29,305 ✅ (peak-inflated)", priceLow: 329305, priceHigh: 329305, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Varkala", eveningAccess: "—", heating: "n/a", flags: ["poor value"], sources: [{ name: "Airbnb", url: airbnb("1739750957047262334") }] },
    ],
    connectivityNotes: ["North Cliff = cafés + parties till late; Thiruvambadi/Edava lanes quiet for morning calls", "Power cuts real — inverter stays only", "Cliff café wifi: Del Mar, Darjeeling Cafe, Sarwaa, InDa (backup only)", "Scooter monthly ₹8–12k", "23–32°C sunny; Dec 20–Jan 10 peak — early-Dec or post-Jan-10 runs ~20–30% cheaper"],
    dropped: ["seastheday (bottom-10% ratings)", "Saralalayam (1 review)", "Trivandrum/Kollam city 2BHKs (not walkable to beach)"],
    verifyLinks: { airbnb: "https://www.airbnb.com/s/Varkala--India/homes?adults=4&checkin=2026-12-20&checkout=2027-01-17&amenities%5B%5D=4&price_filter_num_nights=28", booking: "https://www.booking.com/searchresults.html?ss=Varkala&group_adults=4", googleMaps: "https://www.google.com/maps/search/apartment+Varkala", reddit: "https://www.reddit.com/search/?q=Varkala%20digital%20nomad", google: "https://www.google.com/search?q=Varkala+monthly+stay" },
  },
  {
    destination: "Gokarna",
    tagline: "Slow beach workation — mobile data is the real internet; viable only via the rooms-pass pair",
    bestValue: "Feel At Home ×2 rooms — ≈₹81,874 live (5.0/19 Superhost); confirm both rooms + workspace",
    cheapestDecent: "Feel At Home pair — beats every whole-home on wifi evidence-per-rupee",
    stays: [
      { name: "Feel At Home While Exploring Gokarna (rooms)", type: "pair", platform: "Airbnb", url: airbnb("1608854248741819250"), rating: 5.0, reviewCount: 19, guestFavourite: false, superhost: true, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹40,937/room ≈ ₹81,874 ✅", priceLow: 81874, priceHigh: 81874, wifiEvidence: "WiFi + Kitchen + AC ✅ (same house as ₹3.28L entire 3BR/4BA)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Gokarna town side", eveningAccess: "best infra side", heating: "n/a", flags: ["💡 confirm 2 rooms to one group + workspace"], sources: [{ name: "Airbnb", url: airbnb("1608854248741819250") }] },
      { name: "Vill Brahmi Stay", type: "entire", platform: "Booking.com", url: "https://www.booking.com/hotel/in/vill-brahmi-stay-gokarna.html", rating: 4.4, reviewCount: 19, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 5, priceBand28n: "₹62k–1.2L est.", priceLow: 62000, priceHigh: 120000, wifiEvidence: "no wifi evidence at all — plan on mobile data", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Gangavali Beach Rd", eveningAccess: "8-min walk to northern beach", heating: "n/a", flags: ["⚠️ split ratings: Booking 9.2 vs Airbnb 3.92"], sources: [{ name: "Booking.com", url: "https://www.booking.com/hotel/in/vill-brahmi-stay-gokarna.html" }, { name: "Agoda", url: "https://www.agoda.com/" }] },
      { name: "Aadwika Villa Home Stay", type: "entire", platform: "Airbnb", url: airbnb("1291012113036772414"), rating: 5.0, reviewCount: 76, guestFavourite: true, superhost: false, bedrooms: 3, bathrooms: 3, sleeps: 9, priceBand28n: "₹1.1–1.6L est.", priceLow: 110000, priceHigh: 160000, wifiEvidence: "Airbnb-measured 'Fast wifi – 63 Mbps' + workspace", dedicatedWorkspace: true, powerBackup: "unverified", locationArea: "Harumaskeri village, 10-min drive to town", eveningAccess: "scooter to beaches", heating: "n/a", flags: ["🏆 only speed-test-verified wifi in Gokarna"], sources: [{ name: "Airbnb", url: airbnb("1291012113036772414") }, { name: "MMT", url: "https://www.makemytrip.com/hotels/aadwika_villa-details-gokarna.html" }] },
      { name: "Gokarna stay – Family friendly place", type: "entire", platform: "Airbnb", url: airbnb("29121014"), rating: 4.66, reviewCount: 44, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹1,54,687 ✅", priceLow: 154687, priceHigh: 154687, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Uttara Kannada", eveningAccess: "—", heating: "n/a", flags: [], sources: [{ name: "Airbnb", url: airbnb("29121014") }] },
      { name: "Villa Casuarina 2", type: "entire", platform: "Airbnb", url: airbnb("773757668751047803"), rating: 4.81, reviewCount: 140, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹4,54,864 ✅", priceLow: 454864, priceHigh: 454864, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "near beach", eveningAccess: "beach", heating: "n/a", flags: ["beautiful, absurd price"], sources: [{ name: "Airbnb", url: airbnb("773757668751047803") }] },
    ],
    connectivityNotes: ["Mobile data (Airtel + Jio) is the real internet — town/ridge fine, Kudle/Om valleys patchy", "Power backup often lights-only — ask what it runs", "Café wifi (Mantra, 1987, Namaste) = backup only", "Scooter monthly ₹6–9k", "Dec–Jan weather perfect but peak-priced — Gokarna shines Feb–March"],
    dropped: ["beach huts (no desk/hot water)", "Belekan/Half-moon/Paradise (no infrastructure)", "Zostel (dorm)"],
    verifyLinks: { airbnb: "https://www.airbnb.com/s/Gokarna--India/homes?adults=4&checkin=2026-12-20&checkout=2027-01-17&amenities%5B%5D=4&price_filter_num_nights=28", booking: "https://www.booking.com/searchresults.html?ss=Gokarna&group_adults=4", googleMaps: "https://www.google.com/maps/search/villa+Gokarna", reddit: "https://www.reddit.com/search/?q=Gokarna%20digital%20nomad", google: "https://www.google.com/search?q=Gokarna+monthly+stay" },
  },
  {
    destination: "Coonoor",
    tagline: "Tea estates + peaceful routine — the most expensive of the set for a 4-person December month",
    bestValue: "Thamarai Villa Cottage — est. ₹1.1–1.45L, 4.76 (166), 2-min walk to Sim's Park",
    cheapestDecent: "Thamarai — everything cheaper failed the wifi or rating filters",
    stays: [
      { name: "Thamarai Villa Cottage", type: "entire", platform: "Airbnb", url: airbnb("21284677"), rating: 4.76, reviewCount: 166, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹1.1–1.45L est.", priceLow: 110000, priceHigh: 145000, wifiEvidence: "guest quote: 'the network is also good here'", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "2-min walk to Sim's Park/bus stand", eveningAccess: "best of the list — cafés, market, toy train on foot", heating: "unconfirmed — budget ₹1–2k oil heaters", flags: ["dining-table workspace"], sources: [{ name: "Airbnb", url: airbnb("21284677") }] },
      { name: "Jane's Cottage, AGR Holiday Homes", type: "entire", platform: "Airbnb", url: airbnb("639607988566995666"), rating: 4.3, reviewCount: 10, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹1,29,154 ✅", priceLow: 129154, priceHigh: 129154, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Coonoor", eveningAccess: "—", heating: "unverified", flags: ["weak rating"], sources: [{ name: "Airbnb", url: airbnb("639607988566995666") }] },
      { name: "Madhuvan 2BHK suite, Wellington", type: "entire", platform: "Airbnb", url: airbnb("34211667"), rating: 4.91, reviewCount: 179, guestFavourite: false, superhost: false, bedrooms: 2, bathrooms: 2, sleeps: 4, priceBand28n: "₹1,62,301 ✅ ← ₹2,09,280", priceLow: 162301, priceHigh: 162301, wifiEvidence: "WiFi ✅ (filter-verified)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "Wellington cantonment", eveningAccess: "Wellington cafés", heating: "unverified", flags: ["guest suite category"], sources: [{ name: "Airbnb", url: airbnb("34211667") }] },
      { name: "Villa Alpinia, Brooklands", type: "entire", platform: "Airbnb", url: airbnb("17738957"), rating: 4.92, reviewCount: 76, guestFavourite: true, superhost: false, bedrooms: 3, bathrooms: 3, sleeps: 6, priceBand28n: "₹1.8–2.8L est.", priceLow: 180000, priceHigh: 280000, wifiEvidence: "'the most perfect peaceful spot for a workation' — study area per room", dedicatedWorkspace: true, powerBackup: "inverter", locationArea: "5-min walk to Sim's Park", eveningAccess: "stroll to cafés & toy-train station", heating: "heaters in all bedrooms", flags: ["🏆 full workation spec"], sources: [{ name: "Airbnb", url: airbnb("17738957") }, { name: "Trip.com/StayVista", url: "https://www.trip.com/" }] },
      { name: "Erin Villa (150-yr heritage)", type: "entire", platform: "Airbnb", url: airbnb("17103256"), rating: 4.97, reviewCount: 39, guestFavourite: true, superhost: false, bedrooms: 2, bathrooms: 3, sleeps: 6, priceBand28n: "₹2.6–3.3L est. (₹15,500/night list)", priceLow: 260000, priceHigh: 330000, wifiEvidence: "'High-speed Broadband WiFi' (official site)", dedicatedWorkspace: null, powerBackup: "unverified", locationArea: "private 6-acre road, ~2 km to town", eveningAccess: "drive/walk 10–15 min", heating: "room heaters on request (chargeable)", flags: ["premium"], sources: [{ name: "Airbnb", url: airbnb("17103256") }, { name: "official", url: "https://erinvillacoonoor.com" }] },
    ],
    connectivityNotes: ["Airtel most reliable; Jio shows bars but stalls — test at the exact property", "TNPDCL scheduled cuts 5–8 h", "Cafés: Third Wave (Bedford), Anma Diner (remote-worker oriented)", "Skip scooters (cold + hairpins) — car ₹1,200–1,800/day", "18–21°C days, ~10°C nights"],
    dropped: ["Brooklyn Villa ('No wifi — this was an amenity promised')", "Sunvalley Homestay ('no wifi in the room despite being advertised')", "Quill Hill Villa (bottom-10% badge)"],
    verifyLinks: { airbnb: "https://www.airbnb.com/s/Coonoor--India/homes?adults=4&checkin=2026-12-20&checkout=2027-01-17&amenities%5B%5D=4&price_filter_num_nights=28", booking: "https://www.booking.com/searchresults.html?ss=Coonoor&group_adults=4", googleMaps: "https://www.google.com/maps/search/cottage+Coonoor", reddit: "https://www.reddit.com/search/?q=Nilgiris%20workation%20wifi", google: "https://www.google.com/search?q=Coonoor+monthly+stay" },
  },
];

/** Client-side report builder for the demo trip (normally the Composer agent writes this). */
export function buildDemoReport(): string {
  const sorted = [...DEMO_RESULTS].map((d) => {
    const lows = d.stays.map((s) => s.priceLow).filter((n): n is number => n != null);
    return { d, min: lows.length ? Math.min(...lows) : Infinity };
  }).sort((a, b) => a.min - b.min);

  const lines: string[] = [
    "# 🏔️ Workation Stay Shortlist — South India Hills & Beaches",
    "20 Dec 2026 → 17 Jan 2027 (28 nights) · 4 working adults · INR (₹) · **human-verified demo dataset**",
    "",
    "## 🎯 The Answer First",
    "",
    "| Rank | Destination | 🏆 Pick | 28-night cost (4 adults) | Link |",
    "|---|---|---|---|---|",
  ];
  sorted.forEach(({ d, min }, i) => {
    const best = d.stays.find((s) => s.priceLow === min) ?? d.stays[0];
    lines.push(
      `| ${i + 1} | **${d.destination.split(",")[0]}** | ${best.name} (${best.rating ?? "—"}★) | ${best.priceBand28n} | [Open](${best.url}) |`,
    );
  });
  lines.push("", "> **Recommendation:** run the month in **Wayanad (₹30–46k)** or **Coorg (₹63k)**; hop to Munnar/Kodai for a second scene. Skip Gokarna & Coonoor in December (peak pricing, weak wifi / 4× cost).", "");

  DEMO_RESULTS.forEach((d, i) => {
    lines.push(`# ${i + 1} · ${d.destination}`, "", `> ${d.tagline}`, "", `> 🏆 ${d.bestValue}`, "", "| # | Option | Type | Rating | 28-night cost | Notes |", "|---|---|---|---|---|---|");
    d.stays.forEach((s, j) => {
      const badge = s.guestFavourite ? " · GF" : "";
      lines.push(`| ${j + 1} | [${s.name}](${s.url}) | ${s.type} | ${s.rating ?? "—"}${s.reviewCount ? ` (${s.reviewCount})` : ""}${badge} | ${s.priceBand28n} | ${s.wifiEvidence}${s.flags.length ? " · ⚠️ " + s.flags.join("; ") : ""} |`);
    });
    lines.push("", "**On the ground:** " + d.connectivityNotes.map((n) => `• ${n}`).join("  "), "");
  });

  lines.push(
    "## 📋 Booking playbook",
    "",
    "1. Shift dates to Dec 1–29 or Jan 1–29 for ~15–30% off the peak surge.",
    "2. Message every host: *\"4 colleagues, 28 nights from 20 Dec, video calls 9–6 — speedtest screenshot, power-backup scope, heaters, best monthly rate?\"*",
    "3. Jio + Airtel SIMs, router-UPS, laptop power banks (~₹3–5k kit).",
    "4. Scooters monthly: Wayanad ₹4–5.5k · Munnar ₹3–3.5k · Gokarna ₹6–9k · Varkala ₹8–12k · skip in Coonoor/Kodai.",
    "5. Book by end of November — guest favourites go first in peak.",
    "",
    "*Demo dataset — prices captured live 12–13 Nov 2026; re-verify on the linked pages before booking.*",
  );
  return lines.join("\n");
}
