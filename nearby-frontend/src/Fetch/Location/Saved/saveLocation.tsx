import { PlaceType } from "@/types/PlaceType";
import { ParkingSpaceType } from "@/types/parkingSpaceType";
import { CrimeType } from "@/types/CrimeType";

/**
 * Saves a location to the API with detailed information.
 *
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @param searchRadius - Radius for searching around the location
 * @param name - Name of the location
 * @param places - Array of places associated with the location
 * @param wind - Wind data for the location (any type; consider typing if possible)
 * @param trafficLevel - Traffic level description (string)
 * @param crimes - Array of crimes reported at the location
 * @param parkingSpaces - Array of parking spaces at the location
 * @param userID - ID of the user saving the location
 * @param token - JWT token for authorization
 * @returns A promise resolving to the saved location response JSON
 * @throws Throws an error if the location is already saved (status 409) or on other failures
 */
export async function saveApiLocation(
    lat: number,
    lon: number,
    searchRadius: number,
    name: string,
    places: PlaceType[],
    wind: any,
    trafficLevel: string,
    crimes: CrimeType[],
    parkingSpaces: ParkingSpaceType[],
    userID: number,
    token: string
): Promise<any> {
    const saveUrl = `/api/locations`;

    const response = await fetch(saveUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
            lat,
            lon,
            searchRadius,
            name,
            places,
            wind,
            trafficLevel,
            crimes,
            parkingSpaces,
            userID,
        }),
    });

    if (!response.ok) {
        if (response.status === 409) {
            // You can trigger a notification here if you have access to context, e.g.:
            // showNotification("Location is already saved", "warning");
            throw new Error("Location is already saved");
        }
        throw new Error("Failed to save location");
    }

    return response.json();
}
