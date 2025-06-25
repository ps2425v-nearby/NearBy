import React from "react";
import { LocationDetails } from "@/components/Details/Location/LocationDetails";
import { SpecificLocationType } from "@/types/SpecificLocationType";

interface Props {
    loc: SpecificLocationType;
    darkMode: boolean;
    onRemove: (name: string) => void;
}

/**
 * Card component to display and compare details of a specific location.
 *
 * @param loc - The location data to display.
 * @param darkMode - Flag to toggle dark mode styling.
 * @param onRemove - Callback function triggered when the remove button is clicked,
 *                   receives the location name to remove it from comparison.
 */
export const ComparisonCard: React.FC<Props> = ({ loc, darkMode, onRemove }) => (
    <div className={`relative flex-1 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-black"}`}>
        <button
            onClick={() => onRemove(loc.name)}
            aria-label="Remove comparison"
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
        >
            ✖
        </button>
        <h3 className="text-xl font-semibold mb-4">
            🗂️ Compare: <span className="text-blue-400">{loc.name}</span>
        </h3>
        <LocationDetails location={loc} darkMode={darkMode} />
    </div>
);
