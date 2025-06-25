import {PlaceType} from "@/types/PlaceType";
import {ParkingSpaceType} from "@/types/parkingSpaceType";

export interface InformationProps {
    cityIdentification: string[];
    iradius: number;
    places: PlaceType[];
    parkingSpaces: ParkingSpaceType[];
    weather: any;
    crimes: any;
    trafficLevel: string;
    housingPrices: number;
    onCloseClick: () => void;
    onRadiusChange: (n: number) => void;
    isLoading: boolean;
    noData: boolean;
}