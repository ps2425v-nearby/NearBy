import { useEffect, useState, useCallback } from "react";
import { fetchReducedInformation } from "../../../Fetch/Location/Saved/fetchReducedInformation";
import { SimpleLocation } from "@/types/SimpleLocationType";
import { useCookies } from "react-cookie";

/**
 * Custom hook to fetch and manage a list of saved locations.
 *
 * This hook handles loading state, stores the list of locations,
 * and provides a refresh function to reload the locations from the server.
 *
 * @returns {{
 *   locations: SimpleLocation[],
 *   loading: boolean,
 *   refresh: () => Promise<void>
 * }}
 */
export function useSavedLocations() {
    // State for storing saved locations
    const [locations, setLocations] = useState<SimpleLocation[]>([]);
    // Loading indicator for the fetch operation
    const [loading, setLoading] = useState(true);
    // Access cookies to get the authentication token
    const [cookies] = useCookies(['token']);

    /**
     * Fetches the list of saved locations from the server and updates state.
     * Sets loading to true before fetching and false after the fetch completes.
     */
    const refresh = useCallback(async () => {
        setLoading(true);
        const list = await fetchReducedInformation(cookies.token);
        setLocations(list);
        setLoading(false);
    }, [cookies.token]);  // Dependency on cookie token

    /**
     * Runs the refresh function once on component mount and whenever the token changes.
     */
    useEffect(() => {
        refresh().catch(console.error);
    }, [refresh]);

    return { locations, loading, refresh };
}
