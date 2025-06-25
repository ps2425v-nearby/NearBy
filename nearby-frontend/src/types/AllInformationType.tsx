import { CrimeType } from "@/types/CrimeType";
import { WindResponse } from "@/types/WeatherType";
import { PlaceType } from "@/types/PlaceType";
import { ParkingSpaceType } from "@/types/parkingSpaceType";

/**
 * Aggregated data structure containing various types of information
 * related to a specific geographic location.
 */
export type AllInformationType = {
    crimes: CrimeType[];          // List of crime incidents in the area
    id: number | undefined;       // Optional unique identifier for the location
    lat: number;                  // Latitude coordinate
    lon: number;                  // Longitude coordinate
    places: PlaceType[];          // Nearby places of interest
    searchRadius: number;         // Radius (in meters or appropriate unit) used for data queries
    trafficLevel: string;         // Current traffic intensity (e.g., "low", "medium", "high")
    wind: WindResponse;           // Weather wind information
    parkingSpaces: ParkingSpaceType[]; // Available parking spaces nearby
};
