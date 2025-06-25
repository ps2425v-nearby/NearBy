import { PlaceType } from "@/types/PlaceType";

/**
 * Capitalizes the first character of a given string.
 *
 * @param s - The string to capitalize.
 * @returns The input string with the first character capitalized.
 */
export const capitalize = (s: string): string =>
    s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Filters an array of places, returning only those that have a "name" tag.
 *
 * Handles the case where `place.tags` might be a Map or a plain object.
 *
 * @param places - Array of places to filter.
 * @returns Array of places that contain a "name" tag.
 */
export const filterPlacesWithName = (places: PlaceType[]): PlaceType[] =>
    places.filter((place) => {
        const tags = place.tags instanceof Map ? Object.fromEntries(place.tags) : place.tags;
        return Boolean(tags["name"]);
    });
