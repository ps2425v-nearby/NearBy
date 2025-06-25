import React from "react";
import clsx from "clsx";

/**
 * Spinner component
 *
 * Displays a spinning loader indicator with styles that adapt to dark mode.
 *
 * Props:
 * @param darkMode - Boolean indicating if dark mode styles should be applied.
 *
 * Styling:
 * - Uses `clsx` to conditionally apply border colors based on `darkMode`.
 * - Spinner is a rounded circle with a top border colored to create the spinning effect.
 * - Animation applied via Tailwind's `animate-spin` class.
 */

export const Spinner: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
    <div
        className={clsx(
            "h-12 w-12 animate-spin rounded-full border-4",
            darkMode
                ? "border-gray-300 border-t-blue-500"
                : "border-gray-400 border-t-blue-600"
        )}
    />
);
