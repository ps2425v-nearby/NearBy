import { Information } from "./information/Information";
import { PlaceInfoState } from "@/components/Map/Hooks/usePlaceInfo";
import React from "react";

interface Props {
    info: PlaceInfoState;
    radius: number;
    onRadiusChange: (r: number) => void;
    onClose: () => void;
    isLoading: boolean;
    noData: boolean;
}
/**
 * SidePanel component acts as a container for displaying detailed location-related information.
 * It receives comprehensive data and control handlers via props and passes them down to the Information component.
 *
 * Props:
 * - info: An object containing place-related data such as zones, places, parking, weather, crimes, traffic, and housing values.
 * - radius: Current search radius used for querying location data.
 * - onRadiusChange: Callback function to update the search radius.
 * - onClose: Callback to handle closing the side panel.
 * - isLoading: Boolean indicating if data is currently being loaded.
 * - noData: Boolean indicating if no data was found for the given query.
 *
 * This component serves mainly as a presentational wrapper, forwarding props and ensuring separation of concerns.
 */

export const SidePanel: React.FC<Props> = ({ info, radius, onRadiusChange, onClose, isLoading, noData}) => (
    <Information
        cityIdentification={info.zone}
        iradius={radius}
        places={info.places}
        parkingSpaces={info.parking}
        weather={info.weather}
        crimes={info.crimes}
        trafficLevel={info.traffic}
        housingPrices={info.houseValue}
        onCloseClick={onClose}
        onRadiusChange={onRadiusChange}
        isLoading={isLoading}
        noData={noData}
    />
);