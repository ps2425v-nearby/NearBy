/**
 * Represents a geographic place with associated metadata.
 */
export type PlaceType = {
    type: string;             // The category or type of the place
    id: number;               // Unique identifier for the place
    lat: number;              // Latitude coordinate
    lon: number;              // Longitude coordinate
    tags: Map<string, string>;// Metadata tags as key-value pairs
};
