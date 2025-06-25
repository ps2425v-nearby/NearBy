export async function fetchZoneIdentier(lat: number, lon: number): Promise<string[]> {
    const overpassUrl = `/api/zones?lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(overpassUrl);

        if (!response.ok) {
            // Apenas retorna o valor padrão, não lança erro
            return ["Desconhecido", "Desconhecido", "Desconhecido"];
        }

        const text = await response.text();

        if (text.trim().startsWith("<")) {
            // Retorna o valor padrão se a resposta for HTML
            return ["Desconhecido", "Desconhecido", "Desconhecido"];
        }

        const data = JSON.parse(text);
        if (data && typeof data === "object") {
            return Array.from(
                new Set(
                    Object.values(data)
                        .filter((value): value is string => value !== undefined && value !== "" && typeof value === "string")
                )
            );
        } else {
            return ["Desconhecido", "Desconhecido", "Desconhecido"];
        }
    } catch (error) {
        return ["Erro ao buscar informações do local.", "Erro ao buscar informações do local.", "Erro ao buscar informações do local."];
    }
}
