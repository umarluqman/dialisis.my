"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const MALAYSIA_BOUNDS = {
  sw: [99.6435, 0.8527], // Southwest coordinates
  ne: [119.2678, 7.3529], // Northeast coordinates
};

interface Props {
  center: [number, number];
  name: string;
}

export default function SingleCenterMap({ center, name }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapboxgl.supported()) {
      setMapError(true);
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: 15,
        maxBounds: [
          [95.6435, -3.8527],
          [123.2678, 10.3529],
        ] as [[number, number], [number, number]],
      });
    } catch (error) {
      console.warn("Unable to initialize center map:", error);
      setMapError(true);
      return;
    }

    // Add marker with popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<strong>${name}</strong>`
    );

    new mapboxgl.Marker().setLngLat(center).setPopup(popup).addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [center, name]);

  if (isOffline || mapError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="rounded-lg bg-white p-4 shadow-lg">
          <p className="text-sm text-zinc-600">
            Peta tidak dapat dipaparkan buat masa ini.
          </p>
          <a
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            href={`https://www.google.com/maps?q=${center[1]},${center[0]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka di Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
    </div>
  );
}
