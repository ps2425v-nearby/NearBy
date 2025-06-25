import React, { useState } from 'react';
import clsx from 'clsx';
import { WindResponse } from '@/types/WeatherType'; // certifique-se de que o caminho está correto
import { ChevronDown } from 'lucide-react'; // usa um ícone moderno

interface WeatherProps {
    weather: WindResponse | null;
    darkMode: boolean;
}

/**
 * Weather Component
 * A React component that displays weather information for different seasons.
 * It allows users to toggle the visibility of detailed weather data for each season.
 *
 * @param {WindResponse | null} weather - The weather data to display, structured by season.
 * @param {boolean} darkMode - Flag to determine if dark mode styles should be applied.
 *
 * @returns {JSX.Element} The rendered weather section with collapsible seasons.
 */
export const Weather: React.FC<WeatherProps> = ({ weather, darkMode }) => {
    const [openSeasons, setOpenSeasons] = useState<Record<string, boolean>>({});

    if (!weather) {
        return (
            <div
                className={clsx(
                    'inline-block px-3 py-1 rounded-full text-sm font-medium animate-pulse',
                    darkMode ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-800'
                )}
            >
                Loading...
            </div>
        );
    }

    const toggleSeason = (season: string) => {
        setOpenSeasons((prev) => ({
            ...prev,
            [season]: !prev[season],
        }));
    };

    return (
        <div
            id={'weather-section'}
            className="metereology max-w-2xl mx-auto p-2 space-y-2">
            {weather.map((season) => {
                const isOpen = openSeasons[season.season];
                return (
                    <section
                        key={season.season}
                        className={clsx(
                            'rounded-lg border overflow-hidden transition-all',
                            darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900',
                            isOpen ? 'shadow-md' : 'shadow-sm'
                        )}
                    >
                        <button
                            onClick={() => toggleSeason(season.season)}
                            className={clsx(
                                'w-full flex items-center justify-between px-4 py-3 text-left font-medium text-base tracking-wide',
                                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
                                'transition-colors duration-200'
                            )}
                            aria-expanded={isOpen}
                            aria-controls={`${season.season}-content`}
                        >
                            <span>{season.season}</span>
                            <ChevronDown
                                className={clsx(
                                    'h-5 w-5 transition-transform duration-300',
                                    isOpen && 'rotate-180'
                                )}
                            />
                        </button>

                        {isOpen && (
                            <div id={`${season.season}-content`} className="px-4 pb-4">
                                <div className="flex flex-col sm:flex-row gap-4 mt-2 text-sm">
                                    {[
                                        { label: 'Manhã (06:00-12:00)', data: season.morning },
                                        { label: 'Tarde (12:00-18:00)', data: season.afternoon },
                                        { label: 'Noite (18:00-06:00)', data: season.night },
                                    ].map(({ label, data }) => (
                                        <div key={label} className="flex-1 space-y-1 border-l pl-3">
                                            <p className="text-xxs text-gray-500 dark:text-gray-400">{label} </p>
                                            <p>
                                                🌡️ <span className="font-medium">{data.temperature.toFixed(1)}°C</span>
                                            </p>
                                            <p>
                                                💨 <span className="font-medium">{data.windSpeed.toFixed(1)} km/h</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
};
