import {requestUrl} from "@/utils/Backend_URL";

/**
 * Sends a request to update an existing comment.
 *
 * @param commentId - The ID of the comment to be updated.
 * @param updatedData - The updated comment data.
 *   - userId: ID of the user who made the comment.
 *   - placeId: ID of the related place.
 *   - placeName (optional): Name of the place.
 *   - content: Updated comment content.
 * @param token - JWT token for authentication.
 *
 * @throws {Error} If the request response is not successful.
 *
 * @returns {Promise<any>} Returns the updated comment data in JSON format.
 */
export async function fetchUpdateComment(
    commentId: number,
    updatedData: {
        userId: number;
        placeId: number;
        placeName?: string;
        content: string;
    },
    token: string
) {
    const response = await fetch(`${requestUrl}/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        throw new Error("Failed to update comment");
    }

    return response.json();
}
