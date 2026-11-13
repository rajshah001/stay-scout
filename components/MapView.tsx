"use client";

import { useMemo } from "react";
import "leaflet/dist/leaflet.css";

export interface MapPin {
  destination: string;
  lat: number;
  lng: number;
  label: string;
  fromPrice: string | null;
  href: string;
}

export default function MapView({ pins }: { pins: MapPin[] }) {
  // imported lazily by parent via next/dynamic (ssr: false)
  const { MapContainer, TileLayer, Marker, Popup } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const L = require("react-leaflet") as typeof import("react-leaflet");
    return L;
  }, []);

  const priceIcon = (label: string) => {
    const L = require("leaflet") as typeof import("leaflet");
    return L.divIcon({
      className: "",
      html: `<div style="transform:translate(-50%,-50%);white-space:nowrap;background:rgba(16,21,39,0.92);border:1px solid rgba(99,102,241,0.7);color:#a5b4fc;font:600 11px/1.4 var(--font-mono),monospace;padding:3px 8px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,0.5)">${label}</div>`,
      iconSize: [0, 0],
    });
  };

  const center = useMemo(() => {
    if (pins.length === 0) return [20, 0] as [number, number];
    const lat = pins.reduce((s, p) => s + p.lat, 0) / pins.length;
    const lng = pins.reduce((s, p) => s + p.lng, 0) / pins.length;
    return [lat, lng] as [number, number];
  }, [pins]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <MapContainer
        center={center}
        zoom={pins.length > 1 ? 5 : 8}
        scrollWheelZoom
        style={{ height: 460, width: "100%", background: "#0a0e1a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((p) => (
          <Marker key={p.destination} position={[p.lat, p.lng]} icon={priceIcon(p.fromPrice ?? p.label)}>
            <Popup>
              <div style={{ fontFamily: "inherit", minWidth: 180 }}>
                <strong>{p.destination}</strong>
                <div style={{ margin: "4px 0", color: "#555" }}>{p.label}</div>
                {p.fromPrice && (
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>from {p.fromPrice} / 28 nights</div>
                )}
                <a href={p.href} target="_blank" rel="noreferrer">
                  Verify stays for these dates ↗
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
