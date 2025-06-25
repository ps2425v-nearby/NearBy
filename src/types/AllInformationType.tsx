import {CrimeType} from "@/types/CrimeType";
import {WindResponse} from "@/types/WeatherType";
import {PlaceType} from "@/types/PlaceType";
import { ParkingSpaceType} from "@/types/parkingSpaceType";

export type AllInfomationType = {
    crimes: CrimeType[],
    id: number | undefined,
    lat : number,
    lon : number,
    places: PlaceType[],
    searchRadius: number,
    trafficLevel:String,
    wind: WindResponse,
    parkingSpaces:ParkingSpaceType[]

}