
import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import type {
    Ticket,
    TicketStatus,
    TicketPriority
} from "../types/ticket";
import TicketForm from "./TicketForm";

function TicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TicketStatus | "">("");
    const [priority, setPriority] = useState<TicketPriority | "">("");

    const [refreshKey, setRefreshKey] = useState(0);

    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadTickets() {
            try {
                setLoading(true);
                setError(null);

                const data = await ticketService.getAll(
                    status || undefined,
                    priority || undefined
                );

                if (!cancelled) {
                    setTickets(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load tickets."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadTickets();

        return () => {
            cancelled = true;
        };
    }, [status, priority, refreshKey]);


    async function handleStatusUpdate(ticket: Ticket) {
        const newStatus: TicketStatus =
            ticket.status === "Closed" ? "Open" : "Closed";
    
        try {
            setActionLoadingId(ticket.id);
            setError(null);
    
            await ticketService.updateStatus(ticket.id, {
                status: newStatus
            });
    
            setRefreshKey((current) => current + 1);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update ticket status."
            );
        } finally {
            setActionLoadingId(null);
        }
    }
    

    async function handleDelete(ticket: Ticket) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${ticket.title}"?`
        );
    
        if (!confirmed) {
            return;
        }
    
        try {
            setActionLoadingId(ticket.id);
            setError(null);
    
            await ticketService.delete(ticket.id);
    
            setRefreshKey((current) => current + 1);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete ticket."
            );
        } finally {
            setActionLoadingId(null);
        }
    }
    
    const filteredTickets = tickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <p>Loading tickets...</p>;
    }


    return (
        <div>
              {error && <p role="alert">Error: {error}</p>}
            <h2 className="section-title">Support Tickets</h2>
            <TicketForm onCreated={() => setRefreshKey((current) => current + 1)} />
            <div className="ticket-filters">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="form-input"
                />

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value as TicketStatus | "")
                    }
                    className="form-select"
                >
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Closed">Closed</option>
                </select>

                <select
                    value={priority}
                    onChange={(event) =>
                        setPriority(event.target.value as TicketPriority | "")
                    }
                    className="form-select"
                >
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            {filteredTickets.length === 0 ? (
                <p>No tickets found.</p>
            ) : (
                <div className="table-container">
                <table className="tickets-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.title}</td>
                                <td>{ticket.description}</td>
                                <td>
                                <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                                    {ticket.priority}
                                    </span>
                                </td>

                                <td>
                                    <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                                        {ticket.status === "InProgress" ? "In Progress" : ticket.status}
                                    </span>
                                </td>
                                <td>
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleStatusUpdate(ticket)}
                                        disabled={actionLoadingId !== null}
                                        className="btn btn-primary"
                                    >
                                        {actionLoadingId === ticket.id
                                            ? "Updating..."
                                            : ticket.status === "Closed"
                                                ? "Reopen"
                                                : "Close"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(ticket)}
                                        disabled={actionLoadingId !== null}
                                        className="btn btn-danger"
                                    >
                                        {actionLoadingId === ticket.id
                                            ? "Processing..."
                                            : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    );
}

export default TicketList;
