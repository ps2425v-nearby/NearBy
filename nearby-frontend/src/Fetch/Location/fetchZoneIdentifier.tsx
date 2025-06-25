/**
 * Fetches zone identifiers for a given latitude and longitude.
 *
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns Promise that resolves to an array of unique zone identifier strings.
 *          Returns default values if the fetch fails or response is invalid.
 */
export async function fetchZoneIdentier(lat: number, lon: number): Promise<string[]> {
    const overpassUrl = `/api/zones?lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(overpassUrl);

        // If the response status is not OK, return default unknown values instead of throwing error
        if (!response.ok) {
            return ["Unknown", "Unknown", "Unknown"];
        }

        const text = await response.text();

        // If response starts with '<', it is likely an invalid HTML page instead of JSON
        if (text.trim().startsWith("<")) {
            return ["Unknown", "Unknown", "Unknown"];
        }

        const data = JSON.parse(text);

        // If data is an object, extract unique string values filtering out empty or undefined strings
        if (data && typeof data === "object") {
            return Array.from(
                new Set(
                    Object.values(data)
                        .filter((value): value is string => value !== undefined && value !== "" && typeof value === "string")
                )
            );
        } else {
            // Return default unknown values if data is not a valid object
            return ["Unknown", "Unknown", "Unknown"];
        }
    } catch (error) {
        // In case of fetch or parsing errors, return default error messages array
        return [
            "Error fetching location information.",
            "Error fetching location information.",
            "Error fetching location information.",
        ];
    }
}
