import {requestUrl} from "@/utils/Backend_URL";

/**
 * Sends a new comment to the server.
 *
 * @param params - Object containing comment data and authentication:
 *  - userId: ID of the user posting the comment (can be null)
 *  - locationId: ID of the location related to the comment (can be null)
 *  - placeName: Name of the place (can be null)
 *  - message: Content of the comment (required string)
 *  - token: JWT token for authentication (can be null)
 *
 * @returns Promise of the fetch response from the POST request to '/api/comments'.
 */
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
    return fetch(`${requestUrl}/api/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ userId, placeId: locationId, placeName, content: message }),
    });
}
