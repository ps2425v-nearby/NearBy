import { useEffect, useState, useCallback } from "react";
import { fetchReducedInformation } from "../../../Fetch/Location/Saved/fetchReducedInformation";
import { SimpleLocation } from "@/types/SimpleLocationType";
import {useCookies} from "react-cookie";

export function useSavedLocations() {
    const [locations, setLocations] = useState<SimpleLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['token']);

    const refresh = useCallback(async () => {
        setLoading(true);
        const list = await fetchReducedInformation(cookies.token);
        setLocations(list);
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh().catch(console.error);
    }, [refresh]);
    return { locations, loading, refresh };
}