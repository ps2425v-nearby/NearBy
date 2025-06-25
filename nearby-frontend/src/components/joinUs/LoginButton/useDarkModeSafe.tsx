import { useContext } from "react";
import { DarkmodeContext } from "@/context/DarkMode/DarkmodeContext";
/**
 * Custom hook to safely access the DarkmodeContext.
 *
 * Key points:
 * - Uses React's `useContext` to consume `DarkmodeContext`.
 * - Throws an error if used outside of a `DarkModeProvider`, ensuring proper context usage.
 * - Returns the dark mode state and any related context values.
 */

export const useDarkModeSafe = () => {
    const context = useContext(DarkmodeContext);
    if (!context) {
        throw new Error("DarkmodeContext must be used within a DarkModeProvider");
    }
    return context;
};
