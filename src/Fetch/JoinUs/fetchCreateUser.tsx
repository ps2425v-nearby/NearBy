interface CreateUserPayload {
    email: string;
    name: string;
    password: string;
}

export async function fetchCreateUser(payload: CreateUserPayload) {
    const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
}
