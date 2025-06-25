import {PlaceType} from "@/types/PlaceType";

export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const filterPlacesWithName = (places: PlaceType[]): PlaceType[] =>
    places.filter((place) => {
        const tags = place.tags instanceof Map ? Object.fromEntries(place.tags) : place.tags;
        return Boolean(tags["name"]);
    });