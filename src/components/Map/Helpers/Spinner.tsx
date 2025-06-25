import React from "react";
import clsx from "clsx";

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
