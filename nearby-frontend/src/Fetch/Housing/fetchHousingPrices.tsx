import {requestUrl} from "@/utils/Backend_URL";

/**
 * Fetches housing prices based on location data.
 *
 * @param locationData - Array of location identifiers or strings.
 * @returns Promise resolving to a number representing the housing price, or 0 if unavailable.
 * @throws Throws an error if an invalid HTML response is received instead of JSON.
 */
export async function fetchHousingPrices(locationData: string[]): Promise<number> {
    const overpassUrl = `${requestUrl}/api/housing/prices`;

    if (!locationData || locationData.length === 0) {
        return 0;
    }

    const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
    });

    if (!response.ok) {
        await response.text();
        return 0;
    }

    const text = await response.text();

    if (text.trim().startsWith("<")) {
        throw new Error("Received invalid HTML response instead of JSON.");
    }

    const data = JSON.parse(text);

    if (typeof data === "number") {
        return data;
    } else if (typeof data === "object" && data.value && typeof data.value === "number") {
        return data.value;
    } else {
        return 0;
    }
}
