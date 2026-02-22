"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import React from "react";

import type { AirbearLocation } from "@/lib/supabase/realtime";
import type { Database } from "@/lib/types/database";

export type Spot = Database["public"]["Tables"]["spots"]["Row"];

interface MapViewProps {
  spots: Spot[];
  airbears: AirbearLocation[];
  onSpotSelect?: (spot: Spot) => void;
}

/**
 * Optimized MapView component using Leaflet.
 * Uses a marker reconciliation strategy (dirty checking) to avoid O(N) re-renders
 * of markers during real-time updates.
 */
export default function MapView({ spots, airbears, onSpotSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const LeafletRef = useRef<any>(null);
  const spotsRef = useRef(spots);
  const onSpotSelectRef = useRef(onSpotSelect);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Keep refs up to date for event handlers
  useEffect(() => {
    spotsRef.current = spots;
  }, [spots]);

  useEffect(() => {
    onSpotSelectRef.current = onSpotSelect;
  }, [onSpotSelect]);

  // Initialize Map
  useEffect(() => {
    // Guard against double initialization in Strict Mode or HMR
    if (mapInstanceRef.current || !mapRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        setMapError(null);

        // Wait for container to have dimensions
        const containerReady = await new Promise<boolean>((resolve) => {
          let attempts = 0;
          const check = () => {
            if (!isMounted) return resolve(false);
            if (!mapRef.current) return resolve(false);
            const { offsetHeight, offsetWidth } = mapRef.current;
            if (offsetHeight > 0 && offsetWidth > 0) return resolve(true);
            if (attempts > 50) return resolve(false);
            attempts++;
            requestAnimationFrame(check);
          };
          check();
        });

        if (!containerReady || !isMounted) return;

        // Dynamically import Leaflet
        const L = (await import("leaflet")).default;
        if (!L || !isMounted) return;
        LeafletRef.current = L;

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Create map centered on Binghamton, NY
        const binghamtonCenter: [number, number] = [42.0987, -75.9179];
        const map = L.map(mapRef.current!, {
          center: binghamtonCenter,
          zoom: 13,
          zoomControl: true,
          preferCanvas: true,
        });

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "&copy; OpenStreetMap &copy; CARTO",
            subdomains: "abcd",
            maxZoom: 19,
          },
        ).addTo(map);

        map.invalidateSize();
        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Setup global booking function for popup HTML
        if (typeof window !== "undefined") {
          (window as any).selectSpotForBooking = (spotId: string) => {
            const spot = spotsRef.current.find((s) => s.id === spotId);
            if (spot && onSpotSelectRef.current) {
              onSpotSelectRef.current(spot);
            }
          };
        }
      } catch (error) {
        console.error("❌ Error initializing map:", error);
        if (isMounted) {
          setMapError(
            error instanceof Error ? error.message : "Map failed to load",
          );
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Filter airbears - only show markers for roaming ones
  // Ones at spots are handled by spot badge
  const roamingAirbears = useMemo(
    () => airbears.filter((a) => !a.current_spot_id),
    [airbears],
  );

  // Sync Markers (Reconciliation)
  useEffect(() => {
    if (!mapInstanceRef.current || !LeafletRef.current || !mapLoaded) return;

    const map = mapInstanceRef.current;
    const L = LeafletRef.current;
    const activeIds = new Set<string>();

    // 1. Reconcile Spots
    spots.forEach((spot) => {
      const markerId = `spot-${spot.id}`;
      activeIds.add(markerId);

      const airbearsAtSpot = airbears.filter(
        (a) => a.current_spot_id === spot.id && a.is_available,
      );
      const availCount = airbearsAtSpot.length;
      const hasAvailable = availCount > 0;

      // Data hash for dirty checking to avoid expensive setIcon
      const dataHash = `${spot.latitude}-${spot.longitude}-${hasAvailable}-${availCount}`;

      let marker = markersRef.current.get(markerId);
      if (!marker) {
        const icon = L.divIcon({
          html: createSpotIconHtml(hasAvailable, availCount),
          className: "bg-transparent border-0",
          iconSize: [56, 56],
          iconAnchor: [28, 56],
          popupAnchor: [0, -56],
        });

        marker = L.marker([spot.latitude, spot.longitude], { icon }).addTo(map);
        marker.__dataHash = dataHash;
        marker.__availCount = availCount;

        const popupContent = createSpotPopupHtml(
          spot,
          availCount,
          hasAvailable,
        );
        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: "beautiful-popup",
        });

        marker.on("click", () => onSpotSelectRef.current?.(spot));
        markersRef.current.set(markerId, marker);
      } else {
        // Update in-place if needed
        if (marker.__dataHash !== dataHash) {
          marker.setIcon(
            L.divIcon({
              html: createSpotIconHtml(hasAvailable, availCount),
              className: "bg-transparent border-0",
              iconSize: [56, 56],
              iconAnchor: [28, 56],
              popupAnchor: [0, -56],
            }),
          );
          marker.__dataHash = dataHash;
        }

        if (marker.__availCount !== availCount) {
          marker.setPopupContent(
            createSpotPopupHtml(spot, availCount, hasAvailable),
          );
          marker.__availCount = availCount;
        }
      }
    });

    // 2. Reconcile Roaming Airbears
    roamingAirbears.forEach((airbear) => {
      const markerId = `airbear-${airbear.id}`;
      activeIds.add(markerId);

      const visualState = `${airbear.is_available}-${airbear.is_charging}-${airbear.battery_level}`;
      let marker = markersRef.current.get(markerId);

      if (!marker) {
        const icon = L.divIcon({
          html: createAirbearIconHtml(airbear),
          className: "bg-transparent border-0",
          iconSize: [48, 48],
          iconAnchor: [24, 24],
          popupAnchor: [0, -24],
        });

        marker = L.marker([airbear.latitude, airbear.longitude], {
          icon,
        }).addTo(map);
        marker.__visualState = visualState;
        marker.bindPopup(createAirbearPopupHtml(airbear), {
          maxWidth: 280,
          className: "beautiful-popup",
        });
        markersRef.current.set(markerId, marker);
      } else {
        // Update in-place
        marker.setLatLng([airbear.latitude, airbear.longitude]);
        if (marker.__visualState !== visualState) {
          marker.setIcon(
            L.divIcon({
              html: createAirbearIconHtml(airbear),
              className: "bg-transparent border-0",
              iconSize: [48, 48],
              iconAnchor: [24, 24],
              popupAnchor: [0, -24],
            }),
          );
          marker.setPopupContent(createAirbearPopupHtml(airbear));
          marker.__visualState = visualState;
        }
      }
    });

    // 3. Cleanup removed entities
    markersRef.current.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [spots, airbears, roamingAirbears, mapLoaded]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[60vh] min-h-[360px] max-h-[720px] rounded-xl overflow-hidden shadow-2xl border-4 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-lime-50"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950/50 to-lime-950/50 dark:from-emerald-950/50 dark:to-lime-950/50 rounded-xl z-10 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl overflow-hidden">
                <img
                  src="/airbear-mascot.png"
                  alt="AirBear Mascot"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <p className="text-lg font-semibold text-emerald-400 dark:text-emerald-300 animate-pulse">
              {mapError
                ? "Map failed to load."
                : "Loading beautiful Binghamton map..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions for HTML content to keep effect clean
function createSpotIconHtml(hasAvailable: boolean, availCount: number) {
  return `
    <div style="position: relative; cursor: pointer; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
      <div class="map-marker-pulse${hasAvailable ? "-glow" : ""}" style="
        width: 56px; height: 56px;
        background: ${hasAvailable ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #9ca3af, #6b7280)"};
        border: 5px solid white; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
      ">
        <img src="/airbear-mascot.png" style="width: 32px; height: 32px; border-radius: 50%;" alt="AirBear" />
      </div>
      ${
        hasAvailable
          ? `
        <div class="map-marker-pulse" style="
          position: absolute; top: -10px; right: -10px;
          background: #ef4444; color: white; border-radius: 50%;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: bold; border: 4px solid white;
        "><img src="/airbear-mascot.png" style="width: 16px; height: 16px;" alt="Count" /></div>
      `
          : ""
      }
    </div>
  `;
}

function createSpotPopupHtml(
  spot: Spot,
  availCount: number,
  hasAvailable: boolean,
) {
  return `
    <div style="min-width: 240px; padding: 12px; font-family: sans-serif;">
      <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #1f2937;">${spot.name}</h3>
      <p style="margin-bottom: 12px; color: #6b7280; font-size: 14px;">${spot.description || ""}</p>
      <div style="padding: 10px; background: ${hasAvailable ? "#ecfdf5" : "#f3f4f6"}; border-radius: 10px; border: 2px solid ${hasAvailable ? "#10b981" : "#9ca3af"};">
        <span style="font-weight: 700; color: ${hasAvailable ? "#047857" : "#4b5563"};">${availCount} AirBear${availCount !== 1 ? "s" : ""} available</span>
      </div>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <button onclick="window.selectSpotForBooking('${spot.id}')" style="width: 100%; padding: 10px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">📍 Book from Here</button>
      </div>
    </div>
  `;
}

function createAirbearIconHtml(airbear: AirbearLocation) {
  return `
    <div style="position: relative; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
      <div class="${airbear.is_available ? "map-marker-pulse-glow" : ""}" style="
        width: 48px; height: 48px;
        background: linear-gradient(135deg, ${airbear.is_available ? "#10b981" : "#6b7280"}, ${airbear.is_available ? "#059669" : "#4b5563"});
        border: 4px solid white; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
      ">
        <img src="/airbear-mascot.png" style="width: 28px; height: 28px; border-radius: 50%;" alt="AirBear" />
      </div>
      ${airbear.is_charging ? `<div class="map-marker-pulse" style="position: absolute; top: -8px; right: -8px; background: #fbbf24; border-radius: 50%; width: 22px; height: 22px; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 12px;">⚡</div>` : ""}
    </div>
  `;
}

function createAirbearPopupHtml(airbear: AirbearLocation) {
  const batteryColor =
    airbear.battery_level > 50
      ? "#10b981"
      : airbear.battery_level > 20
        ? "#f59e0b"
        : "#ef4444";
  return `
    <div style="min-width: 220px; padding: 12px; font-family: sans-serif;">
      <h4 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #1f2937;">AirBear #${airbear.id.slice(-4)}</h4>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #6b7280;">🔋 Battery:</span>
          <span style="font-weight: 700; color: ${batteryColor};">${airbear.battery_level}%</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #6b7280;">Status:</span>
          <span style="font-weight: 700; color: ${airbear.is_available ? "#10b981" : "#6b7280"};">${airbear.is_available ? "✓ Available" : "🚴 In Use"}</span>
        </div>
      </div>
    </div>
  `;
}

export const MapViewMemo = React.memo(MapView);
