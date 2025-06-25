import clsx from "clsx";
import React from "react";

/**
 * Section component renders a titled section with optional dark mode styling.
 *
 * Props:
 * - title: string to display as the section heading.
 * - darkMode: boolean flag to toggle between dark and light styles.
 * - children: React nodes to be rendered inside the section content.
 *
 * Features:
 * - Title styled with bold font and bottom border.
 * - Text and border colors adapt to darkMode.
 */

export const Section: React.FC<React.PropsWithChildren<{ title: string; darkMode: boolean }>> = ({
                                                                                                     title,
                                                                                                     darkMode,
                                                                                                     children,
                                                                                                 }) => (
    <section>
        <h4
            className={clsx(
                "mb-3 text-lg font-bold border-b pb-2",
                darkMode ? "border-gray-600 text-white" : "border-gray-300 text-gray-900"
            )}
        >
            {title}
        </h4>
        <div className={darkMode ? "text-white" : "text-gray-700"}>{children}</div>
    </section>
);