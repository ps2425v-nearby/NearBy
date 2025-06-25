import { PlaceType } from "@/types/PlaceType";
import { ParkingSpaceType } from "@/types/parkingSpaceType";
import { CrimeType } from "@/types/CrimeType";

export async function saveApiLocation(
    lat: number,
    lon: number,
    searchRadius: number,
    name: string,
    places: PlaceType[],
    wind: any,
    trafficLevel: string,
    crimes: CrimeType[],
    parkingSpaces: ParkingSpaceType[],
    userID: number,
    token: string
): Promise<any> {
    const saveUrl = `/api/locations`;

    const response = await fetch(saveUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
            lat,
            lon,
            searchRadius,
            name,
            places,
            wind,
            trafficLevel,
            crimes,
            parkingSpaces,
            userID,
        }),
    });

    if (!response.ok) {
        if (response.status === 409) {
            // Aqui podes chamar o showNotification("A localização já está guardada", "warning") se tiveres acesso ao contexto
            throw new Error("A localização já está guardada");
        }
        throw new Error("Erro ao salvar localização");
    }

    return response.json();
}
