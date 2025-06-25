export type ParkingSpaceType = {
    type: string;
    id: number;
    lat: number;
    lon: number;
    tags: Record<string, any>; // Ou Map<string, any> se for um mapa
};

