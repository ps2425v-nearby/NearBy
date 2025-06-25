import React from "react";

interface Props { darkMode: boolean; label?: string; }
export const Loader: React.FC<Props> = ({ darkMode, label = "Carregando..." }) => (
    <div className="flex flex-col items-center gap-4 py-10">
        <div className={`w-12 h-12 border-4 rounded-full animate-spin ${darkMode ? "border-gray-300 border-t-blue-500" : "border-gray-400 border-t-blue-600"}`} />
        <p className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{label}</p>
    </div>
);