import { DataEntry, Distrito, ProcessedData } from '@/types/FilterTypes';

export const processData = (data: DataEntry[], distritosMap: Distrito[]): ProcessedData => {
    const distritoNameMap = new Map<string, string>(
        distritosMap.map((d) => [d.id, d.nome])
    );

    const distritosSet = new Set<string>();
    const concelhosMap = new Map<string, { id: string; nome: string; distritoId: string }[]>();
    const freguesiasMap = new Map<string, { id: string; nome: string; concelhoId: string }[]>();

    data.forEach((entry) => {
        distritosSet.add(entry.Distrito_DT);

        const distritoId = entry.Distrito_DT;
        if (!concelhosMap.has(distritoId)) concelhosMap.set(distritoId, []);
        const concelhos = concelhosMap.get(distritoId)!;
        if (!concelhos.some((c) => c.id === entry.Concelho_CC)) {
            concelhos.push({ id: entry.Concelho_CC, nome: entry.Designacao_CC, distritoId });
        }

        const concelhoId = entry.Concelho_CC;
        if (!freguesiasMap.has(concelhoId)) freguesiasMap.set(concelhoId, []);
        const freguesias = freguesiasMap.get(concelhoId)!;
        if (!freguesias.some((f) => f.id === entry.Freguesia_FR)) {
            freguesias.push({ id: entry.Freguesia_FR, nome: entry.Designacao_FR, concelhoId });
        }
    });

    const distritos = Array.from(distritosSet)
        .map((id) => ({
            id,
            nome: distritoNameMap.get(id) || id,
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome));

    return { districts: distritos, municipalityMap: concelhosMap, parishMap: freguesiasMap };
};