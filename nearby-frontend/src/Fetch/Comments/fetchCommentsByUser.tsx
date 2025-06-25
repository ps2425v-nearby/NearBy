/**
 * Fetches comments made by a specific user.
 *
 * @param userId - ID of the user whose comments are to be fetched
 * @param token - Authentication token for request authorization
 * @returns Promise that resolves to an array of comments (or an empty array if none found)
 * @throws Throws an error if the request fails (non-ok status)
 */
export async function fetchCommentsByUser(userId: number, token: string) {
    const response = await fetch(`/api/comments/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch comments");
    }

    const data = await response.json();

    // Returns an array even if the response is not a valid array
    return Array.isArray(data) ? data : [];
}
