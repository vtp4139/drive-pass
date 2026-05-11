// ===== HTTP CLIENT (private) =====
// Được dùng NỘI BỘ trong tầng services. Component KHÔNG import file này.
// Nhờ vậy, sau này đổi từ REST sang GraphQL/tRPC chỉ cần sửa tầng services.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class HttpError extends Error {
    constructor(message, status, payload) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.payload = payload;
    }
}

async function request(path, { method = 'GET', body, signal } = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal,
    });

    let payload = null;
    const text = await res.text();
    if (text) {
        try {
            payload = JSON.parse(text);
        } catch {
            payload = { raw: text };
        }
    }

    if (!res.ok || payload?.success === false) {
        const message = payload?.error || `HTTP ${res.status}`;
        throw new HttpError(message, res.status, payload);
    }

    return payload?.data ?? payload;
}

export const http = {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export { HttpError };
