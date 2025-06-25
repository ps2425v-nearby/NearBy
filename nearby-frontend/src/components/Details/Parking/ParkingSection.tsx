import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ParkingDetails } from "./ParkingDetails";

interface Props {
    places: any[];
}

export const ParkingSection: React.FC<Props> = ({ places }) => {
    const [open, setOpen] = useState(false);
    const parking = places.filter((p) => {
        const tags = p.tags instanceof Map ? Object.fromEntries(p.tags) : p.tags;
        return tags?.amenity === "parking" || tags?.amenity === "parking_entrance";
    });
    return (
        <div className="mt-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center text-xl font-semibold text-yellow-500"
            >
                🅿️ Estacionamentos
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {open && (
                parking.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {parking.map((p, i) => (
                            <ParkingDetails key={i} park={p} index={i} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 mt-2">Nenhum estacionamento encontrado.</p>
                )
            )}
        </div>
    );
};