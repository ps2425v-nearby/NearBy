import { useContext } from "react";
import { DarkmodeContext } from "@/context/DarkMode/DarkmodeContext";

export const useDarkModeSafe = () => {
    const context = useContext(DarkmodeContext);
    if (!context) {
        throw new Error("DarkmodeContext must be used within a DarkModeProvider");
    }
    return context;
};
