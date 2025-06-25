import React, {useState} from 'react';
import clsx from 'clsx';
import {ParkingSpaceType} from '@/types/parkingSpaceType';

interface ParkingProps {
    parkingSpaces: ParkingSpaceType[];
    darkMode: boolean;
}
/**
 * Parking component displays paginated parking space information.
 *
 * Props:
 * - parkingSpaces: array of ParkingSpaceType objects containing location and tags.
 * - darkMode: boolean flag to toggle dark/light theme styles.
 *
 * Features:
 * - Pagination with 6 items per page, with next/previous buttons and current page indicator.
 * - Cards styled with hover effects and dark mode support.
 * - Shows parking type label (capitalized) if available, else defaults to "Estacionamento".
 * - Displays latitude and longitude rounded to 4 decimals with icons.
 * - Graceful fallback when no parking data is available.
 */


export const Parking: React.FC<ParkingProps> = ({parkingSpaces, darkMode}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(parkingSpaces.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentParkingSpaces = parkingSpaces.slice(startIndex, endIndex);

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div>
            {parkingSpaces.length ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentParkingSpaces.map((space, idx) => (
                            <div
                                key={idx}
                                className={clsx(
                                    "group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer",
                                    darkMode
                                        ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/10"
                                        : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400/50 shadow-md hover:shadow-blue-400/10"
                                )}
                            >
                                {/* Parking Icon */}
                                <div className={clsx(
                                    "absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                                    darkMode
                                        ? "bg-blue-900/50 group-hover:bg-blue-800/70"
                                        : "bg-blue-100 group-hover:bg-blue-200"
                                )}>
                                    <svg className={clsx(
                                        "w-4 h-4 transition-colors duration-300",
                                        darkMode ? "text-blue-400" : "text-blue-600"
                                    )} fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                    </svg>
                                </div>

                                {/* Content */}
                                <div className="pr-10">
                                    <h5 className={clsx(
                                        "font-semibold text-sm mb-2 leading-tight",
                                        darkMode ? "text-white" : "text-gray-900"
                                    )}>
                                        {space.tags?.parking
                                            ? `${space.tags.parking.charAt(0).toUpperCase()}${space.tags.parking.slice(1)} Parking`
                                            : "Estacionamento"}
                                    </h5>

                                    <div className="flex items-center space-x-4 text-xs">
                                        <div className={clsx(
                                            "flex items-center space-x-1",
                                            darkMode ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            <span>{space.lat.toFixed(4)}</span>
                                        </div>
                                        <div className={clsx(
                                            "flex items-center space-x-1",
                                            darkMode ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            <span>{space.lon.toFixed(4)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover gradient overlay */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-600/5 transition-all duration-300 rounded-xl pointer-events-none"></div>
                            </div>
                        ))}
                    </div>

                    {/* Modern Pagination */}
                    <div
                        className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={clsx(
                                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105",
                                currentPage === 1
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
                                alt="Next"
                                className="w-4 h-4"
                            />
                        </button>

                        <div className={clsx(
                            "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm",
                            darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600"
                        )}>
                            <span className="font-medium">{currentPage}</span>
                            <span>de</span>
                            <span className="font-medium">{totalPages}</span>
                        </div>

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={clsx(
                                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105",
                                currentPage === totalPages
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
                </div>
            ) : (
                <div className={clsx(
                    "text-center py-12 rounded-xl border-2 border-dashed",
                    darkMode
                        ? "border-gray-600 text-gray-400"
                        : "border-gray-300 text-gray-500"
                )}>
                    <svg className={clsx(
                        "mx-auto w-12 h-12 mb-4",
                        darkMode ? "text-gray-600" : "text-gray-400"
                    )} fill="none" stroke="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-16-5c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252"/>
                    </svg>
                    <p className="text-sm font-medium">Nenhum estacionamento disponível</p>
                    <p className="text-xs mt-1">Não há informações de estacionamento para esta localização.</p>
                </div>
            )}
        </div>
    );
};