import clsx from "clsx";
import React from "react";

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
