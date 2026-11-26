const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function request(url, options) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        }
    });
    if (!response.ok) {
        const errorBody = await response.text();
        let message = `Request failed with status ${response.status}`;
        if (errorBody) {
            try {
                const errorData = JSON.parse(errorBody);
                message = errorData.detail || errorData.title || message;
            }
            catch {
                message = errorBody;
            }
        }
        throw new Error(message);
    }
    if (response.status === 204) {
        return undefined;
    }
    return response.json();
}
export const ticketService = {
    async getAll(status, priority) {
        const params = new URLSearchParams();
        if (status) {
            params.set("status", status);
        }
        if (priority) {
            params.set("priority", priority);
        }
        const query = params.toString();
        return request(`/tickets${query ? `?${query}` : ""}`);
    },
    async create(data) {
        return request("/tickets", {
            method: "POST",
            body: JSON.stringify(data)
        });
    },
    async updateStatus(id, data) {
        return request(`/tickets/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    },
    async delete(id) {
        return request(`/tickets/${id}`, {
            method: "DELETE"
        });
    }
};
