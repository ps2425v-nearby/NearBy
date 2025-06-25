import { useState, useCallback } from "react";
import { SpecificLocationType } from "@/types/SpecificLocationType";
import { fetchSavedLocationById } from "../../../Fetch/Location/Saved/fetchSavedLocationById";
import { useCookies } from "react-cookie";

export function useLocationCompare(max = 3) {
    const [comparison, setComparison] = useState<SpecificLocationType[]>([]);
    const [cookies] = useCookies(['token']);

    const add = useCallback(async (id: number, name: string) => {
        if (comparison.length >= max || comparison.some((l) => l.name === name)) return false;
        const full = await fetchSavedLocationById(id,cookies.token);
        if (!full) return false;
        const FullName = {...full, name: name };

        setComparison((prev) => [...prev, FullName]);
        return true;
    }, [comparison, max]);

    const remove = useCallback((name: string) => {
        setComparison((prev) => prev.filter((l) => l.name !== name));
    }, []);

    return { comparison, add, remove };
}