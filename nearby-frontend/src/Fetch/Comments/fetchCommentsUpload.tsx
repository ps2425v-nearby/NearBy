
export async function fetchCommentsUploadRequest({
    userId,
    locationId,
    placeName,
    message,
    token
}: {
    userId: number | null;
    locationId: number | null;
    placeName: string | null;
    message: string;
    token: string | null;
}) {

    return fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    },
        body: JSON.stringify({ userId, placeId: locationId, placeName, content: message }),
    });
}