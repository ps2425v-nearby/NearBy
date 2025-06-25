// components/Location/PlaceDetails.tsx
import React, { useState } from "react";
import {
    FaMapMarkerAlt,
    FaPhone,
    FaLink,
    FaTag,
    FaBuilding,
    FaRoad,
    FaClock,
    FaInfoCircle,
} from "react-icons/fa";

interface PlaceType {
    lat: number;
    lon: number;
    tags?: { [key: string]: string };
}

interface Props {
    place: PlaceType;
}

export const PlaceDetails: React.FC<Props> = ({ place }) => {
    const [showDetails, setShowDetails] = useState(false);
    const tags = place.tags instanceof Map ? Object.fromEntries(place.tags) : place.tags;

    const tagIcons: { [key: string]: JSX.Element } = {
        name: <FaMapMarkerAlt className="inline mr-1" />,
        alt_name: <FaMapMarkerAlt className="inline mr-1" />,
        phone: <FaPhone className="inline mr-1" />,
        website: <FaLink className="inline mr-1" />,
        operator: <FaBuilding className="inline mr-1" />,
        highway: <FaRoad className="inline mr-1" />,
        opening_hours: <FaClock className="inline mr-1" />,
        description: <FaInfoCircle className="inline mr-1" />,
        default: <FaTag className="inline mr-1" />,

    };

    return (
        <div className="mb-3 border rounded p-3">
            {tags && typeof tags === "object" ? (
                <>
                    {(tags.name || tags.alt_name || tags.amenity || tags.shop) && (
                        <h3 className="font-bold mb-2 text-lg flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                            {tags.name || tags.alt_name || tags.amenity || tags.shop}
                        </h3>
                    )}

                    <button
                        onClick={() => setShowDetails(prev => !prev)}
                        className="mb-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                    >
                        {showDetails ? "Ver menos detalhes" : "Ver mais detalhes"}
                    </button>

                    {showDetails && (
                        <ul className="list-inside ml-2 text-sm space-y-1 mt-2">
                            {Object.entries(tags)
                                .filter(([key,value]) => key && value)
                                .filter(([key]) => key !== "name" && key !== "alt_name")
                                .map(([key, value], i) => (
                                    <li key={i}>
                                        {tagIcons[key] || tagIcons.default}
                                        <strong className="capitalize">{key}:</strong> {String(value)}
                                    </li>
                                ))}

                            <li className="text-xs text-gray-500 mt-2">
                                📍 <strong>Coordenadas:</strong> {place.lat}, {place.lon}
                            </li>
                        </ul>
                    )}
                </>
            ) : (
                <p className="text-sm text-gray-400">Sem tags disponíveis</p>
            )}
        </div>
    );
};





