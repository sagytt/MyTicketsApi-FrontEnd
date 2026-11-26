
import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import type { Ticket } from "../types/ticket";

function TicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTickets() {
            try {
                setLoading(true);
                setError(null);

                const data = await ticketService.getAll();

                setTickets(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load tickets."
                );
            } finally {
                setLoading(false);
            }
        }

        loadTickets();
    }, []);

    if (loading) {
        return <p>Loading tickets...</p>;
    }

    if (error) {
        return <p role="alert">Error: {error}</p>;
    }

    if (tickets.length === 0) {
        return <p>No tickets found.</p>;
    }

    return (
        <div>
            <h2>Support Tickets</h2>

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
                    {tickets.map((ticket) => (
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
        </div>
    );
}

export default TicketList;
