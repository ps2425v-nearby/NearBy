import {PlaceType} from "./PlaceType";
import {ParkingSpaceType} from "./parkingSpaceType";
import {CrimeType} from "@/types/CrimeType";
import {SeasonWindData} from "@/types/WeatherType";


export type SpecificLocationType = {
    id: number;
    lat: number;
    lon: number;
    searchRadius: number;
    name: string;
    places: PlaceType[];
    wind: SeasonWindData;
    trafficLevel: String;
    crimes: CrimeType[];
    parkingSpaces: ParkingSpaceType[];
    userID: number;
}
