import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Amenity } from "@/types/FilterTypes"; // ← ajuste o path conforme seu projeto
/**
 * Custom hook to manage the state and logic for the home page location marker and related settings.
 *
 * Responsibilities:
 * - Tracks the current marker (latitude and longitude) on the map.
 * - Manages search radius associated with each marker, persisting per location.
 * - Handles loading state for asynchronous operations.
 * - Stores and restores additional context such as amenities and parish name.
 * - Persists marker and radius data in localStorage for session persistence.
 * - Supports resetting state and syncing changes with localStorage.
 * - Reads initial state from React Router location state.
 *
 * Returns:
 * - marker: current map marker coordinates or null.
 * - radius: current search radius.
 * - isLoading: loading indicator.
 * - previousStreet: last searched street name.
 * - refreshKey: incremented to trigger data refresh.
 * - amenities: selected amenities filter.
 * - freguesiaName: selected parish name.
 * - setMarker, setPreviousStreet, setIsLoading: setters for respective states.
 * - setMarkerAndRadius: sets marker and radius together, triggering refresh.
 * - updateRadius: updates radius for the current marker, with persistence.
 * - resetState: clears all stored state and localStorage entries.
 */

type Marker = { lat: number; lon: number } | null;
type LocationState = {
    lat?: number;
    lon?: number;
    searchRadius?: number;
    timestamp?: number;
    amenities?: Amenity[];
    parish?: string;
} | null;

export function useHomeState() {
    const [marker, setMarker] = useState<Marker>(null);
    const [radius, setRadius] = useState(250);
    const [isLoading, setIsLoading] = useState(false);
    const [previousStreet, setPreviousStreet] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [markerRadii, setMarkerRadii] = useState<Map<string, number>>(new Map());
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [parishName, setParishName] = useState<string | null>(null);

    const location = useLocation();
    const state = location.state as LocationState;

    const getMarkerKey = (lat: number, lon: number) => `${lat.toFixed(6)}:${lon.toFixed(6)}`;

    const setMarkerAndRadius = (lat: number, lon: number, radius: number | undefined) => {

        setAmenities([]);
        setParishName(null);
        const key = getMarkerKey(lat, lon);
        setMarker(() => {
            const savedRadius =  radius ?? markerRadii.get(key) ?? 250;
            setRadius(Math.round(savedRadius));
            return { lat, lon };
        });
        setIsLoading(true);
        setRefreshKey((prev) => prev + 1);
    };

    const updateRadius = (newRadius: number) => {
        if (!marker) return;
        setRadius(Math.round(newRadius));
        const key = getMarkerKey(marker.lat, marker.lon);
        setMarkerRadii((prev) => {
            const updated = new Map(prev);
            updated.set(key, newRadius);
            return updated;
        });
    };

    const resetState = () => {
        setMarker(null);
        setIsLoading(false);
        setPreviousStreet(null);
        setRadius(250);
        setAmenities([]);
        setParishName(null);
        localStorage.removeItem("lastMarker");
        localStorage.removeItem("markerRadii");
        localStorage.removeItem("savedCoords")
    };

    useEffect(() => {
        if (state?.lat && state?.lon) {
            setMarkerAndRadius(state.lat, state.lon, state.searchRadius);
        }

        if (state?.amenities) {
            setAmenities(state.amenities);
        }
        if (state?.parish) {
            setParishName(state.parish);
        }
        const saved = localStorage.getItem("markerRadii");
        if (saved) {
            setMarkerRadii(new Map(JSON.parse(saved)));
        }
    }, [state]);

    useEffect(() => {
        if(marker)
            localStorage.setItem("markerRadii", JSON.stringify(Array.from(markerRadii.entries())));
    }, [markerRadii]);

    useEffect(() => {
        // Sync marker to localStorage
        if (marker) {
            localStorage.setItem("lastMarker", JSON.stringify(marker));
        } else {
            localStorage.removeItem("lastMarker");
        }
    }, [marker]);

    useEffect(() => {
        // Update markerRadii when marker or radius changes
        if (!marker) return;
        const key = getMarkerKey(marker.lat, marker.lon);
        setMarkerRadii((prev) => {
            const updated = new Map(prev);
            updated.set(key, radius);
            return updated;
        });
    }, [radius, marker]);

    return {
        marker,
        setMarker,
        radius,
        isLoading,
        previousStreet,
        refreshKey,
        amenities,
        freguesiaName: parishName,
        setPreviousStreet,
        setMarkerAndRadius,
        updateRadius,
        resetState,
        setIsLoading,
    };
}