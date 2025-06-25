import { SimpleLocation } from "@/types/SimpleLocationType";

/**
 * Fetches a list of saved simple location information for the current user.
 *
 * @param token - JWT token used for authorization
 * @returns Promise resolving to an array of SimpleLocation objects
 * @throws Throws an error if the fetch request fails
 */
export async function fetchReducedInformation(token: string): Promise<SimpleLocation[]> {
    // Retrieve userID from local storage
    const userID = localStorage.getItem("userID");

    // Make a GET request to fetch saved locations for the user
    const response = await fetch(`/api/locations/saved?userID=${userID}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Throw an error if the request was unsuccessful
    if (!response.ok) {
        throw new Error("Failed to fetch saved locations");
    }

    // Parse response JSON and return it typed as SimpleLocation[]
    const data = await response.json();

    return data as SimpleLocation[];
}
