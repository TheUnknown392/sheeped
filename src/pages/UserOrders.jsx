import '../css/Home.css'
import '../css/Admin.css'

import { useState, useEffect, useContext, useCallback } from 'react'

import Navigation from '../component/Navigation.jsx'

import { SessionContext } from '../component/SessionProvider.jsx';
import { getToken } from '../imports/jwt.js'


const STATUS_DISPLAY = {
    accepted: { label: "Accepted", className: "status-shipped" },
    rejected: { label: "Declined", className: "status-cancelled" }
};

async function getQuotes(token, setQuotes, setLoading) {
    setLoading(true);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/product/quotes`,{
            method: "GET",
            headers: {
                "Content-Type"  : "application/json",
                "Authorization" : "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch quotes.");
        }

        const data = await response.json();
        setQuotes(data.quotes);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
}

export default function UserOrders() {
    const { refreshSession } = useContext(SessionContext);
    const token = getToken();

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
    }, [token, refreshSession]);

    const respond = useCallback(async (id, action) => {
        setError('');
        setRespondingId(id);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product/quotes/${id}/respond`,{
                method: "POST",
                headers: {
                    "Content-Type"  : "application/json",
                    "Authorization" : "Bearer " + token
                },
                body: JSON.stringify({ action })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to respond to quote.");
            }

            setQuotes(prev => prev.map(q =>
                q.id === id ? { ...q, status: action === "accept" ? "accepted" : "rejected" } : q
            ));
        } catch (err) {
            setError(err.message);
        } finally {
            setRespondingId(null);
        }
    }, [token]);

    if (loading) {
        return (
            <div className="quotes-section" id="your-quotes">
                <div className="admin-panel">
                    <div className="panel-header">
                        <div className="panel-title">📦 Your Quotes</div>
                    </div>
                    <p className="admin-page-sub" style={{padding: "20px"}}>Loading your quotes…</p>
                </div>
            </div>
        );
    }

    if (quotes.length === 0) {
        return (
            <div className="quotes-section" id="your-quotes">
                <div className="admin-panel">
                    <div className="panel-header">
                        <div className="panel-title">📦 Your Quotes</div>
                    </div>
                    <p className="admin-page-sub" style={{padding: "20px"}}>
                        Nothing here yet — once we price one of your requested items, it'll show up here for you to accept or decline.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navigation />
            <div className="quotes-section" id="your-quotes">
                <div className="admin-panel">
                    <div className="panel-header">
                        <div className="panel-title">📦 Your Quotes</div>
                    </div>

                    {error && <p className="popup-error" style={{padding: "0 20px"}}>{error}</p>}

                    <div style={{ overflowX: 'auto' }}>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Category</th>
                                    <th>Source</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotes.map(q => (
                                    <tr key={q.id}>
                                        <td>{q.url ? <a href={q.url} target="_blank" rel="noreferrer">{q.name}</a> : q.name}</td>
                                        <td>{q.category ?? "—"}</td>
                                        <td>{q.country ?? "—"}</td>
                                        <td>NRS {q.totalPrice?.toFixed(2) ?? "—"}</td>
                                        <td>
                                            {q.status === "pending" ? (
                                                <div style={{display: "flex", gap: "8px"}}>
                                                    <button
                                                        className="admin-btn-primary"
                                                        disabled={respondingId === q.id}
                                                        onClick={() => respond(q.id, "accept")}
                                                    >
                                                        Accept
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
