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