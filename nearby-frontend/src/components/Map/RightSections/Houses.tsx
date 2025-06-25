import React from 'react';
import clsx from 'clsx';

interface HousingPricesProps {
    housingPrices: number;

    darkMode: boolean;
}
/**
 * HousingPrices component displays estimated housing prices for various apartment sizes.
 *
 * Props:
 * - housingPrices: number representing price per square meter.
 * - darkMode: boolean flag to toggle dark/light theme styles.
 *
 * Features:
 * - Shows 5 predefined apartment sizes (m²) with their tipology and total price.
 * - Tipology categorization based on size ranges (T0 to T4).
 * - Styled cards with hover effects and dark mode support.
 * - Progress bar visualizes relative size compared to largest apartment.
 * - Gracefully handles missing price data by showing a placeholder message.
 */

export const HousingPrices: React.FC<HousingPricesProps> = ({housingPrices, darkMode}) => {
    const tipology = (m2: number) => {
        if (m2 <= 50) return 0;
        if (m2 <= 70) return 1;
        if (m2 <= 90) return 2;
        if (m2 <= 120) return 3;
        return 4;
    };

    return (
        <div>
            {housingPrices > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[45, 62, 83, 110, 137].map((m2) => {
                            const tipologia = tipology(m2);
                            const price = housingPrices * m2;

                            return (
                                <div
                                    key={m2}
                                    className={clsx(
                                        "group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer",
                                        darkMode
                                            ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500/50 shadow-lg hover:shadow-green-500/10"
                                            : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-green-400/50 shadow-md hover:shadow-green-400/10"
                                    )}
                                >
                                    {/* House Icon */}
                                    <div className={clsx(
                                        "absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                                        darkMode
                                            ? "bg-green-900/50 group-hover:bg-green-800/70"
                                            : "bg-green-100 group-hover:bg-green-200"
                                    )}>
                                        <svg className={clsx(
                                            "w-4 h-4 transition-colors duration-300",
                                            darkMode ? "text-green-400" : "text-green-600"
                                        )} fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                                        </svg>
                                    </div>

                                    {/* Content */}
                                    <div className="pr-10">
                                        <div className="flex items-center space-x-2 mb-3">
                                                <span className={clsx(
                                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                    darkMode
                                                        ? "bg-blue-900/50 text-blue-300"
                                                        : "bg-blue-100 text-blue-800"
                                                )}>
                                                    T{tipologia}
                                                </span>
                                            <span className={clsx(
                                                "text-xs font-medium",
                                                darkMode ? "text-gray-400" : "text-gray-500"
                                            )}>
                                                    {m2}m²
                                                </span>
                                        </div>

                                        <div className="space-y-1">
                                            <div className={clsx(
                                                "text-xl font-bold",
                                                darkMode ? "text-white" : "text-gray-900"
                                            )}>
                                                {price.toLocaleString("pt-PT", {
                                                    style: "currency",
                                                    currency: "EUR",
                                                    maximumFractionDigits: 0
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress bar showing relative price */}
                                    <div className="mt-3">
                                        <div className={clsx(
                                            "w-full bg-gray-200 rounded-full h-1.5",
                                            darkMode ? "bg-gray-700" : "bg-gray-200"
                                        )}>
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-500"
                                                style={{width: `${Math.min((m2 / 137) * 100, 100)}%`}}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Hover gradient overlay */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:via-emerald-500/5 group-hover:to-green-600/5 transition-all duration-300 rounded-xl pointer-events-none"></div>
                                </div>
                            );
                        })}
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
                              d="M3 7v10a2 2 0 002 2h16M3 7l8 8 4-4 8 8M3 7h16v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                    </svg>
                    <p className="text-sm font-medium">Preços indisponíveis</p>
                    <p className="text-xs mt-1">Não há informações de preços de imóveis para esta localização.</p>
                </div>
            )}
        </div>
    );
};