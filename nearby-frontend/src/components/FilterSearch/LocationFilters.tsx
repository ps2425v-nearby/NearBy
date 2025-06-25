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
                    setConcelho('');
                    setFreguesia('');
                    setAmenities([]);
                    setRadius(2000);
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
                    setFreguesia('');
                    setAmenities([]);
                    setRadius(2000);
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all 
          ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                disabled={!distrito}
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
                disabled={!concelho}
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
