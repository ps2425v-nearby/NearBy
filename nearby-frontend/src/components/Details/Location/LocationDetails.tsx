import React from "react";
import { CategorySection } from "./CategorySection";
import { CrimeSection } from "../Crimes/CrimeSection";
import { ParkingSection } from "../Parking/ParkingSection";
import { LocationHeader } from "./LocationHeader";
import tagGroups from "../../../../AmenityFilters.json";
import { SpecificLocationType } from "@/types/SpecificLocationType";

interface Props {
    location: SpecificLocationType;
    darkMode: boolean;
}

const categoryLabels: Record<string, string> = {
    PublicServices: "Serviços Públicos",
    Healthcare: "Saúde",
    Education: "Educação",
    Utilities: "Utilidades",
    Transport: "Transportes",
    ShopsAndServices: "Lojas e Serviços",
    FoodAndDrink: "Comida e Bebida",
    CultureAndEntertainment: "Cultura e Entretenimento",
    ReligionAndSpirituality: "Religião e Espiritualidade",
    Accommodation: "Acomodações",
    AnimalRelated: "Relacionados com Animais",
    StorageAndFacilities: "Armazenamento e Instalações",
    MobilitySupport: "Apoio à Mobilidade",
    SpecialOrUncommon: "Especial ou Raro",
};
/**
 * Groups places by their categories based on predefined tag filters.
 * Places that don't match any category are grouped under "Outros".
 */
function useGroupedPlaces(location: SpecificLocationType) {
    return React.useMemo(() => {
        const grouped: Record<string, any[]> = {};
        const classified = new Set();

        Object.entries(tagGroups).forEach(([category, filters]) => {
            grouped[category] = location.places?.filter((p) => {
                const tags = p.tags instanceof Map ? Object.fromEntries(p.tags) : p.tags;
                const match = filters.some((f: string) => {
                    const [k, v] = f.toLowerCase().split("=");
                    return Object.entries(tags || {}).some(([tk, tv]) => tk.toLowerCase() === k && tv === v);
                });
                if (match) classified.add(p.id);
                return match;
            }) || [];
        });

        grouped.Outros = (location.places || []).filter((p) => !classified.has(p.id));
        return grouped;
    }, [location]);
}


/**
 * Displays detailed information about a location, including general info, categorized places,
 * crimes, and parking sections. Supports dark mode styling.
 */
export const LocationDetails: React.FC<Props> = ({ location, darkMode }) => {
    const grouped = useGroupedPlaces(location);

    return (
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-2xl font-bold mb-4">{location.name}</h2>

            {/* Cabeçalho com info geral */}
            <LocationHeader location={location} />

            {/* Secções de lugares por categoria */}
            <h3 className="text-xl font-semibold mt-6 mb-2 text-green-600">🏙️ Lugares Encontrados</h3>
            {Object.entries(grouped).map(([category, places]) => (
                <CategorySection
                    key={category}
                    title={categoryLabels[category] || category}
                    places={places}
                    darkMode={darkMode}
                />
            ))}

            {/* Crime & Estacionamento */}
            <CrimeSection crimes={location.crimes || []} />
            <ParkingSection places={location.places || []} />
        </div>
    );
};