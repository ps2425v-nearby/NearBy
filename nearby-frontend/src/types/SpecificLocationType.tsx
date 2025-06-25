import { PlaceType } from "./PlaceType";
import { ParkingSpaceType } from "./parkingSpaceType";
import { CrimeType } from "@/types/CrimeType";
import { SeasonWindData } from "@/types/WeatherType";

/**
 * Represents a detailed location with comprehensive information
 * including geographical data, points of interest, weather, traffic,
 * crime stats, and parking info.
 */
export type SpecificLocationType = {
    id: number;                    // Unique identifier of the location
    lat: number;                   // Latitude coordinate
    lon: number;                   // Longitude coordinate
    searchRadius: number;          // Radius for searching around the location
    name: string;                  // Name of the location
    places: PlaceType[];           // List of related places around the location
    wind: SeasonWindData;          // Seasonal wind data for the location
    trafficLevel: string;          // Traffic congestion level as a string
    crimes: CrimeType[];           // List of crime statistics related to the location
    parkingSpaces: ParkingSpaceType[]; // Available parking spaces nearby
    userID: number;                // Associated user ID for personalization or ownership
};
