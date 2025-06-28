import {requestUrl} from "@/utils/Backend_URL";

/**
 * Fetches location details by latitude and longitude.
 *
 * @param lat - Latitude of the location.
 * @param lon - Longitude of the location.
 * @returns Promise resolving to the location data object.
 * @throws Throws an error if the fetch fails or location is not found.
 */
export async function fetchLocationByLatLon(lat: number, lon: number) {
    const response = await fetch(`${requestUrl}/api/locations?lat=${lat}&lon=${lon}`);

    // Check if the HTTP response status is OK (status code 200-299)
    if (!response.ok) throw new Error("Failed to fetch location");

    // Parse the response JSON
    const data = await response.json();

    // Validate that the location data includes an 'id' property
    if (!data.id) throw new Error("Location not found");

    // Return the fetched location data
    return data;
}
