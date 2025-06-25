/**
 * Represents a parking space with geographic location and metadata.
 */
export type ParkingSpaceType = {
    type: string;              // Type or category of the parking space
    id: number;                // Unique identifier for the parking space
    lat: number;               // Latitude coordinate
    lon: number;               // Longitude coordinate
    tags: Record<string, any>; // Additional metadata as key-value pairs (can also be a Map if preferred)
};
