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

export function verifyOtp(payload) {
    return request("/api/auth/verify-otp", {
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

function authHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function fetchProgress() {
    return request("/api/progress", {
        headers: { "Content-Type": "application/json", ...authHeaders() },
    });
}

export function saveProgress(moduleId, stepId) {
    return request("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ moduleId, stepId }),
    });
}
