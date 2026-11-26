
import type {
    Ticket,
    CreateTicketRequest,
    UpdateTicketStatusRequest,
    TicketStatus,
    TicketPriority
} from "../types/ticket";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



async function request<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        cache: "no-store",
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
            } catch {
                message = errorBody;
            }
        }

        throw new Error(message);
    }

    if (response.status === 204 || response.status === 205) {
        return undefined as T;
    }

    const responseBody = await response.text();

    if (!responseBody.trim()) {
        return undefined as T;
    }

    return JSON.parse(responseBody) as T;
}

export const ticketService = {
    async getAll(
        status?: TicketStatus,
        priority?: TicketPriority
    ): Promise<Ticket[]> {
        const params = new URLSearchParams();

        if (status) {
            params.set("status", status);
        }

        if (priority) {
            params.set("priority", priority);
        }

        const query = params.toString();

        return request<Ticket[]>(
            `/tickets${query ? `?${query}` : ""}`
        );
    },

    async create(data: CreateTicketRequest): Promise<Ticket> {
        return request<Ticket>("/tickets", {
            method: "POST",
            body: JSON.stringify(data)
        });
    },

    async updateStatus(
        id: number,
        data: UpdateTicketStatusRequest
    ): Promise<void> {
        return request<void>(`/tickets/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    },

    async delete(id: number): Promise<void> {
        return request<void>(`/tickets/${id}`, {
            method: "DELETE"
        });
    }
};
