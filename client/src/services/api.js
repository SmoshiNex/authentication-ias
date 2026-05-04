const BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, options = {}) {
    const res = await fetch(BASE + path, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        ...options,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { error: "Request failed" };
    return data;
}

export function register(payload) {
    return request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function login(payload) {
    return request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
