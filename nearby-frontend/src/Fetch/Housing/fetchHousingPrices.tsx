export async function fetchHousingPrices(locationData: string[]): Promise<number> {
    const overpassUrl = `/api/housing/prices`;

    if (!locationData || locationData.length === 0) {
        return 0;
    }

    const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
    });

    if (!response.ok) {
        await response.text();
        return 0;
    }

    const text = await response.text();

    if (text.trim().startsWith("<")) {
        throw new Error("Recebida resposta HTML inválida em vez de JSON.");
    }

    const data = JSON.parse(text);

    if (typeof data === "number") {
        return data;
    } else if (typeof data === "object" && data.value && typeof data.value === "number") {
        return data.value;
    } else {
        return 0;
    }
}
