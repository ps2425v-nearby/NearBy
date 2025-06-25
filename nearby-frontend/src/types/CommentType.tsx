/**
 * Represents a user comment related to a specific place.
 */
export type Comment = {
    id: number;            // Unique identifier for the comment
    userId: number;        // ID of the user who created the comment
    placeId: number;       // ID of the place the comment refers to
    content: string;       // Text content of the comment
    createdAt: string;     // Timestamp when the comment was created
    updatedAt: string;     // Timestamp when the comment was last updated
    placeName?: string;    // Optional name of the place (for convenience)
};
