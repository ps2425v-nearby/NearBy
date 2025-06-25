import {useEffect, useRef, useState} from "react";
import {fetchPlace} from "@/Fetch/Location/FetchPlace";
import {fetchZoneIdentier} from "@/Fetch/Location/fetchZoneIdentifier";
import {fetchHousingPrices} from "@/Fetch/Housing/fetchHousingPrices";
import {Amenity} from "@/types/FilterTypes";
import {CrimeType} from "@/types/CrimeType";
import {PlaceType} from "@/types/PlaceType";
import {ParkingSpaceType} from "@/types/parkingSpaceType";


export interface PlaceInfoState {
    places: any[];
    weather: any;
    traffic: string;
    zone: string[];
    parking: ParkingSpaceType[];
    houseValue: number;
    crimes?: CrimeType[];
}

/**
 * Custom hook to fetch and manage detailed information about a place given latitude, longitude, radius, and optional filters.
 *
 * Responsibilities:
 * - Fetch place data and zone identifier concurrently.
 * - Filter places based on optional amenity filters.
 * - Fetch housing prices for identified zones.
 * - Manage combined state containing places, weather, traffic, crimes, parking, housing prices, and zone info.
 * - Avoid redundant fetches if lat, lon, and radius have not changed.
 *
 * @param lat Latitude coordinate of the location (optional).
 * @param lon Longitude coordinate of the location (optional).
 * @param radius Radius (default 250) around the location to fetch data.
 * @param refreshKey Number to trigger manual refreshes of the data.
 * @param filters Optional array of Amenity filters to filter the places returned.
 *
 * @returns An object with the current place information state or null if not loaded yet:
 * - places: filtered array of PlaceType objects.
 * - weather: weather data from the place fetch.
 * - traffic: traffic level as string.
 * - zone: array of zone identifiers.
 * - parking: array of ParkingSpaceType.
 * - houseValue: numeric housing price value.
 * - crimes: optional array of CrimeType.
 */


export function usePlaceInfo(lat?: number, lon?: number, radius = 250, refreshKey: number = 0, filters?: Amenity[]) {
    const [state, setState] = useState<PlaceInfoState | null>(null);
    const lastLat = useRef<number | null>(null);
    const lastLon = useRef<number | null>(null);
    const lastRadius = useRef<number | null>(null);

    useEffect(() => {
        if (lat == null || lon == null) return;

        const isSame =
            lastLat.current === lat &&
            lastLon.current === lon &&
            lastRadius.current === radius;

        if (isSame && state) return;

        lastLat.current = lat;
        lastLon.current = lon;
        lastRadius.current = radius;

        (async () => {
            try {
                const [allData, zone] = await Promise.all([
                    fetchPlace(lat, lon, radius),
                    fetchZoneIdentier(lat, lon),
                ]);

                let filteredPlaces: PlaceType[] = [];
                if (allData != null) {
                    filteredPlaces = allData.places.filter((place: PlaceType) => {
                        if (!filters || filters.length === 0) return true;
                        const tags = place.tags instanceof Map ? Object.fromEntries(place.tags) : place.tags;
                        const tagValues = Object.values(tags);
                        return filters.some((filter) =>
                            tagValues.includes(filter.tags.name ?? "")
                        );
                    });
                }


                const houseValue = zone.length ? Number(await fetchHousingPrices(zone)) : 0;
                setState({
                    places: filteredPlaces,
                    weather: allData?.wind,
                    traffic: String(allData?.trafficLevel ?? ""),
                    crimes: allData?.crimes,
                    zone,
                    parking: allData?.parkingSpaces ?? [],
                    houseValue,
                });
            } catch (error) {
                console.error("Erro ao carregar dados da localização:", error);
            }
        })();
    }, [lat, lon, radius, refreshKey]);

    return state;
}