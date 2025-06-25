import { useState, useCallback } from "react";
import { SpecificLocationType } from "@/types/SpecificLocationType";
import { fetchSavedLocationById } from "../../../Fetch/Location/Saved/fetchSavedLocationById";
import { useCookies } from "react-cookie";

/**
 * Custom hook to manage a list of locations selected for comparison.
 *
 * Allows adding locations up to a specified maximum and removing them.
 * Prevents adding duplicates by name.
 *
 * @param {number} max - Maximum number of locations allowed in the comparison (default 3).
 * @returns {{
 *   comparison: SpecificLocationType[],
 *   add: (id: number, name: string) => Promise<boolean>,
 *   remove: (name: string) => void
 * }}
 */
export function useLocationCompare(max = 3) {
    // State to hold the current list of locations selected for comparison
    const [comparison, setComparison] = useState<SpecificLocationType[]>([]);
    // Access authentication token from cookies
    const [cookies] = useCookies(['token']);

    /**
     * Adds a location to the comparison list by fetching its full details using the given ID.
     * Prevents adding if the max limit is reached or if the location name already exists in the list.
     *
     * @param {number} id - The ID of the location to fetch and add.
     * @param {string} name - The name of the location to be added.
     * @returns {Promise<boolean>} - Returns true if added successfully, false otherwise.
     */
    const add = useCallback(async (id: number, name: string) => {
        if (comparison.length >= max || comparison.some((l) => l.name === name)) return false;
        const full = await fetchSavedLocationById(id, cookies.token);
        if (!full) return false;
        const FullName = { ...full, name: name };

        setComparison((prev) => [...prev, FullName]);
        return true;
    }, [comparison, max, cookies.token]);

    /**
     * Removes a location from the comparison list by its name.
     *
     * @param {string} name - The name of the location to remove.
     */
    const remove = useCallback((name: string) => {
        setComparison((prev) => prev.filter((l) => l.name !== name));
    }, []);

    return { comparison, add, remove };
}
