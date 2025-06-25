// src/components/Comments/fetchCommentsByUser.tsx
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
    return Array.isArray(data) ? data : [];
}