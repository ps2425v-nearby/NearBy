export type Comment  = {
    id: number;
    userId: number;
    placeId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    placeName?: string;
}