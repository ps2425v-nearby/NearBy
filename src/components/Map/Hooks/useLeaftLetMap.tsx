// src/components/Map/Hooks/useLeafletMap.ts
import * as L from "leaflet";
import React, {useEffect, useRef} from "react";
import {GeoSearchControl, OpenStreetMapProvider} from "leaflet-geosearch";

export type OnPick = (lat: number, lon: number, radius?: number) => void;

export function useLeafletMap(
    containerRef: React.RefObject<HTMLDivElement>,
    onPick: OnPick,
    radius: number,
    icon: L.Icon,
) {
    const [isCleared, setIsCleared] = React.useState(false);
    const mapRef = useRef<L.Map | null>(null);
    const circleRef = useRef<L.Circle | null>(null);
    const markersRef = useRef<L.LayerGroup | null>(null);
    const radiusRef = useRef(radius);
    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
    const interactionTimestamps = useRef<number[]>([]);

    useEffect(() => {
        radiusRef.current = radius;
    }, [radius]);

    function canProceedWithRequest(): boolean {
        const now = Date.now();
        const windowSize = 3000; // 3 seconds
        const maxRequests = 3;

        interactionTimestamps.current = interactionTimestamps.current.filter(
            ts => now - ts < windowSize
        );

        if (interactionTimestamps.current.length >= maxRequests) {
            return false;
        }

        interactionTimestamps.current.push(now);
        return true;
    }

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current).setView([38.7489, -9.1004], 13);
        mapRef.current = map;
        (containerRef.current as any)._leaflet_map = map; // adiciona a referência do mapa no DOM


        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        markersRef.current = L.layerGroup().addTo(map);

        const drawnItems = new L.FeatureGroup();
        drawnItemsRef.current = drawnItems;
        map.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
            edit: { featureGroup: drawnItems },
            draw: {
                polygon: false,
                circle: {},
                marker: { icon },
                rectangle: false,
                circlemarker: false,
                polyline: false,
            },
        });
        map.addControl(drawControl);

        const provider = new OpenStreetMapProvider();
        const searchControl = new (GeoSearchControl as any)({
            provider,
            style: "bar",
            showMarker: true,
            showPopup: true,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            searchLabel: "Procurar morada...",
            marker: { icon },
        });

        map.addControl(searchControl);

        map.on("geosearch/showlocation", (result: any) => {
            if (!canProceedWithRequest()) {
                alert("Estás a fazer pedidos demasiado rapidamente. Por favor, espera um pouco.");
                return;
            }

            const { x: lon, y: lat } = result.location;
            drawCircle(lat, lon, radiusRef.current);
            onPick(lat, lon, radiusRef.current);
            panToOffset(lat, lon);
        });

        map.on(L.Draw.Event.DELETED, () => {
            clearMap();
        });

        map.on(L.Draw.Event.CREATED, (e: any) => {
            if (!canProceedWithRequest()) {
                alert("Estás a fazer pedidos demasiado rapidamente. Por favor, espera um pouco.");
                return;
            }

            const layer = e.layer;
            drawnItems.addLayer(layer);

            if (layer instanceof L.Marker) {
                const { lat, lng } = layer.getLatLng();
                drawnItems.removeLayer(layer);
                addInteractiveMarker(lat, lng, radiusRef.current);
                drawCircle(lat, lng, radiusRef.current);
                onPick(lat, lng, radiusRef.current);
                panToOffset(lat, lng);
            } else if (layer instanceof L.Circle) {
                const { lat, lng } = layer.getLatLng();
                const r = layer.getRadius();
                addInteractiveMarker(lat, lng, r);
                drawCircle(lat, lng, r);
                onPick(lat, lng, r);
                panToOffset(lat, lng);
            } else if (layer instanceof L.Polygon) {
                const bounds = layer.getBounds();
                const center = bounds.getCenter();
                const diag = bounds.getNorthWest().distanceTo(bounds.getSouthEast());
                addInteractiveMarker(center.lat, center.lng, diag / 2);
                drawCircle(center.lat, center.lng, diag / 2);
                onPick(center.lat, center.lng, diag / 2);
                panToOffset(center.lat, center.lng);
            }
        });

        map.on(L.Draw.Event.DRAWSTART, () => {});
        map.on(L.Draw.Event.DRAWSTOP, () => {});

        function addInteractiveMarker(lat: number, lng: number, r: number) {
            if (!mapRef.current || !markersRef.current) return;

            const marker = L.marker([lat, lng], { icon });

            marker.addTo(markersRef.current);
            marker.addTo(drawnItemsRef.current!);

            marker.on("click", function () {
                drawCircle(lat, lng, r);
                onPick(lat, lng, r);
                panToOffset(lat, lng);
            });

            return marker;
        }

        function clearMap() {
            if (markersRef.current) markersRef.current.clearLayers();
            if (circleRef.current && mapRef.current) {
                mapRef.current.removeLayer(circleRef.current);
                circleRef.current = null;
            }
            if (drawnItemsRef.current) {
                drawnItemsRef.current.clearLayers();
            }
            setIsCleared(true);
        }

        (mapRef as any).currentClear = clearMap;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [containerRef]);

    const setViewAt = (lat: number, lon: number) => {
        if (mapRef.current) {
            panToOffset(lat, lon);
        }
    };

    function panToOffset(lat: number, lon: number) {
        const map = mapRef.current;
        const container = containerRef.current;
        if (!map || !container) return;

        const mapSize = map.getSize();
        const offsetX = mapSize.x / 4;

        const currentPoint = map.latLngToContainerPoint([lat, lon]);
        const adjustedPoint = currentPoint.add([offsetX, 0]);
        const adjustedLatLng = map.containerPointToLatLng(adjustedPoint);
        map.panTo(adjustedLatLng);
    }

    function drawCircle(lat: number, lon: number, r: number) {
        if (!mapRef.current) return;
        if (circleRef.current) mapRef.current.removeLayer(circleRef.current);
        circleRef.current = L.circle([lat, lon], { radius: r }).addTo(mapRef.current);
    }

    return {
        mapRef,
        addMarkerAt: (lat: number, lon: number, r: number) => {
            if (!canProceedWithRequest()) {
                alert("Estás a fazer pedidos demasiado rapidamente. Por favor, espera um pouco.");
                return;
            }

            if (!mapRef.current || !markersRef.current) return;

            const marker = L.marker([lat, lon], { icon }).addTo(markersRef.current);
            marker.on("click", () => {
                drawCircle(lat, lon, r);
                onPick(lat, lon, r);
                panToOffset(lat, lon);
            });
            drawCircle(lat, lon, r);
            panToOffset(lat, lon);
        },
        setViewAt,
        isCleared,
        setIsCleared
    };
}
