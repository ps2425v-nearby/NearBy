import clsx from "clsx";
import React from "react";
/**
 * CityInfo component
 *
 * Displays a labeled piece of city-related information with styles that adapt to dark mode.
 *
 * Props:
 * @param label - The label text describing the information.
 * @param value - The value or content associated with the label.
 * @param darkMode - Boolean indicating if dark mode styles should be applied.
 *
 * Styling:
 * - Uses `clsx` for conditional class application based on `darkMode`.
 * - Label styled with smaller font size and medium weight.
 * - Value styled with larger font size.
 */

export const CityInfo = ({
                      label,
                      value,
                      darkMode,
                  }: {
    label: string;
    value: string;
    darkMode: boolean;
}) => (
    <div className="flex-1">
        <p
            className={clsx(
                "mb-1 text-sm font-medium",
                darkMode ? "text-gray-300" : "text-gray-600"
            )}
        >
            {label}
        </p>
        <p
            className={clsx(
                "text-base",
                darkMode ? "text-white" : "text-gray-800"
            )}
        >
            {value}
        </p>
    </div>
);
