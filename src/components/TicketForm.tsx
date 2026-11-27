import { useState } from "react";
import type { SubmitEvent } from "react";
import { ticketService } from "../services/ticketService";
import type {
    CreateTicketRequest,
    TicketPriority
} from "../types/ticket";

interface TicketFormProps {
    onCreated: () => void;
}

function TicketForm({ onCreated }: TicketFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TicketPriority>("Medium");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim() || !description.trim()) {
            setError("Title and description are required.");
            return;
        }

        const data: CreateTicketRequest = {
            title: title.trim(),
            description: description.trim(),
            priority
        };

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await ticketService.create(data);

            setTitle("");
            setDescription("");
            setPriority("Medium");
            setSuccess(true);

            onCreated();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create ticket."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
         <h2 className="card-title">Create New Ticket</h2>

            <div className="form-field">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                        setSuccess(false);
                        setError(null);
                    }}
                    placeholder="Enter ticket title"
                    required
                    maxLength={150}
                    className="form-input"
                />
            </div>

            <div className="form-field">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the issue"
                    required
                    maxLength={2000}
                    className="form-textarea"
                />
            </div>

            <div className="form-field">
                <label htmlFor="priority">Priority</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(event) =>
                        setPriority(event.target.value as TicketPriority)
                    }
                    className="form-select"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            {success && (
               <p className="form-success" role="status">
               Ticket created successfully!
                </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? "Creating..." : "Create Ticket"}
            </button>
        </form>
    );
}

export default TicketForm;
