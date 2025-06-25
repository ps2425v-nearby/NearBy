import React, { useState } from "react";
import { FaBuilding, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { PlaceDetails } from "../Place/PlaceDetails";

interface Props {
    title: string;
    places: any[];
    darkMode: boolean;
}

export const CategorySection: React.FC<Props> = ({ title, places, darkMode }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="mb-4">
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex justify-between items-center text-lg font-medium text-left px-4 py-2 rounded transition ${
                    darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
            >
        <span className="flex items-center">
          <FaBuilding className="mr-2" />
            {title}
        </span>
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {open && (
                places.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {places.map((p, i) => (
                            <PlaceDetails
                                key={i}
                                place={{ ...p, tags: p.tags instanceof Map ? Object.fromEntries(p.tags) : p.tags }}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 mt-2 ml-2">Nenhum local encontrado nesta categoria.</p>
                )
            )}
        </div>
    );
};