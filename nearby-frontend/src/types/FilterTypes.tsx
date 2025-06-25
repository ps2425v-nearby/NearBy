/**
 * Represents demographic and geographic data for a parish.
 */
export interface DataEntry {
    populacaoresidentefreguesia_id: number;  // Unique ID for the resident population record
    Distrito_DT: string;                      // District code or identifier
    Concelho_CC: string;                      // Municipality code
    Designacao_CC: string;                    // Municipality name
    Freguesia_FR: string;                     // Parish code
    Designacao_FR: string;                    // Parish name
    Populacao: number;                        // Population count
    Rural: string;                           // Indicates if area is rural (e.g., "Yes"/"No")
    Litoral: string;                         // Indicates if area is coastal (e.g., "Yes"/"No")
}

/**
 * Represents a district entity with its ID and name.
 */
export interface Distrito {
    id: string;    // District identifier
    nome: string;  // District name
}

/**
 * Represents an amenity/location on the map.
 */
export interface Amenity {
    id: string;    // Unique identifier for the amenity
    lat: number;   // Latitude coordinate
    lon: number;   // Longitude coordinate
    tags: {        // Key-value metadata tags; name is optional
        name?: string;
        [key: string]: string | undefined;
    };
}

/**
 * Processed geographic data maps for efficient lookup.
 */
export interface ProcessedData {
    districts: { id: string; nome: string }[];  // List of districts
    municipalityMap: Map<string, { id: string; nome: string; distritoId: string }[]>;  // Maps district ID to municipalities
    parishMap: Map<string, { id: string; nome: string; concelhoId: string }[]>;       // Maps municipality ID to parishes
}

/**
 * Geographic coordinates for map centering.
 */
export interface MapCenter {
    lat: number;   // Latitude
    lon: number;   // Longitude
}
