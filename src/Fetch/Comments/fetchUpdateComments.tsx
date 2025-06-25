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
    const response = await fetch(`/api/comments/${commentId}`, {
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