const BASE = process.env.REACT_APP_API_URL || "http://localhost:5003/api";

async function request(path, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err = new Error(data.error || `Request failed (${res.status})`);
        err.status = res.status;
        throw err;
    }
    return data;
}

export const api = {
    get: (path, opts) => request(path, { method: "GET", ...opts }),
    post: (path, body, opts) => request(path, { method: "POST", body: JSON.stringify(body), ...opts }),
    patch: (path, body, opts) => request(path, { method: "PATCH", body: JSON.stringify(body), ...opts }),
    delete: (path, opts) => request(path, { method: "DELETE", ...opts }),

    // Multipart upload (PDF)
    upload: (path, formData) => {
        const token = localStorage.getItem("token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return fetch(`${BASE}${path}`, { method: "POST", headers, body: formData })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
                return data;
            });
    },
};
