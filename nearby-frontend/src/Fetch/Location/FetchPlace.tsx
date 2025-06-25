import {AllInfomationType} from "@/types/AllInformationType";

export async function fetchPlace(lat: number, lon: number, searchRadius: number): Promise<AllInfomationType | null> {
    const overpassUrl = `/api/all-places?lat=${lat}&lon=${lon}&searchRadius=${searchRadius}`;

    const response = await fetch(overpassUrl);

    if (!response.ok) {
        return null;
    }
    const text = await response.text();
    if (text.trim().startsWith("<")) {
        throw new Error("Recebida resposta HTML inválida em vez de JSON.");
    }
    return JSON.parse(text);
}
