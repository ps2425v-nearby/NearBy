import clsx from "clsx";
import React from "react";

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