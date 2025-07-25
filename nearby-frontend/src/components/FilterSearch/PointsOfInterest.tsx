import React from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { interestedPointsMap } from '@/utils/constants';

interface PointsOfInterestProps {
    /**
     * Name of the parish to display points of interest for.
     */
    parish: string;

    /**
     * Current search query string for filtering points.
     */
    searchQuery: string;

    selectedPoints: string[];


    setSearchQuery: (value: string) => void;


    setSelectedPoints: (value: string[]) => void;

    darkMode: boolean;
}

const PointsOfInterest: React.FC<PointsOfInterestProps> = ({
                                                               parish,
                                                               searchQuery,
                                                               selectedPoints,
                                                               setSearchQuery,
                                                               setSelectedPoints,
                                                               darkMode,
                                                           }) => {
    /**
     * Filters points of interest keys by search query (case-insensitive).
     */
    const filteredPoints = Object.keys(interestedPointsMap).filter((ponto) =>
        ponto.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * Handles toggling a point of interest in the selectedPoints array.
     * Adds it if not selected, removes if already selected.
     * @param ponto - point of interest key
     */
    const handleCheckbox = (ponto: string) => {
        setSelectedPoints(
            selectedPoints.includes(ponto)
                ? selectedPoints.filter((item) => item !== ponto)
                : [...selectedPoints, ponto]
        );
    };

    // If parish is not provided, do not render the component
    if (!parish) return null;

    return (
        /**
         * Container with fade-in animation.
         */
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
        >
            {/**
             * Section title label with optional dark mode styling.
             */}
            <label className={`block font-semibold items-center ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <span className="mr-2">⭐</span> 4. Pontos de Interesse
            </label>

            {/**
             * Search input with icon and styles adapting to dark mode.
             */}
            <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Pesquisar pontos de interesse..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 
            ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                    aria-label="Pesquisar pontos de interesse"
                />
            </div>

            {/**
             * "Select All" checkbox that toggles all points selected or none.
             * Includes animation on hover and tap.
             */}
            <label className="flex items-center space-x-2 cursor-pointer">
                <motion.input
                    type="checkbox"
                    checked={Object.keys(interestedPointsMap).every((p) => selectedPoints.includes(p))}
                    onChange={(e) => {
                        setSelectedPoints(e.target.checked ? Object.keys(interestedPointsMap) : []);
                    }}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Selecionar Todos</span>
            </label>

            {/**
             * List of filtered points with checkboxes.
             * Scrollable container with dark/light mode background.
             * Shows message if no points found.
             */}
            <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 rounded-lg 
          ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
                {filteredPoints.length > 0 ? (
                    filteredPoints.map((ponto) => (
                        <label key={ponto} className="flex items-center space-x-2 cursor-pointer">
                            <motion.input
                                type="checkbox"
                                checked={selectedPoints.includes(ponto)}
                                onChange={() => handleCheckbox(ponto)}
                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            />
                            <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>{ponto}</span>
                        </label>
                    ))
                ) : (
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Nenhum ponto encontrado.</p>
                )}
            </div>
        </motion.div>
    );
};

export default PointsOfInterest;
