import '../css/Home.css';
import '../css/Admin.css';

import { useState, useEffect, useContext, useCallback } from 'react';

import Navigation from '../component/Navigation.jsx';
import Footer from '../component/Footer.jsx';

import { SessionContext } from '../component/SessionProvider.jsx';
import { getToken } from '../imports/jwt.js';

const STATUS_DISPLAY = {
    waiting: {
        label: "Pending Review",
        className: "status-pending"
    },
    pending: {
        label: "Quote Ready",
        className: "status-processing"
    },
    accepted: {
        label: "Accepted",
        className: "status-shipped"
    },
    rejected: {
        label: "Rejected",
        className: "status-cancelled"
    }
};

async function getQuotes(token, setQuotes, setLoading) {
    setLoading(true);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/product/myQuotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch quotes.");
        }

        const data = await response.json();
        setQuotes(data.requestHistory || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
}

export default function UserOrders() {
    const { session, refreshSession} = useContext(SessionContext);
    console.log(session);
    const token = getToken();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [respondingId, setRespondingId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            localStorage.clear();
            refreshSession();
            return;
        }

        getQuotes(token, setQuotes, setLoading);
    }, [token, refreshSession, session]);

    // Handle Khalti Payment Initiation on Quote Acceptance
    const handleAcceptAndPayWithKhalti = async (quote) => {
        setError('');
        setRespondingId(quote.id);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/khalti-initiate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    quoteId: quote.id,
                    amount: quote.totalPrice,
                    orderName: quote.name,
                    customerInfo: session
                })
            });

            const data = await response.json();

            if (!response.ok || !data.payment_url) {
                throw new Error(data.message || "Failed to initiate Khalti payment.");
            }

            // Redirect user to Khalti sandbox payment page
            window.location.href = data.payment_url;
        } catch (err) {
            setError(err.message);
            setRespondingId(null);
        }
    };

    // Handle Reject / Decline Quote
    const respond = useCallback(async (id, action) => {
        setError('');
        setRespondingId(id);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product/quotes/${id}/respond`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ action })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to respond to quote.");
            }

            await getQuotes(token, setQuotes, setLoading);
        } catch (err) {
            setError(err.message);
        } finally {
            setRespondingId(null);
        }
    }, [token]);

    const filteredQuotes = quotes.filter((request) => {
        const matchesStatus =
              statusFilter === "all" || request.status === statusFilter;
        const matchesSearch =
              request.name?.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="quotes-section" id="your-quotes">
                    <div className="admin-panel">
                        <div className="panel-header">
                            <div className="panel-title">Your Quotes</div>
                        </div>
                        <p className="admin-page-sub" style={{ padding: "20px" }}>
                            Loading your quotes…
                        </p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (quotes.length === 0) {
        return (
            <>
                <Navigation />
                <div className="quotes-section" id="your-quotes">
                    <div className="admin-panel">
                        <div className="panel-header">
                            <div className="panel-title">Your Quotes</div>
                        </div>
                        <p className="admin-page-sub" style={{ padding: "20px" }}>
                            Nothing here yet — once we price one of your requested items, it'll show up here for you to accept or decline.
                        </p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navigation />
            <div className="quotes-section" id="your-quotes">
                <div className="admin-panel">
                    <div className="panel-header">
                        <div className="panel-title">Your Quotes</div>
                    </div>

                    {error && <p className="popup-error" style={{ padding: "0 20px", color: "red" }}>{error}</p>}

                    <div className="order-filter">
                        <label htmlFor="statusFilter">Filter:</label>

                        <select
                            id="statusFilter"
                            className="order-filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            {Object.entries(STATUS_DISPLAY).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value.label}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            className="order-search"
                            placeholder="Search by item name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Category</th>
                                    <th>Source</th>
                                    <th>Total</th>
                                    <th>Action / Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuotes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                                            No quotes found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredQuotes.map(q => (
                                        <tr key={q.id}>
                                            <td>
                                                {q.url ? (
                                                    <a href={q.url} target="_blank" rel="noreferrer">{q.name}</a>
                                                ) : (
                                                    q.name
                                                )}
                                            </td>
                                            <td>{q.category ?? "—"}</td>
                                            <td>{q.country ?? "—"}</td>
                                            <td>NRS {q.totalPrice ? q.totalPrice.toFixed(2) : "—"}</td>
                                            <td>
                                                {q.status === "pending" ? (
                                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                        <button
                                                            className="admin-btn-primary"
                                                            disabled={respondingId === q.id}
                                                            onClick={() => handleAcceptAndPayWithKhalti(q)}
                                                            style={{
                                                                backgroundColor: '#5c2d91',
                                                                color: '#fff',
                                                                cursor: respondingId === q.id ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >
                                                            {respondingId === q.id ? 'Redirecting...' : 'Khalti'}
                                                        </button>
                                                        <button
                                                            className="admin-btn-ghost"
                                                            disabled={respondingId === q.id}
                                                            onClick={() => respond(q.id, "reject")}
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`status-pill ${STATUS_DISPLAY[q.status]?.className ?? ""}`}>
                                                        {STATUS_DISPLAY[q.status]?.label ?? q.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <br />
            <Footer />
        </>
    );
}
