
import TicketList from "./components/TicketList";
import "./App.css";

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <div>
                        <h1>Ticket Management</h1>
                        <p>Manage and track your support requests</p>
                    </div>

                    <span className="header-label">
                        Support Dashboard
                    </span>
                </div>
            </header>

            <main className="app-main">
                <TicketList />
            </main>

            <footer className="app-footer">
                Ticket Management System
            </footer>
        </div>
    );
}

export default App;
