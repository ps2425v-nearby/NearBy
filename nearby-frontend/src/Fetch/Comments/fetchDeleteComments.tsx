/**
 * Sends a request to delete a comment by its ID.
 *
 * @param commentId - The ID of the comment to be deleted.
 * @param token - JWT token used for authentication.
 *
 * @throws {Error} Throws an error if the deletion request fails.
 *
 * @returns {Promise<boolean>} Returns true if the comment was successfully deleted.
 */
export async function fetchDeleteComment(commentId: number, token: string) {
    const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status} ${response.statusText}`);
    }
    return true;
}
