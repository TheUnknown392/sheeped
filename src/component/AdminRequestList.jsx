import '../css/Home.css'
import '../css/Admin.css'

import ProductPopup from '../component/AdminForm.jsx';

import { SessionContext } from '../component/SessionProvider.jsx';
import { getToken } from '../imports/jwt.js'

import { useState, useEffect, useContext, useMemo, useRef } from 'react'


const STATUS_DISPLAY = {
    waiting:  { label: "Quoted",   className: "status-pending" },
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

async function getCategories(token, setCategories) {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/category`, {
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data || []);
    } catch (e) {
        console.error(e);
        setCategories([]);
    }
}

async function getCountries(token, setCountries) {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/country`, {
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }
        });
        if (!res.ok) throw new Error("Failed to fetch countries");
        const data = await res.json();
        setCountries(data || []);
    } catch (e) {
        console.error(e);
        setCountries([]);
    }
}

/*
  Simple inline searchable select component.
  Props:
    - options: array of { _id, name } or { id, name } objects
    - value: selected id (string|null)
    - onChange: function(newOptionObject|null)
    - placeholder: string
*/
function SearchableSelect({ options = [], value = null, onChange, placeholder = "Select..." }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef();

    useEffect(() => {
        function onDoc(e) {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);

    const normalized = query.trim().toLowerCase();
    const filtered = normalized === ""
        ? options
        : options.filter(o => (o.name || o.category_name || "").toLowerCase().includes(normalized));

    const selectedObj = options.find(o => (o._id ?? o.id)?.toString() === (value ?? "").toString()) ?? null;

    return (
        <div className="searchable-select" ref={containerRef} style={{ position: "relative", minWidth: 200 }}>
            <button
                type="button"
                className="searchable-select-toggle"
                onClick={() => setOpen(s => !s)}
                aria-haspopup="listbox"
                aria-expanded={open}
                style={{ width: "100%", textAlign: "left", padding: "8px" }}
            >
                {selectedObj ? (selectedObj.name ?? selectedObj.category_name) : placeholder}
                <span style={{ float: "right" }}>{open ? "▴" : "▾"}</span>
            </button>

            {open && (
                <div className="searchable-select-panel" style={{ position: "absolute", zIndex: 40, background: "#fff", border: "1px solid #ddd", width: "100%", maxHeight: 220, overflow: "auto", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
                    <div style={{ padding: 8 }}>
                        <input
                            type="text"
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search..."
                            className="searchable-select-input"
                            style={{ width: "100%", padding: "6px 8px", boxSizing: "border-box" }}
                        />
                    </div>

                    <ul role="listbox" aria-label={placeholder} style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {filtered.length === 0 ? (
                            <li style={{ padding: 10, color: "#666" }}>No results.</li>
                        ) : filtered.map(opt => {
                            const id = opt._id ?? opt.id;
                            return (
                                <li key={id} role="option" onClick={() => { onChange(opt); setOpen(false); setQuery(""); }} style={{ padding: 10, cursor: "pointer", borderTop: "1px solid #f0f0f0" }}>
                                    {opt.name ?? opt.category_name}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
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

    // new filter state
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState(null); // will hold full object
    const [countryFilter, setCountryFilter] = useState(null);   // will hold full object

    // categories & countries for dropdowns
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);

    useEffect(()=>{
        if (!token) return;
        getRequests(token, page, setRequests, setTotalPages, setTotalRequests, setUnquotedCount);
        // fetch categories/countries for filters
        getCategories(token, setCategories);
        getCountries(token, setCountries);
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

    // Combined filtered requests
    const filteredRequests = useMemo(() => {
        const q = (searchText || "").trim().toLowerCase();

        return requests.filter(r => {
            // status
            if (statusFilter !== "all" && r.status !== statusFilter) return false;

            // category filter: compare by category name or id if available on r
            if (categoryFilter) {
                const catName = r.category ?? r.category_name ?? "";
                const catId = r.category_id ?? r.categoryId ?? r.categoryId;
                if (categoryFilter._id) {
                    if (catId && catId.toString() !== categoryFilter._id.toString()) return false;
                    // if no id on request, fallback to name compare
                    if (!catId && !catName.toLowerCase().includes((categoryFilter.category_name || categoryFilter.name || "").toLowerCase())) return false;
                } else {
                    if (!catName.toLowerCase().includes((categoryFilter.category_name || categoryFilter.name || "").toLowerCase())) return false;
                }
            }

            // country filter
            if (countryFilter) {
                const countryName = r.country ?? "";
                const countryId = r.country_id ?? r.countryId;
                if (countryFilter._id) {
                    if (countryId && countryId.toString() !== countryFilter._id.toString()) return false;
                    if (!countryId && !countryName.toLowerCase().includes((countryFilter.name || "").toLowerCase())) return false;
                }
            }

            // text search across name, customer, url
            if (q) {
                const name = (r.name || "").toLowerCase();
                const customer = (r.customer || "").toLowerCase();
                const url = (r.url || "").toLowerCase();
                const cat = (r.category || "").toLowerCase();
                const country = (r.country || "").toLowerCase();

                if (!(name.includes(q) || customer.includes(q) || url.includes(q) || cat.includes(q) || country.includes(q))) return false;
            }

            return true;
        });
    }, [requests, searchText, statusFilter, categoryFilter, countryFilter]);

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

                <div className="order-filter" style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0" }}>
                    <input
                        type="text"
                        placeholder="Search by item, customer, category..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="order-search"
                        style={{ minWidth: 200, padding: 8 }}
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        Status:
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 8 }}>
                            <option value="all">All</option>
                            {Object.entries(STATUS_DISPLAY).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                            <option value="unquoted">Unquoted</option>
                        </select>
                    </label>

                    <div style={{ minWidth: 220 }}>
                        <SearchableSelect
                            options={categories.map(c => ({ ...c, name: c.category_name ?? c.name }))}
                            value={categoryFilter?._id ?? null}
                            onChange={(opt) => setCategoryFilter(opt)}
                            placeholder="Filter by category"
                        />
                    </div>

                    <div style={{ minWidth: 220 }}>
                        <SearchableSelect
                            options={countries.map(c => ({ ...c, name: c.name }))}
                            value={countryFilter?._id ?? null}
                            onChange={(opt) => setCountryFilter(opt)}
                            placeholder="Filter by country"
                        />
                    </div>

                    <button type="button" className="panel-action" onClick={() => { setSearchText(""); setStatusFilter("all"); setCategoryFilter(null); setCountryFilter(null); }}>
                        Clear
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                                        No requests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((r, index) => (
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
                                ))
                            )}
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
