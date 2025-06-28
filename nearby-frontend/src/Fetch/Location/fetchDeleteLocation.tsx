import {requestUrl} from "@/utils/Backend_URL";

/**
 * Sends a request to delete a location by its ID.
 *
 * @param name - The name of the location (used for error messages).
 * @param locationId - The ID of the location to delete.
 * @param token - JWT token for authorization.
 * @returns Promise resolving to true if deletion is successful.
 * @throws Throws an error if the request fails with specific messages for common HTTP status codes.
 */
export async function fetchDeleteLocation(name: string, locationId: number, token: string): Promise<boolean> {
    const deleteUrl = `${requestUrl}/api/locations/${locationId}`;

    const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    // Handle different HTTP error status codes
    if (!response.ok) {
        if (response.status === 409) {
            throw new Error(`Location "${name}" not found.`);
        } else if (response.status === 403) {
            throw new Error("Access denied. Check your permissions.");
        } else {
            throw new Error(`Failed to delete location: ${response.statusText}`);
        }
    }

    // Read response text to ensure it's not invalid HTML (usually an error page)
    const text = await response.text();
    if (text.trim().startsWith("<")) {
        throw new Error("Invalid HTML response received instead of JSON.");
    }

    return true;
}
