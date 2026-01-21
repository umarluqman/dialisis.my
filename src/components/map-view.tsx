"use client";

import { Globe, Loader2, Mail, Phone } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Center {
  id: string;
  dialysisCenterName: string;
  latitude: number;
  addressWithUnit: string;
  phoneNumber: string;
  longitude: number;
  address: string;
  state: string;
  town: string;
  units: string;
  hepatitisBay: string;
  tel?: string;
  website?: string;
  email?: string;
  sector?: string;
  featured?: boolean;
}

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const MALAYSIA_BOUNDS = {
  sw: [99.6435, 0.8527], // Southwest coordinates
  ne: [119.2678, 7.3529], // Northeast coordinates
};

const DEFAULT_CENTER = [101.6869, 3.139]; // Malaysia center coordinates
const DEFAULT_ZOOM = 5;

// Move this outside the component
if (typeof window !== "undefined") {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
}

export default function MapView({ center }: { center?: [number, number] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const animationRef = useRef<number | null>(null);

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

  // Animation function for pulsing featured centers
  useEffect(() => {
    let size = 24;
    let opacity = 0.3;
    let time = 0;

    const animatePulse = () => {
      if (
        !map.current ||
        (!map.current.getLayer("featured-point-halo") &&
          !map.current.getLayer("featured-cluster-halo"))
      ) {
        return;
      }

      // Create a smoother pulse effect using sine wave
      time += 0.008; // Slower speed for smoother animation

      // Use easeInOutSine for smoother transitions
      const easeInOutSine = (1 - Math.cos(time)) / 2;

      // Larger size range for more noticeable pulse (20-32)
      size = 20 + 12 * easeInOutSine;

      // More pronounced opacity changes (0.15-0.4)
      opacity = 0.15 + 0.25 * easeInOutSine;

      // Update featured point halo if it exists
      if (map.current.getLayer("featured-point-halo")) {
        map.current.setPaintProperty(
          "featured-point-halo",
          "circle-radius",
          size
        );

        map.current.setPaintProperty(
          "featured-point-halo",
          "circle-opacity",
          opacity
        );
      }

      // Update featured cluster halo if it exists
      if (map.current.getLayer("featured-cluster-halo")) {
        // Calculate cluster halo sizes based on cluster size
        const clusterSizes = [
          35 + 12 * easeInOutSine, // Small clusters
          45 + 12 * easeInOutSine, // Medium clusters
          55 + 12 * easeInOutSine, // Large clusters
        ];

        map.current.setPaintProperty("featured-cluster-halo", "circle-radius", [
          "step",
          ["get", "point_count"],
          clusterSizes[0], // Base size + halo for small clusters
          50,
          clusterSizes[1], // Medium size + halo
          100,
          clusterSizes[2], // Large size + halo
        ]);

        map.current.setPaintProperty(
          "featured-cluster-halo",
          "circle-opacity",
          opacity
        );
      }

      animationRef.current = requestAnimationFrame(animatePulse);
    };

    if (
      map.current &&
      map.current.loaded() &&
      (map.current.getLayer("featured-point-halo") ||
        map.current.getLayer("featured-cluster-halo"))
    ) {
      animationRef.current = requestAnimationFrame(animatePulse);
    } else {
      // Wait for map to be fully loaded
      const checkMapLoaded = () => {
        if (
          map.current &&
          map.current.loaded() &&
          (map.current.getLayer("featured-point-halo") ||
            map.current.getLayer("featured-cluster-halo"))
        ) {
          animationRef.current = requestAnimationFrame(animatePulse);
        } else {
          setTimeout(checkMapLoaded, 100);
        }
      };

      checkMapLoaded();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center || (DEFAULT_CENTER as [number, number]),
      zoom: center ? 15 : DEFAULT_ZOOM,
      bounds: [MALAYSIA_BOUNDS.sw, MALAYSIA_BOUNDS.ne] as [
        mapboxgl.LngLatLike,
        mapboxgl.LngLatLike
      ],
      maxBounds: [
        [95.6435, -3.8527], // Southwest coordinates
        [123.2678, 10.3529], // Northeast coordinates
      ] as [[number, number], [number, number]],
    });

    // Add marker if center coordinates are provided
    if (center) {
      new mapboxgl.Marker().setLngLat(center).addTo(map.current);
    }

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
      showUserHeading: true,
    });

    map.current.addControl(geolocate);

    // Request location when map loads
    map.current.on("load", () => {
      if (!center) {
        geolocate.trigger(); // Only trigger if no center coordinates provided
      } else {
        setIsLocating(false);
      }
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
        const response = await fetch("/api/centers-map");
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
          clusterProperties: {
            // Add cluster property to track if any point in cluster is featured
            hasFeatured: ["any", ["get", "featured"]],
          },
        });

        // Add cluster layer with featured center detection
        map.current?.addLayer({
          id: "clusters",
          type: "circle",
          source: "centers",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "case",
              ["get", "hasFeatured"], // If cluster has featured centers
              "#f59e0b", // Use amber/yellow for featured clusters
              [
                // Otherwise use the original step-based coloring
                "step",
                ["get", "point_count"],
                "#012f54", // Dark blue for small clusters
                50,
                "#2bde80", // Green for medium clusters
                100,
                "#a3bdff", // Light blue for large clusters
              ],
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              25, // Base size for small clusters
              50,
              35, // Medium size
              100,
              45, // Large size
            ],
            "circle-opacity": 0.9,
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-opacity": 0.5,
          },
        });

        // Add pulsing halo layer for featured clusters
        map.current?.addLayer({
          id: "featured-cluster-halo",
          type: "circle",
          source: "centers",
          filter: ["all", ["has", "point_count"], ["get", "hasFeatured"]],
          paint: {
            "circle-color": "#fbbf24", // Amber color
            "circle-radius": [
              "step",
              ["get", "point_count"],
              35, // Base size + halo for small clusters
              50,
              45, // Medium size + halo
              100,
              55, // Large size + halo
            ],
            "circle-opacity": 0.15, // Start from lower opacity
            "circle-stroke-width": 2,
            "circle-stroke-color": "#f59e0b", // Slightly darker amber for stroke
            "circle-stroke-opacity": 0.3,
            "circle-blur": 0.8, // Increased blur for softer edges
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
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 14,
          },
          paint: {
            "text-color": "#ffffff", // White text for better contrast
          },
        });

        // Add unclustered point layer
        map.current?.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "centers",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": [
              "case",
              ["==", ["get", "featured"], true],
              "#f59e0b", // Amber color for featured centers
              "#012f54", // Default dark blue for other centers
            ],
            "circle-radius": [
              "case",
              ["==", ["get", "featured"], true],
              14, // Slightly smaller for better proportion with halo
              12, // Default size for other centers
            ],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-opacity": 0.5,
          },
        });

        // Add a special layer just for featured centers that adds a pulsing effect
        map.current?.addLayer({
          id: "featured-point-halo",
          type: "circle",
          source: "centers",
          filter: ["==", ["get", "featured"], true],
          paint: {
            "circle-color": "#fbbf24", // Amber color
            "circle-radius": 20, // Start from smaller size
            "circle-opacity": 0.15, // Start from lower opacity
            "circle-stroke-width": 2,
            "circle-stroke-color": "#f59e0b", // Slightly darker amber for stroke
            "circle-stroke-opacity": 0.3,
            "circle-blur": 0.8, // Increased blur for softer edges
          },
        });

        // Add hover effects for clusters and points
        map.current?.on(
          "mouseenter",
          ["clusters", "featured-cluster-halo", "unclustered-point"],
          () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "pointer";
            }
          }
        );

        map.current?.on(
          "mouseleave",
          ["clusters", "featured-cluster-halo", "unclustered-point"],
          () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "";
            }
          }
        );

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
              if (err || !features?.[0]?.geometry || !zoom) return;

              const coordinates = (features[0].geometry as any).coordinates;
              const currentZoom = map.current?.getZoom() || DEFAULT_ZOOM;

              // Increase zoom level more aggressively
              const newZoom = Math.min(Math.max(zoom + 2, currentZoom + 3), 18); // Changed from 16 to 18 and adjusted zoom increments

              map.current?.easeTo({
                center: coordinates,
                zoom: newZoom,
                duration: 1000,
                easing: (t) => t * (2 - t),
              });
            });
          }
        });
      } catch (error) {
        console.error("Error loading centers:", error);
      }
    };

    map.current.on("load", loadCenters);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Graceful cleanup to prevent AbortError
      if (map.current) {
        try {
          // Stop any ongoing animations or requests
          if (map.current.loaded()) {
            map.current.stop();
          }

          // Remove the map instance
          map.current.remove();
        } catch (error) {
          // Silently handle abort errors during cleanup
          if (error instanceof Error && error.name !== "AbortError") {
            console.warn("Error during map cleanup:", error);
          }
        } finally {
          map.current = null;
        }
      }
    };
  }, [center]);

  const unitsArray = selectedCenter?.units
    ? selectedCenter.units.split(",")
    : [];
  const title = selectedCenter?.dialysisCenterName?.split(",")[0];

  const hepatitisArray = selectedCenter?.hepatitisBay
    ? selectedCenter.hepatitisBay.split(", ")
    : [];
  const treatmentArray = unitsArray.map((unit) => ({
    name: unit,
    value: unit.toLowerCase().includes("hd unit")
      ? "Hemodialisis"
      : unit.toLowerCase().includes("tx unit")
      ? "Transplant"
      : unit.toLowerCase().includes("mrrb unit")
      ? "MRRB"
      : "Peritoneal Dialisis",
  }));

  return (
    <>
      <div className="relative h-[calc(100vh-4rem)] w-full">
        <div ref={mapContainer} className="h-full w-full" />
        {isOffline && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <p className="text-sm text-zinc-600">
                Peta memerlukan sambungan internet untuk berfungsi. Sila periksa
                sambungan anda.
              </p>
            </div>
          </div>
        )}
        {isLocating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-zinc-500">
                Mendapatkan lokasi anda...
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
          {/* <Drawer.Title>{selectedCenter?.dialysisCenterName}</Drawer.Title> */}
          <Drawer.Content className="fixed bottom-0 left-0 right-0 mb-24 flex h-[85vh] flex-col rounded-t-[10px] bg-white z-20">
            <div className="flex-1 rounded-t-[10px] bg-white p-4">
              <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
              {selectedCenter && (
                <div className="mx-auto max-w-md">
                  {selectedCenter.featured && (
                    <div className="flex items-center gap-1 ml-auto mb-2">
                      <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 shadow-none font-normal border border-amber-400">
                        Pusat Pilihan 👍
                      </Badge>
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">{title}</h2>
                  <div className="flex items-center gap-2">
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
                  </div>
                  <p className="mt-3 text-zinc-600">
                    {selectedCenter.addressWithUnit}
                  </p>
                  <p className="mt-2 text-zinc-600">
                    {selectedCenter.town ? selectedCenter.town + ", " : " "}
                    {JSON.parse(selectedCenter.state)
                      .name.split(" ")
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </p>
                  <div className="flex flex-col gap-2 mt-8">
                    <div className="text-sm text-zinc-500">Jenis Rawatan</div>
                    <div className="flex flex-wrap gap-2">
                      {treatmentArray.map((treatment) => (
                        <Badge
                          key={treatment.name}
                          className="bg-[#a3bdffff]/50 text-[#375092ff] hover:bg-[#a3bdffff]/50 mb-4 shadow-none font-normal"
                        >
                          {treatment.value}
                        </Badge>
                      ))}{" "}
                    </div>
                  </div>

                  <div className="flex flex-wrap mb-4">
                    {hepatitisArray.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {hepatitisArray.map((hep) => (
                          <Badge
                            key={hep}
                            className="bg-amber-200 text-amber-800 shadow-none hover:bg-amber-200 font-normal"
                          >
                            {hep}
                          </Badge>
                        ))}
                        {/* <PopiconsCircleInfoLine className="cursor-pointer w-4 h-4 text-zinc-500" /> */}
                      </div>
                    ) : null}
                  </div>

                  {selectedCenter?.website && (
                    <Link
                      href={
                        selectedCenter.website.split("?")[0] + "ref=dialysis-my"
                      }
                    >
                      <Button
                        variant={"ghost"}
                        className="text-primary-foreground mb-4"
                      >
                        <Globe className="w-4 h-4 text-primary-foreground" />
                        {selectedCenter.website.split("?")[0]}
                      </Button>
                    </Link>
                  )}

                  <div className="flex gap-4 justify-end">
                    <Link href={`tel:${selectedCenter.phoneNumber}`}>
                      <Button variant="outline" className="px-4">
                        <Phone className="w-4 h-4 text-primary-foreground" />
                        Panggil
                      </Button>
                    </Link>
                    {selectedCenter.featured ? (
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                        asChild
                        onClick={() =>
                          (window.location.href = `https://wa.me/+6${selectedCenter?.phoneNumber.replace(
                            /[\s-]/g,
                            ""
                          )}?text=Assalamualaikum%2FSalam%20sejahtera%2C%0A%0AUntuk%20tujuan%20pendaftaran%2Fperkhidmatan%20dialisis%2C%20mohon%20isikan%20maklumat%20berikut%3A%0A%0A%F0%9F%A7%A1%EF%B8%8F%20Nama%20Pesakit%3A%0A%0A%F0%9F%93%9E%20Nombor%20Telefon%3A%0A%0A%F0%9F%86%95%20Jenis%20Pesakit%3A%0A(Sila%20pilih%20satu%3A%20Pesakit%20Baru%20%2F%20Tumpang%20Sementara)%0A%0A%F0%9F%8F%A0%20Tempat%20Tinggal%20(Alamat%20Ringkas)%3A%0A%0AContoh%20jawapan%3A%0A%0AAhmad%20bin%20Ali%0A%0A012-3456789%0A%0ATumpang%20Sementara%0A%0ATaman%20Maju%2C%20Parit%20Raja%0A%0ATerima%20kasih%20atas%20kerjasama.`)
                        }
                      >
                        <div>
                          <Image
                            src="/whatsapp.svg"
                            alt="WhatsApp"
                            width={20}
                            height={20}
                          />
                          <span className="text-primary-foreground">
                            WhatsApp
                          </span>
                        </div>
                      </Button>
                    ) : null}

                    {selectedCenter.email && (
                      <Link href={`mailto:${selectedCenter.email}`}>
                        <Button variant={"outline"} className="px-4">
                          <Mail className="w-4 h-4 text-primary-foreground" />
                          Emel
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* <Button
                    variant={"secondary"}
                    className="w-full md:w-auto mt-12 flex items-center justify-center md:justify-self-end"
                  >
                    Info Lanjut
                    <PopiconsArrowRightLine className="w-4 h-4 ml-2" />
                  </Button> */}
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
