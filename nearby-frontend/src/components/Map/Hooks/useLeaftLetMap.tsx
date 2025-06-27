// src/components/Map/Hooks/useLeafletMap.ts
import * as L from "leaflet";
import React, { useEffect, useRef } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

export type OnPick = (lat: number, lon: number, radius?: number) => void;

export function useLeafletMap(
    containerRef: React.RefObject<HTMLDivElement>,
    onPick: OnPick,
    radius: number,
    icon: L.Icon
) {
    const [isCleared, setIsCleared] = React.useState(false);
    const mapRef = useRef<L.Map | null>(null);
    const circleRef = useRef<L.Circle | null>(null);
    const markersRef = useRef<L.LayerGroup | null>(null);
    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
    const radiusRef = useRef(radius);
    const lastRequestTime = useRef<number>(0);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Keep radius in sync
    useEffect(() => {
        radiusRef.current = radius;
    }, [radius]);

    // Improved throttling - more permissive
    function canProceedWithRequest(): boolean {
        const now = Date.now();
        const minInterval = 500; // Reduzido de 3000ms para 500ms

        if (now - lastRequestTime.current < minInterval) {
            return false;
        }

        lastRequestTime.current = now;
        return true;
    }

    // Debounced request handler
    function debouncedRequest(callback: () => void, delay: number = 300) {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            callback();
        }, delay);
    }

    // Shared draw + select logic
    function handleDraw(lat: number, lon: number, r: number) {
        drawCircle(lat, lon, r);
        onPick(lat, lon, r);
        panToOffset(lat, lon);
    }

    function drawCircle(lat: number, lon: number, r: number) {
        if (!mapRef.current) return;

        if (circleRef.current) {
            mapRef.current.removeLayer(circleRef.current);
        }

        circleRef.current = L.circle([lat, lon], {radius: r}).addTo(mapRef.current);
    }

    function panToOffset(lat: number, lon: number) {
        const map = mapRef.current;
        const container = containerRef.current;
        if (!map || !container) return;

        const offsetX = map.getSize().x / 4;
        const currentPoint = map.latLngToContainerPoint([lat, lon]);
        const adjustedPoint = currentPoint.add([offsetX, 0]);
        const adjustedLatLng = map.containerPointToLatLng(adjustedPoint);
        map.panTo(adjustedLatLng);
    }

    function clearMap() {
        markersRef.current?.clearLayers();
        drawnItemsRef.current?.clearLayers();

        if (circleRef.current && mapRef.current) {
            mapRef.current.removeLayer(circleRef.current);
            circleRef.current = null;
        }

        setIsCleared(true);
    }

    function addInteractiveMarker(lat: number, lng: number, r: number) {
        if (!mapRef.current || !markersRef.current) return;

        const marker = L.marker([lat, lng], {icon});
        marker.addTo(markersRef.current);
        marker.addTo(drawnItemsRef.current!);

        marker.on("click", () => {
            handleDraw(lat, lng, r);
        });

        return marker;
    }

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current).setView([38.7489, -9.1004], 13);
        mapRef.current = map;
        (containerRef.current as any)._leaflet_map = map; // Custom DOM access

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Marker and Draw layers
        markersRef.current = L.layerGroup().addTo(map);
        drawnItemsRef.current = new L.FeatureGroup();
        map.addLayer(drawnItemsRef.current);

        // Draw Controls
        const drawControl = new L.Control.Draw({
            edit: {featureGroup: drawnItemsRef.current},
            draw: {
                polygon: false,
                rectangle: false,
                circle: {},
                marker: {icon},
                circlemarker: false,
                polyline: false,
            },
        });
        map.addControl(drawControl);

        // GeoSearch Control
        const provider = new OpenStreetMapProvider();
        const searchControl = new (GeoSearchControl as unknown as new (opts: any) => L.Control)({
            provider,
            style: "bar",
            autoClose: true,
            showPopup: true,
            keepResult: true,
            retainZoomLevel: false,
            animateZoom: true,
            searchLabel: "Procurar morada...",
            showMarker: false, // we'll handle our own
        });

        map.addControl(searchControl);

        // Events - usando debounce em vez de throttling agressivo
        map.on("geosearch/showlocation", (result: any) => {
            const {x: lon, y: lat} = result.location;

            // Usar debounce para evitar múltiplos pedidos rápidos
            debouncedRequest(() => {
                if (canProceedWithRequest()) {
                    addInteractiveMarker(lat, lon, radiusRef.current);
                    handleDraw(lat, lon, radiusRef.current);
                } else {

                }
            });
        });

        map.on(L.Draw.Event.CREATED, (e: any) => {
            const layer = e.layer;

            debouncedRequest(() => {
                if (canProceedWithRequest()) {
                    drawnItemsRef.current?.addLayer(layer);

                    if (layer instanceof L.Marker) {
                        const {lat, lng} = layer.getLatLng();
                        drawnItemsRef.current?.removeLayer(layer);
                        addInteractiveMarker(lat, lng, radiusRef.current);
                        handleDraw(lat, lng, radiusRef.current);
                    } else if (layer instanceof L.Circle) {
                        const {lat, lng} = layer.getLatLng();
                        const r = layer.getRadius();
                        addInteractiveMarker(lat, lng, r);
                        handleDraw(lat, lng, r);
                    } else if (layer instanceof L.Polygon) {
                        const bounds = layer.getBounds();
                        const center = bounds.getCenter();
                        const diag = bounds.getNorthWest().distanceTo(bounds.getSouthEast());
                        const r = diag / 2;
                        addInteractiveMarker(center.lat, center.lng, r);
                        handleDraw(center.lat, center.lng, r);
                    }
                } else {

                }
            });
        });

        map.on(L.Draw.Event.DELETED, clearMap);

        (mapRef as any).currentClear = clearMap;

        return () => {
            // Limpar timeout ao desmontar
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            map.off(); // Clean up listeners
            map.remove();
            mapRef.current = null;
        };
    }, [containerRef]);

    const setViewAt = (lat: number, lon: number) => {
        if (mapRef.current) {
            panToOffset(lat, lon);
        }
    };

    return {
        mapRef,
        addMarkerAt: (lat: number, lon: number, r: number) => {
            debouncedRequest(() => {
                if (canProceedWithRequest() && mapRef.current && markersRef.current) {
                    const marker = L.marker([lat, lon], {icon}).addTo(markersRef.current);
                    marker.on("click", () => {
                        handleDraw(lat, lon, r);
                    });
                    handleDraw(lat, lon, r);
                } else {
                }
            });
        },
        setViewAt,
        isCleared,
        setIsCleared,
    };
}