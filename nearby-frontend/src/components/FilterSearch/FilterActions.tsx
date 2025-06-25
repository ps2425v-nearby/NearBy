import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, MapIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { MapCenter, Amenity } from '@/types/FilterTypes';

interface FilterActionsProps {
    mapCenter: MapCenter | null;
    amenities: Amenity[];
    resetFilters: () => void;
    data: any;
    concelho: string;
    freguesia: string;
    radius: number;
    darkMode: boolean;
}

/**
 * FilterActions Component
 * A React component that renders action buttons for managing filters in a map-based
 * application. Provides buttons to reset filters and navigate to a larger map view
 * with selected parameters (map center, amenities, concelho, freguesia, and radius).
 * Utilizes Framer Motion for button animations and React Router for navigation.
 *
 * @param mapCenter - The current map center coordinates (latitude and longitude) or null
 * @param amenities - Array of selected amenities to filter places
 * @param resetFilters - Function to clear all applied filters
 * @param data - Object containing additional data, including a freguesiasMap for parish lookup
 * @param concelho - The selected municipality name
 * @param freguesia - The selected parish identifier
 * @param radius - The search radius for filtering places
 * @param darkMode - Boolean indicating whether dark mode is enabled for styling
 */

const FilterActions: React.FC<FilterActionsProps> = ({
                                                         mapCenter,
                                                         amenities,
                                                         resetFilters,
                                                         data,
                                                         concelho,
                                                         freguesia,
                                                         radius,
                                                         darkMode,
                                                     }) => {
    const navigate = useNavigate();
    const handleSeeMap = () => {
        if (!mapCenter) return;
        const freguesias = data?.freguesiasMap instanceof Map ? data.freguesiasMap.get(concelho) : null;
        const parishName = freguesias
            ? freguesias.find((f: { id: string; nome: string }) => f.id === freguesia)?.nome || freguesia
            : freguesia;

        navigate('/', {
            state: {
                lat: mapCenter.lat,
                lon: mapCenter.lon,
                parish: parishName,
                amenities: amenities.map((a) => ({
                    id: a.id,
                    lat: a.lat,
                    lon: a.lon,
                    tags: a.tags,
                })),
                searchRadius: radius,
            },
        });
    };

    return (
        <div className="flex justify-between items-center mt-6">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors
                    ${darkMode ? 'bg-red-700 hover:bg-red-800 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}
                `}
            >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Limpar Filtros
            </motion.button>
            {mapCenter && amenities.length > 0 && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSeeMap}
                    id={"map-icon"}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors
                        ${darkMode ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}
                    `}
                >
                    <MapIcon

                        className="h-5 w-5 mr-2" />
                    Ver no Mapa Grande
                </motion.button>
            )}
        </div>
    );
};

export default FilterActions;
