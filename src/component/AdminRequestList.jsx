import '../css/Home.css'
import '../css/Admin.css'


import ProductPopup from '../component/AdminForm.jsx';

import { SessionContext } from '../component/SessionProvider.jsx';
import { getToken } from '../imports/jwt.js'

import { useState, useEffect, useContext } from 'react'


const STATUS_DISPLAY = {
    pending:  { label: "Quoted",   className: "status-pending" },
    accepted: { label: "Accepted", className: "status-shipped" },
    rejected: { label: "Rejected", className: "status-cancelled" }
};

async function getRequests(token, pageNumber, setRequests, setTotalPages, setTotalRequests, setUnquotedCount) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/product/requests/${pageNumber}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch recent requests.");
        }

        const data = await response.json();
        setRequests(data.requests);
        setTotalPages(data.totalPages);
        setTotalRequests(data.totalRequests);
        setUnquotedCount(data.unquotedCount);

    } catch (err) {
        console.error(err);
    }

}

export default function RequestList({ onCountsChange }){
    const { refreshSession } = useContext(SessionContext);
    const token = getToken();

    // todo: somehow extract tihs logout flow. can't use logout.jsx as that's a hook
    //       remove this code dublication
    useEffect(() => {
        if (!token) {
            localStorage.clear();
            refreshSession();
        }
    }, [token, refreshSession]);

    const [showForm, setShowForm]     = useState(false);
    const [requests, setRequests] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRequests, setTotalRequests] = useState(0);
    const [unquotedCount, setUnquotedCount] = useState(0);

    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [selectedLinkId, setSelectedLinkId] = useState(null);

    useEffect(()=>{
        if (!token) return;
        getRequests(token, page, setRequests, setTotalPages, setTotalRequests, setUnquotedCount);
    },[page, token]);

    useEffect(() => {
        onCountsChange?.({ totalRequests, unquotedCount });
    }, [totalRequests, unquotedCount, onCountsChange]);

    function verifyRequest(requestId, linkId){
        setSelectedRequestId(requestId);
        setSelectedLinkId(linkId);
        setShowForm(true);
    };

    // Patch the affected row's status in place once a quote is sent or an
    // item is rejected, so the table reflects it immediately without a refetch.
    function handleResponded(requestDetail) {
        if (!requestDetail) return;

        setRequests(prev => prev.map(r =>
            r.linkId === requestDetail.link_id
                ? { ...r, status: requestDetail.status }
                : r
        ));
        setUnquotedCount(prev => Math.max(0, prev - 1));
    }

    return (
        <>
            {/* ORDERS TABLE */}
            <div className="admin-panel">
                <div className="panel-header">
                    <div className="panel-title">🛍️ Recent Orders</div>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <button className="panel-action" disabled={page===1} onClick={()=>setPage(page-1)}>← Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button className="panel-action" disabled={page===totalPages} onClick={()=>setPage(page+1)}>Next →</button>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Customer</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r, index) => (
                                <tr key={r.linkId + index}>
                                    <td className="order-id">{r.id}</td>
                                    <td>{r.customer}</td>
                                    <td><a href ={r.url} target="_blank" rel="noreferrer">{r.name}</a></td>
                                    <td>{r.quantity}</td>
                                    <td>
                                        {r.status === "unquoted" ? (
                                            <button onClick={() => verifyRequest(r.id, r.linkId)} className="admin-btn-primary" style={{background: "#005522"}}> Fill </button>
                                        ) : (
                                            <span className={`status-pill ${STATUS_DISPLAY[r.status]?.className ?? ""}`}>
                                                {STATUS_DISPLAY[r.status]?.label ?? r.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ProductPopup
                key={`${selectedRequestId}-${selectedLinkId}`}
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleResponded}
                requestId={selectedRequestId}
                linkId={selectedLinkId}
            />

        </>
    );
    
}
