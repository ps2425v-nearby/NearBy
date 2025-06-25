import React, { useState } from 'react';
import { FaCar } from 'react-icons/fa';
import {PlaceType} from "@/types/PlaceType";



interface Props {
    park: PlaceType;
    index: number;
}
/**
 * Component for displaying individual parking place details.
 * Includes toggle for showing/hiding extra tag and coordinate info.
 */
export const ParkingDetails: React.FC<Props> = ({ park, index }) => {
    const [showDetails, setShowDetails] = useState(false);

    // Converte Map em objeto para poder indexar com segurança
    const tagsObj = park.tags

    const amenityName =`Estacionamento ${index + 1}`;

    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow flex flex-col justify-between">
            <h5 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                🅿️ {amenityName}
            </h5>

            {showDetails && (
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 space-y-1">
                    <div className="flex items-center">
                        <FaCar className="inline mr-2 text-gray-500" />
                        <strong>Coordenadas:</strong> {park.lat}, {park.lon}
                    </div>
                    {Object.keys(tagsObj).length > 0 ? (
                        <ul className="list-disc list-inside">
                            {Object.entries(tagsObj).map(([key, value], i) => (
                                <li key={i}><strong>{key}</strong>: {value}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">Sem tags disponíveis</p>
                    )}
                </div>
            )}

            <button
                onClick={() => setShowDetails(prev => !prev)}
                className="mt-auto px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
            >
                {showDetails ? 'Esconder detalhes' : 'Ver detalhes'}
            </button>
        </div>
    );
};
