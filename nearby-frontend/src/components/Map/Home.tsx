import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "leaflet-geosearch/dist/geosearch.css";
import React, { useRef, useEffect, useContext, useState } from "react";
import { Navbarin } from "../NavBar";
import { DarkmodeContext } from "@/context/DarkMode/DarkmodeContext";
import { useLeafletMap } from "@/components/Map/Hooks/useLeaftLetMap";
import { usePlaceInfo } from "@/components/Map/Hooks/usePlaceInfo";
import { SidePanel } from "@/components/Map/SidePanel";
import { useHomeState } from "./Hooks/useHomeState";
const customIcon = L.icon({
    iconUrl: "/images/marker.ico",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

/**
 * Home component integrates a Leaflet map with various functionalities including markers, radius selection,
 * place information retrieval, and side panel display. It manages loading state, handles user interactions
 * with the map, and conditionally renders UI elements based on the current state.
 *
 * Key features:
 * - Custom Leaflet marker icon usage.
 * - Uses multiple custom hooks for managing map state, place info, and home page logic.
 * - Handles asynchronous data loading with timeout fallback to show no-data state.
 * - Reacts to map clicks to set markers and fetch corresponding location data.
 * - Displays detailed place information in a side panel when a marker is selected.
 * - Supports dark mode styling via context.
 *
 * Dependencies:
 * - Leaflet, Leaflet Draw, Leaflet GeoSearch for map functionalities.
 * - Custom hooks: useLeafletMap, usePlaceInfo, useHomeState.
 * - DarkmodeContext for theme management.
 * - Navbarin component for the navigation bar.
 */

export default function Home() {

    const { darkMode } = useContext(DarkmodeContext)!;
    const mapDiv = useRef<HTMLDivElement>(null);
    const [noData, setNoData] = useState(false);

    const {
        marker,
        radius,
        isLoading,
        refreshKey,
        previousStreet,
        amenities,
        setPreviousStreet,
        setMarkerAndRadius,
        updateRadius,
        resetState,
        setIsLoading
    } = useHomeState();

    const { addMarkerAt, setViewAt, isCleared, setIsCleared } = useLeafletMap(mapDiv, setMarkerAndRadius, radius, customIcon);

    const placeInfo = usePlaceInfo(marker?.lat, marker?.lon, radius, refreshKey, amenities) || {
        zone: [],
        places: [],
        parking: [],
        weather: null,
        infractions: [],
        traffic: "",
        houseValue: 0,
        crimes: [],
    };


    useEffect(() => {
        if (isCleared) {
            resetState()
        }
        setIsCleared(false)
    }, [isCleared]);

    useEffect(() => {
        if (!isLoading) return;
        setNoData(false); // Reset on new loading
        const timeoutId = setTimeout(() => {
            setNoData(true);
            setIsLoading(false);
        }, 12000); // 10 seconds

        return () => clearTimeout(timeoutId);
    }, [isLoading, marker]);

    useEffect(() => {
        if (!marker) return;
        const currentStreet = placeInfo.zone[0] || "";
        if (
            currentStreet &&
            currentStreet !== previousStreet &&
            placeInfo.zone.length &&
            placeInfo.places.length &&
            placeInfo.weather !== null &&
            placeInfo.traffic &&
            placeInfo.parking &&
            placeInfo.houseValue > 0
        ) {
            setIsLoading(false);
            setPreviousStreet(currentStreet);
            setNoData(false);
        }
    }, [placeInfo, marker, previousStreet]);

    useEffect(() => {
        if (marker) {
            addMarkerAt(marker.lat, marker.lon, radius);
            setViewAt(marker.lat, marker.lon);
        }
    }, [marker, radius]);
    return (
        <div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}>
            <Navbarin />
            <div className="flex h-[calc(100vh-70px)] p-4">
                <div ref={mapDiv} className="flex-1 rounded-lg shadow-lg z-0 relative" />
                {marker ? (
                    <div id="side-panel"
                         className="w-1/2 overflow-auto pl-4">
                        <SidePanel
                            info={placeInfo}
                            radius={radius}
                            onRadiusChange={updateRadius}
                            onClose={resetState}
                            isLoading={isLoading}
                            noData={noData}
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-lg text-gray-400 pointer-events-none">
                        Clique no mapa para selecionar uma localização.
                    </div>
                )}
            </div>
        </div>
    );
}
