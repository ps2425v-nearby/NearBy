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
