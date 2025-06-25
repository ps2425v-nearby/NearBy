import { SpecificLocationType } from "@/types/SpecificLocationType";

export async function fetchSavedLocationById(locationId: number, token: string): Promise<SpecificLocationType> {
    const saveUrl = `/api/locations/${locationId}`;

    const response = await fetch(saveUrl, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar localização");
    }

    const data = await response.json();
    return data as SpecificLocationType;
}
