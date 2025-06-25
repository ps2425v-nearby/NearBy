import React, { useState } from 'react';
import clsx from 'clsx';

interface Crime {
    city: string;
    type: string;
    valor: number;
}

interface CrimesProps {
    crimes: Crime[];
    darkMode: boolean;
}

/**
 * Crimes component displays a paginated list of crime statistics.
 *
 * Props:
 * - crimes: array of Crime objects { city, type, valor } to display.
 * - darkMode: boolean flag to toggle dark/light styling.
 *
 * Features:
 * - Pagination with 2 crimes per page.
 * - Navigation buttons to move between pages, disabled at bounds.
 * - Responsive grid layout for crime cards.
 * - Styles adapt to dark mode for backgrounds, text, borders, and buttons.
 * - Displays message when no crime data is available.
 */


export const Crimes: React.FC<CrimesProps> = ({ crimes, darkMode }) => {
    const [currentCrimePage, setCurrentCrimePage] = useState(1);
    const crimesPerPage = 2;
    const indexOfLastCrime = currentCrimePage * crimesPerPage;
    const indexOfFirstCrime = indexOfLastCrime - crimesPerPage;
    const currentCrimes = crimes.slice(indexOfFirstCrime, indexOfLastCrime);
    const totalCrimePages = Math.ceil(crimes.length / crimesPerPage);

    const goToNextCrimePage = () => {
        if (currentCrimePage < totalCrimePages) setCurrentCrimePage((prev) => prev + 1);
    };

    const goToPreviousCrimePage = () => {
        if (currentCrimePage > 1) setCurrentCrimePage((prev) => prev - 1);
    };

    return (
        <div>
            {crimes.length ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentCrimes.map((crime, idx) => (
                            <div
                                key={idx}
                                className={clsx(
                                    "rounded-xl p-2 shadow border transition-transform duration-200 hover:scale-[1.02]",
                                    darkMode
                                        ? "bg-gray-800 border-gray-600 text-white"
                                        : "bg-white border-gray-200 text-gray-900"
                                )}
                                style={{fontSize: "0.8rem"}}
                            >
                                <div className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-blue-400">
                                    {crime.city}
                                </div>
                                <div className="text-xs font-medium">{crime.type}</div>
                                <div
                                    className={clsx(
                                        "mt-1 text-xs font-semibold",
                                        darkMode ? "text-green-300" : "text-green-700"
                                    )}
                                >
                                    Valor: {crime.valor}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                        <button
                            onClick={goToPreviousCrimePage}
                            disabled={currentCrimePage === 1}
                            className={clsx(
                                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105",
                                currentCrimePage === 1
                                    ? darkMode
                                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : darkMode
                                        ? "bg-gray-700 text-white hover:bg-gray-600"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            <img
                                src="/images/left-arrow.png"
                                alt="Previous"
                                className="w-4 h-4"
                            />
                        </button>
                        <span className="text-sm text-center flex-1">
                                Página {currentCrimePage} de {totalCrimePages}
                            </span>
                        <button
                            onClick={goToNextCrimePage}
                            disabled={currentCrimePage === totalCrimePages}
                            className={clsx(
                                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105",
                                currentCrimePage === totalCrimePages
                                    ? darkMode
                                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : darkMode
                                        ? "bg-gray-700 text-white hover:bg-gray-600"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            <img
                                src="/images/right-arrow.png"
                                alt="Next"
                                className="w-4 h-4"
                            />
                        </button>
                    </div>
                </>
            ) : (
                <p
                    className={clsx(
                        "italic text-center py-2 text-xs",
                        darkMode ? "text-gray-400" : "text-gray-600"
                    )}
                >
                    Nenhuma informação criminal disponível para esta localização.
                </p>
            )}
        </div>
    );
};