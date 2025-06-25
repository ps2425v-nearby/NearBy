import {PlaceType} from "@/types/PlaceType";
import {ParkingSpaceType} from "@/types/parkingSpaceType";
/**
 * InformationProps defines the props for the Information component.
 *
 * Properties:
 * - cityIdentification: string[] — list of city identifiers or names.
 * - iradius: number — current radius value for search or filtering.
 * - places: PlaceType[] — array of place objects.
 * - parkingSpaces: ParkingSpaceType[] — array of parking space objects.
 * - weather: any — weather data, ideally typed more specifically.
 * - crimes: any — crime data, ideally typed more specifically.
 * - trafficLevel: string — current traffic level indicator.
 * - housingPrices: number — base housing price for calculations.
 * - onCloseClick: () => void — callback triggered when the close action is invoked.
 * - onRadiusChange: (n: number) => void — callback for radius change events.
 * - isLoading: boolean — loading state indicator.
 * - noData: boolean — flag indicating absence of data.
 */

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