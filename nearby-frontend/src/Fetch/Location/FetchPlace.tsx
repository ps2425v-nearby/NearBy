import { AllInformationType } from "@/types/AllInformationType";

/**
 * Fetches detailed information about places around a given latitude and longitude within a search radius.
 *
 * @param lat - Latitude coordinate of the center point.
 * @param lon - Longitude coordinate of the center point.
 * @param searchRadius - Radius (in meters or relevant units) to search around the given coordinates.
 * @returns Promise that resolves to an AllInfomationType object with place data, or null if the fetch fails.
 * @throws Throws an error if the server returns an invalid (HTML) response instead of JSON.
 */
export async function fetchPlace(lat: number, lon: number, searchRadius: number): Promise<AllInformationType | null> {
    const overpassUrl = `/api/all-places?lat=${lat}&lon=${lon}&searchRadius=${searchRadius}`;

    const response = await fetch(overpassUrl);

    // If response status is not OK, return null to indicate failure
    if (!response.ok) {
        return null;
    }

    const text = await response.text();

    // If the response starts with '<', it’s likely an invalid HTML page instead of JSON
    if (text.trim().startsWith("<")) {
        throw new Error("Received invalid HTML response instead of JSON.");
    }

    // Parse and return the JSON response
    return JSON.parse(text);
}
