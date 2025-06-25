export interface DataEntry {
    populacaoresidentefreguesia_id: number;
    Distrito_DT: string;
    Concelho_CC: string;
    Designacao_CC: string;
    Freguesia_FR: string;
    Designacao_FR: string;
    Populacao: number;
    Rural: string;
    Litoral: string;
}

export interface Distrito {
    id: string;
    nome: string;
}

export interface Amenity {
    id: string;
    lat: number;
    lon: number;
    tags: { name?: string; [key: string]: string | undefined };
}

export interface ProcessedData {
    districts: { id: string; nome: string }[];
    municipalityMap: Map<string, { id: string; nome: string; distritoId: string }[]>;
    parishMap: Map<string, { id: string; nome: string; concelhoId: string }[]>;
}

export interface MapCenter {
    lat: number;
    lon: number;
}