import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import {CrimeType} from "@/types/CrimeType";

interface Props {
    crimes: CrimeType[];
}

/**
 * Displays a collapsible section listing crime records.
 * Shows a toggle button to expand/collapse the crime list.
 * When open, displays crimes with city, type, and value or a message if no crimes are present.
 */
export const CrimeSection: React.FC<Props> = ({ crimes }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="mt-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center text-xl font-semibold text-red-500"
            >
                🚓 Registos de Crime
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {open && (
                crimes.length ? (
                    <ul className="list-disc list-inside mt-2">
                        {crimes.map((c, i) => (
                            <li key={i}>🛑 <strong>{c.city}</strong>: {c.type}
                            <span className="text-gray-500"> (Valor: {c.valor})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 mt-2">Nenhum crime registado.</p>
                )
            )}
        </div>
    );
};