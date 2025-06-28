/**
 * Payload structure for logging in a user.
 */
interface LoginPayload {
    name: string;
    password: string;
}

/**
 * Sends a login request with user credentials.
 *
 * @param payload - Object containing username and password.
 * @throws Throws an error if the login request fails.
 * @returns Parsed JSON response on successful login.
 */
export async function fetchLogin(payload: LoginPayload) {
    const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
    }

    return await response.json();
}
