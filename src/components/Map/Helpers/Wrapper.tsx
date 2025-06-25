import React from "react";
import clsx from "clsx";

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
