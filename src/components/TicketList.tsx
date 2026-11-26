
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

    const filteredTickets = tickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <p>Loading tickets...</p>;
    }

    if (error) {
        return <p role="alert">Error: {error}</p>;
    }

    return (
        <div>
            <h2>Support Tickets</h2>
            <TicketForm onCreated={() => setRefreshKey((current) => current + 1)} />
            <div className="ticket-filters">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value as TicketStatus | "")
                    }
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
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.title}</td>
                                <td>{ticket.description}</td>
                                <td>{ticket.priority}</td>
                                <td>{ticket.status}</td>
                                <td>
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TicketList;
