import React from "react";
import clsx from "clsx";
/**
 * Wrapper component
 *
 * A container div that applies styles for layout and appearance, adapting
 * to dark mode based on the `darkMode` prop.
 *
 * Props:
 * @param darkMode - Boolean flag to toggle dark mode styling.
 * @param children - React nodes to be rendered inside the wrapper.
 *
 * Styling:
 * - Uses `clsx` to conditionally apply background, text color, and border color
 *   depending on `darkMode`.
 * - Includes padding, rounded corners, shadow, and scrollable overflow-y.
 */

export const Wrapper: React.FC<{ darkMode: boolean; children: React.ReactNode }> = ({
                                                                                 darkMode,
                                                                                 children,
                                                                             }) => (
    <div
        className={clsx(
            "relative h-full w-full overflow-y-auto rounded-xl p-6 shadow-2xl",
            darkMode
                ? "bg-gray-800 text-white border-2 border-white"
                : "bg-white text-black border-2 border-black"
        )}
    >
        {children}
    </div>
);
