import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualSummaryProps {
    districtSelected: string;
    councilSelected: string;
    parishSelected: string;
    pointsSelected: string[];
    darkMode?: boolean;
}
/**
 * VisualSummary Component
 *
 * This component provides a concise visual summary of the selected geographic locations
 * (district, municipality, parish) and the selected points of interest.
 *
 * Key details:
 * - Displays the selected district, municipality, and parish, or a fallback text if none are selected.
 * - Shows selected points of interest as styled tags if any are chosen.
 * - Uses framer-motion's AnimatePresence and motion.div for smooth animated transitions
 *   when the summary appears or disappears.
 * - Supports light and dark mode styling based on the darkMode prop.
 * - The container smoothly expands/collapses its height while fading in/out.
 */

const VisualSummary: React.FC<VisualSummaryProps> = ({
                                                         districtSelected,
                                                         councilSelected,
                                                         parishSelected,
                                                         pointsSelected,
                                                         darkMode = false,
                                                     }) => (
    <AnimatePresence>
        {(districtSelected || councilSelected || parishSelected) && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-lg shadow-inner 
          ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
            >
                <p>
                    <strong className="font-semibold">Distrito:</strong> {districtSelected || 'Não selecionado'}
                </p>
                <p>
                    <strong className="font-semibold">Concelho:</strong> {councilSelected || 'Não selecionado'}
                </p>
                <p>
                    <strong className="font-semibold">Freguesia:</strong> {parishSelected || 'Não selecionado'}
                </p>
                {pointsSelected.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {pointsSelected.map((p) => (
                            <span
                                key={p}
                                className={`text-sm px-3 py-1 rounded-full 
                  ${darkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800'}`}
                            >
                {p}
              </span>
                        ))}
                    </div>
                )}
            </motion.div>
        )}
    </AnimatePresence>
);

export default VisualSummary;
