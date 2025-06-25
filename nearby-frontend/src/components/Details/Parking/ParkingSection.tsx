import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ParkingDetails } from "./ParkingDetails";

/** Define the props for the component, expecting an array called `places` */
interface Props {
    places: any[];
}

/** ParkingSection component displays parking-related places in a collapsible section */
export const ParkingSection: React.FC<Props> = ({ places }) => {
    /** State to track whether the section is open or collapsed */
    const [open, setOpen] = useState(false);

    /**
     * Filter the places array to find elements with a tag
     * that identifies them as a parking or parking entrance
     */
    const parking = places.filter((p) => {
        /** If tags is a Map, convert it to an object; otherwise use it as is */
        const tags = p.tags instanceof Map ? Object.fromEntries(p.tags) : p.tags;
        /** Return only items tagged as 'parking' or 'parking_entrance' */
        return tags?.amenity === "parking" || tags?.amenity === "parking_entrance";
    });

    return (
        <div className="mt-6">
            {/* Button to toggle the visibility of the parking section */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center text-xl font-semibold text-yellow-500"
            >
                🅿️ Estacionamentos
                {/* Display up or down chevron icon depending on open state */}
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* If section is open, render the parking list or a fallback message */}
            {open && (
                parking.length ? (
                    /** Display each parking place using the ParkingDetails component */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {parking.map((p, i) => (
                            <ParkingDetails key={i} park={p} index={i} />
                        ))}
                    </div>
                ) : (
                    /** Message shown if no parking places are found */
                    <p className="text-gray-400 mt-2">Nenhum estacionamento encontrado.</p>
                )
            )}
        </div>
    );
};
