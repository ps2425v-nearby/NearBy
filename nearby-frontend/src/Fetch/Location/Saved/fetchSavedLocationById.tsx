import { SpecificLocationType } from "@/types/SpecificLocationType";

/**
 * Fetches a saved location by its ID.
 *
 * @param locationId - The ID of the location to fetch
 * @param token - JWT token used for authorization
 * @returns Promise resolving to a SpecificLocationType object
 * @throws Throws an error if the fetch request fails
 */
export async function fetchSavedLocationById(locationId: number, token: string): Promise<SpecificLocationType> {
    const saveUrl = `/api/locations/${locationId}`;

    const response = await fetch(saveUrl, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch location");
    }

    const data = await response.json();
    return data as SpecificLocationType;
}
