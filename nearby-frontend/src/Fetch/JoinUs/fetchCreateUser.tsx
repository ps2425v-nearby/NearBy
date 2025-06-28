import {requestUrl} from "@/utils/Backend_URL";

/**
 * Payload structure for creating a new user.
 */
interface CreateUserPayload {
    email: string;
    name: string;
    password: string;
}

/**
 * Sends a request to create a new user.
 *
 * @param payload - Object containing user email, name, and password.
 * @returns An object containing:
 *  - ok: boolean indicating if the response was successful
 *  - status: HTTP status code
 *  - data: parsed JSON response data
 */
export async function fetchCreateUser(payload: CreateUserPayload) {
    const response = await fetch(`${requestUrl}/api/users`, {
        method: "POST",
        credentials: "include", // <-- important for cookies/auth
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
}