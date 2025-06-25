import { SimpleLocation } from "@/types/SimpleLocationType";

export async function fetchReducedInformation(token: string): Promise<SimpleLocation[]> {
    const userID = localStorage.getItem("userID");

    const response = await fetch(`/api/locations/saved?userID=${userID}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Erro ao salvar localização");
    }

    const data = await response.json();

    return data as SimpleLocation[];
}
