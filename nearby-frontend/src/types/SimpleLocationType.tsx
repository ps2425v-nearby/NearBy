/**
 * Represents a simplified location with basic geographic information.
 */
export type SimpleLocation = {
    id: number;          // Unique identifier for the location
    name: string;        // Name of the location
    lat: number;         // Latitude coordinate
    lon: number;         // Longitude coordinate
    searchRadius: number;// Radius (in meters or units) around the location for searching
};
