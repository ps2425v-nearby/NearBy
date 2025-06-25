interface LoginPayload {
    name: string;
    password: string;
}

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
