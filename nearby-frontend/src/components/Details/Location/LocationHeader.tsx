import React from "react";
import { FaMapMarkerAlt, FaRoad } from "react-icons/fa";

interface Props {
    location: any;
}
export const LocationHeader: React.FC<Props> = ({ location }) => (
    <div className="space-y-2">
        <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-blue-500"/> <strong>Raio de busca:</strong>  {location.searchRadius}m</p>
        <p className="flex items-center"><FaRoad className="mr-2 text-blue-500"/> <strong>Trânsito:</strong>  {location.trafficLevel}</p>
    </div>
);