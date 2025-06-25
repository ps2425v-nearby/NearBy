import { DataEntry, Distrito, ProcessedData } from '@/types/FilterTypes';

/**
 * processData Function
 * Processes raw data entries and district mappings to generate a structured dataset
 * containing sorted districts, municipalities (concelhos), and parishes (freguesias)
 * organized hierarchically. The output is used for filtering or displaying geographic
 * information in a map-based application.
 *
 * @param data - Array of DataEntry objects containing district, municipality, and parish information
 * @param distritosMap - Array of Distrito objects mapping district IDs to names
 * @returns ProcessedData object with sorted districts, municipality map, and parish map
 */
export const processData = (data: DataEntry[], distritosMap: Distrito[]): ProcessedData => {
    /**
     * Creates a Map to efficiently look up district names by their IDs.
     * Each entry maps a district ID to its corresponding name.
     */
    const distritoNameMap = new Map<string, string>(
        distritosMap.map((d) => [d.id, d.nome])
    );

    /**
     * Initializes a Set to collect unique district IDs encountered in the data.
     * Ensures no duplicate districts are processed.
     */
    const distritosSet = new Set<string>();

    /**
     * Initializes a Map to store municipalities (concelhos) grouped by district ID.
     * Each district ID maps to an array of municipality objects with ID, name, and district ID.
     */
    const concelhosMap = new Map<string, { id: string; nome: string; distritoId: string }[]>();

    /**
     * Initializes a Map to store parishes (freguesias) grouped by municipality ID.
     * Each municipality ID maps to an array of parish objects with ID, name, and municipality ID.
     */
    const freguesiasMap = new Map<string, { id: string; nome: string; concelhoId: string }[]>();

    /**
     * Iterates through each data entry to populate the district Set, municipality Map,
     * and parish Map. Ensures unique entries for districts, municipalities, and parishes.
     */
    data.forEach((entry) => {
        /** Adds the district ID to the Set to track unique districts. */
        distritosSet.add(entry.Distrito_DT);

        /** Processes municipalities for the current district. */
        const distritoId = entry.Distrito_DT;
        if (!concelhosMap.has(distritoId)) concelhosMap.set(distritoId, []);
        const concelhos = concelhosMap.get(distritoId)!;
        if (!concelhos.some((c) => c.id === entry.Concelho_CC)) {
            concelhos.push({ id: entry.Concelho_CC, nome: entry.Designacao_CC, distritoId });
        }

        /** Processes parishes for the current municipality. */
        const concelhoId = entry.Concelho_CC;
        if (!freguesiasMap.has(concelhoId)) freguesiasMap.set(concelhoId, []);
        const freguesias = freguesiasMap.get(concelhoId)!;
        if (!freguesias.some((f) => f.id === entry.Freguesia_FR)) {
            freguesias.push({ id: entry.Freguesia_FR, nome: entry.Designacao_FR, concelhoId });
        }
    });

    /**
     * Converts the district Set to an array of district objects with ID and name,
     * using the district name from distritoNameMap or falling back to the ID.
     * Sorts districts alphabetically by name for consistent display.
     */
    const distritos = Array.from(distritosSet)
        .map((id) => ({
            id,
            nome: distritoNameMap.get(id) || id,
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome));

    /**
     * Returns the processed data as a ProcessedData object containing the sorted
     * districts array, municipality Map, and parish Map for use in the application.
     */
    return { districts: distritos, municipalityMap: concelhosMap, parishMap: freguesiasMap };
};