"use client";

import {
  PopiconsGlobeDuotone,
  PopiconsMailDuotone,
  PopiconsPhoneSolid,
} from "@popicons/react";
import { Loader2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Center {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  state: string;
  city: string;
  units: string;
  hepatitisBay: string;
  tel?: string;
  website?: string;
  email?: string;
  sector?: string;
}

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const MALAYSIA_BOUNDS = {
  sw: [99.6435, 0.8527], // Southwest coordinates
  ne: [119.2678, 7.3529], // Northeast coordinates
};

const DEFAULT_CENTER = [101.6869, 3.139]; // Malaysia center coordinates
const DEFAULT_ZOOM = 5;

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER as [number, number],
      zoom: DEFAULT_ZOOM,
      bounds: [MALAYSIA_BOUNDS.sw, MALAYSIA_BOUNDS.ne] as [
        mapboxgl.LngLatLike,
        mapboxgl.LngLatLike
      ],
      maxBounds: [
        [95.6435, -3.8527], // Southwest coordinates
        [123.2678, 10.3529], // Northeast coordinates
      ] as [[number, number], [number, number]],
    });

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.current.addControl(geolocate);

    // Request location when map loads
    map.current.on("load", () => {
      geolocate.trigger(); // Automatically trigger location request
    });

    // Handle location events
    geolocate.on("geolocate", (position) => {
      setIsLocating(false);
      const { latitude, longitude } = position.coords;

      // Check if coordinates are within Malaysia bounds
      if (
        longitude >= MALAYSIA_BOUNDS.sw[0] &&
        longitude <= MALAYSIA_BOUNDS.ne[0] &&
        latitude >= MALAYSIA_BOUNDS.sw[1] &&
        latitude <= MALAYSIA_BOUNDS.ne[1]
      ) {
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 12,
          duration: 2000,
        });
      }
    });

    geolocate.on("error", () => {
      setIsLocating(false);
      // If location access is denied or fails, stay at default view
      console.log("Unable to access location. Showing default view.");
    });

    // Load centers data
    const loadCenters = async () => {
      try {
        const response = await fetch("/api/centers");
        const centers: Center[] = await response.json();

        // Add a source with cluster configuration
        map.current?.addSource("centers", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: centers.map((center) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [center.longitude, center.latitude],
              },
              properties: center,
            })),
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // Add cluster layer
        map.current?.addLayer({
          id: "clusters",
          type: "circle",
          source: "centers",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#003f5c", // color for points <= 50
              50, // threshold
              "#bc5090", // color for points <= 100
              100, // threshold
              "#ffa600", // color for points > 100
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20, // radius for points <= 10
              10, // threshold
              30, // radius for points > 10
              50, // threshold
              40, // radius for points > 50
            ],
          },
        });

        // Add cluster count layer
        map.current?.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "centers",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-size": 12,
          },
          paint: {
            "text-color": "#ffffff",
          },
        });

        // Add unclustered point layer
        map.current?.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "centers",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#012f54",
            "circle-radius": 8,
          },
        });

        // Handle click events on individual points
        map.current?.on("click", "unclustered-point", (e) => {
          if (e.features?.[0]?.properties) {
            setSelectedCenter(e.features[0].properties as Center);
          }
        });

        // Handle click events on clusters
        map.current?.on("click", "clusters", (e) => {
          const features = map.current?.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          const clusterId = features?.[0]?.properties?.cluster_id;

          if (clusterId) {
            const source = map.current?.getSource(
              "centers"
            ) as mapboxgl.GeoJSONSource;
            source.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err || !features?.[0]?.geometry) return;

              const coordinates = (features[0].geometry as any).coordinates;
              map.current?.easeTo({
                center: coordinates,
                zoom: zoom || DEFAULT_ZOOM,
                duration: 500,
              });
            });
          }
        });

        // Change cursor on hover
        map.current?.on("mouseenter", "clusters", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        map.current?.on("mouseleave", "clusters", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });
      } catch (error) {
        console.error("Error loading centers:", error);
      }
    };

    map.current.on("load", loadCenters);

    return () => {
      map.current?.remove();
    };
  }, []);

  const unitsArray = selectedCenter?.units
    ? selectedCenter.units.split(",")
    : [];
  const title = selectedCenter?.name.split(",")[0];
  const hepatitisArray = selectedCenter?.hepatitisBay
    ? selectedCenter.hepatitisBay.split(", ")
    : [];
  const treatmentArray = unitsArray.map((unit) => ({
    name: unit,
    value: unit.toLowerCase().includes("hd unit")
      ? "Hemodialysis"
      : unit.toLowerCase().includes("tx unit")
      ? "Transplant"
      : unit.toLowerCase().includes("mrrb unit")
      ? "MRRB"
      : "Peritoneal Dialysis",
  }));
  console.log({ hepatitisArray });

  return (
    <>
      <div className="relative h-[calc(100vh-4rem)] w-full">
        <div ref={mapContainer} className="h-full w-full" />
        {isLocating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-zinc-500">
                Getting your location...
              </span>
            </div>
          </div>
        )}
      </div>

      <Drawer.Root
        open={!!selectedCenter}
        onOpenChange={() => setSelectedCenter(null)}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-10" />
          {/* <Drawer.Title>{selectedCenter?.name}</Drawer.Title> */}
          <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[75vh] flex-col rounded-t-[10px] bg-white z-20">
            <div className="flex-1 rounded-t-[10px] bg-white p-4">
              <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
              {selectedCenter && (
                <div className="mx-auto max-w-md">
                  <h2 className="text-xl font-semibold">
                    {selectedCenter.name}
                  </h2>
                  <p className="text-primary-foreground mb-4">
                    {selectedCenter?.sector === "MOH" ||
                    selectedCenter?.sector === "NGO" ? (
                      selectedCenter?.sector
                    ) : (
                      <span className="capitalize">
                        {selectedCenter?.sector?.toLowerCase() ?? ""}
                      </span>
                    )}
                  </p>
                  <p className="mt-3 text-zinc-600">{selectedCenter.address}</p>
                  <p className="mt-2 text-zinc-600">
                    {selectedCenter.city}, {selectedCenter.state}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-8">
                    {treatmentArray.map((treatment) => (
                      <Badge
                        key={treatment.name}
                        className="bg-[#a3bdffff]/50 text-[#375092ff] hover:bg-[#a3bdffff]/50 mb-4 shadow-none"
                      >
                        {treatment.value}
                      </Badge>
                    ))}{" "}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hepatitisArray.map((hep) => (
                      <Badge
                        key={hep}
                        className="bg-[#fff3d7ff] text-amber-600 mb-4 shadow-none hover:bg-[#fff3d7ff]"
                      >
                        {hep}
                      </Badge>
                    ))}{" "}
                  </div>

                  {selectedCenter?.website && (
                    <Link
                      href={
                        selectedCenter?.website?.split("?")[0] +
                          "ref=dialysis-my" ?? ""
                      }
                    >
                      <Button
                        size={"sm"}
                        variant={"link"}
                        className="px-0 text-primary-foreground mb-4"
                      >
                        <PopiconsGlobeDuotone className="w-4 h-4 text-primary-foreground" />
                        {selectedCenter?.website?.split("?")[0]}
                      </Button>
                    </Link>
                  )}

                  <div className="flex gap-4 justify-end">
                    <Link
                      href={
                        selectedCenter?.website?.split("?")[0] +
                          "ref=dialysis-my" ?? ""
                      }
                    >
                      <Button
                        size={"sm"}
                        variant={"secondary"}
                        className="text-primary-foreground"
                      >
                        <PopiconsPhoneSolid className="w-4 h-4 text-primary-foreground" />
                        Panggil
                      </Button>
                    </Link>

                    <Link
                      href={
                        selectedCenter?.website?.split("?")[0] +
                          "ref=dialysis-my" ?? ""
                      }
                    >
                      <Button
                        size={"sm"}
                        variant={"secondary"}
                        className="text-primary-foreground"
                      >
                        <PopiconsMailDuotone className="w-4 h-4 text-primary-foreground" />
                        {/* {selectedCenter?.email} */}
                        Emel
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
