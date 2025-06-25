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