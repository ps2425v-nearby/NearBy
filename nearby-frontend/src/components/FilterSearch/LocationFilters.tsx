import React from 'react';
import { ProcessedData, Amenity } from '@/types/FilterTypes';

interface LocationFiltersProps {
    distrito: string;
    concelho: string;
    freguesia: string;
    setDistrito: (value: string) => void;
    setConcelho: (value: string) => void;
    setFreguesia: (value: string) => void;
    setAmenities: (value: Amenity[]) => void;
    setRadius: (value: number) => void;
    data: ProcessedData;
    darkMode: boolean;
}

/**
 * LocationFilters Component
 * A React component that renders a set of dropdown menus for selecting geographic
 * locations (district, municipality, and parish) in a hierarchical manner. The
 * component dynamically updates available options based on user selections and
 * supports dark mode styling. It resets related state (municipality, parish, amenities,
 * and radius) when higher-level selections change to ensure valid filter combinations.
 *
 * @param distrito - The currently selected district ID
 * @param concelho - The currently selected municipality ID
 * @param freguesia - The currently selected parish ID
 * @param setDistrito - Function to update the selected district ID
 * @param setConcelho - Function to update the selected municipality ID
 * @param setFreguesia - Function to update the selected parish ID
 * @param setAmenities - Function to update the selected amenities array
 * @param setRadius - Function to update the search radius
 * @param data - ProcessedData object containing districts, municipalityMap, and parishMap
 * @param darkMode - Boolean indicating whether dark mode is enabled for styling
 */
const LocationFilters: React.FC<LocationFiltersProps> = ({
                                                             distrito,
                                                             concelho,
                                                             freguesia,
                                                             setDistrito,
                                                             setConcelho,
                                                             setFreguesia,
                                                             setAmenities,
                                                             setRadius,
                                                             data,
                                                             darkMode
                                                         }) => (
    <div className="space-y-4">
        {/**
         * District selection dropdown. Displays a list of districts from data.districts.
         * Resets municipality, parish, amenities, and radius when a new district is selected.
         */}
        <div>
            <label
                className={`block font-semibold mb-2 items-center ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
                <span className="mr-2">📍</span> 1. Selecione o Distrito
            </label>
            <select
                value={distrito}
                onChange={(e) => {
                    setDistrito(e.target.value);
                    setConcelho(''); // Reset municipality
                    setFreguesia(''); // Reset parish
                    setAmenities([]); // Reset amenities
                    setRadius(2000); // Reset radius to default
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all 
          ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                aria-label="Selecionar distrito"
            >
                <option value="">-- Escolha um distrito --</option>
                {data.districts.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.nome}
                    </option>
                ))}
            </select>
        </div>

        {/**
         * Municipality selection dropdown. Displays municipalities for the selected
         * district from data.municipalityMap. Disabled if no district is selected.
         * Resets parish, amenities, and radius when a new municipality is selected.
         */}
        <div>
            <label
                className={`block font-semibold mb-2 items-center ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
                <span className="mr-2">🏙️</span> 2. Selecione o Concelho
            </label>
            <select
                value={concelho}
                onChange={(e) => {
                    setConcelho(e.target.value);
                    setFreguesia(''); // Reset parish
                    setAmenities([]); // Reset amenities
                    setRadius(2000); // Reset radius to default
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all 
          ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                disabled={!distrito} // Disable if no district selected
                aria-label="Selecionar concelho"
            >
                <option value="">-- Escolha um concelho --</option>
                {(data.municipalityMap.get(distrito) || []).map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.nome}
                    </option>
                ))}
            </select>
        </div>

        {/**
         * Parish selection dropdown. Displays parishes for the selected municipality
         * from data.parishMap. Disabled if no municipality is selected. Updates the
         * selected parish without resetting other filters.
         */}
        <div>
            <label
                className={`block font-semibold mb-2 items-center ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
                <span className="mr-2">🏘️</span> 3. Selecione a Freguesia
            </label>
            <select
                value={freguesia}
                onChange={(e) => setFreguesia(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all 
          ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                disabled={!concelho} // Disable if no municipality selected
                aria-label="Selecionar freguesia"
            >
                <option value="">-- Escolha uma freguesia --</option>
                {(data.parishMap.get(concelho) || []).map((f) => (
                    <option key={f.id} value={f.id}>
                        {f.nome}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default LocationFilters;
