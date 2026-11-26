export type TicketStatus = "Open" | "InProgress" | "Closed";

export type TicketPriority = "High" | "Medium" | "Low";

export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string;
}

export interface CreateTicketRequest {
    title: string;
    description: string;
    priority: TicketPriority;
}

export interface UpdateTicketStatusRequest {
    status: TicketStatus;
}
