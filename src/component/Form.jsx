import '../css/Home.css'
import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import NavButton from '../component/NavButton.jsx'

const recentRequests = [
    { icon: "⌨️", name: "A48D — Mechanical Keyboard", time: "1 hour ago", badge: null, badgeClass: "badge-testing" },
    { icon: "🖥️", name: "A479 — Bamboo Desk Mat", time: "2 hours ago", badge: null },
    { icon: "🖱️", name: "A471 — Ergonomic Mouse", time: "3 hours ago", badge: null, badgeClass: "badge-sampled" },
];

export default function MainForm(){
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState([
        { name: "", url: "", qty: 1 }
    ]);

    function addItem() {
        setItems(prev => [...prev, { name: "", url: "", qty: 1 }]);
    }

    function updateItem(index, field, value) {
        setItems(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    }

    function removeItem(index) {
        setItems(prev => prev.filter((_, i) => i !== index));
    }

    function handleSubmit() {
        console.log({
            items,
            notes
        });
    }


    {/* MAIN FORM + SIDEBAR */}
    return(
        <div className="section">
            <span className="section-label">New Request</span>
            <h2 className="section-title">Find any product at,<br /><em className="serif" style={{fontStyle:'italic', color:'var(--accent)'}}>Nepal, India, China and America.</em></h2>
            <p className="section-sub">Enter details below to receive a custom quotation within 24 hours.</p>

            <div className="main-grid">
                {/* FORM */}
                <div className="card">
                    <div className="card-title">New Sourcing Request</div>
                    <div className="card-sub">
                        Enter details below to receive a custom quotation within 24 hours.
                    </div>

                    {/* MULTIPLE ITEMS */}
                    <label>Product URL(s) </label>
                    {items.map((item, index) => (
                        <div key={index} className="field" style={{ marginBottom: 18 }}>
                            <input
                                style={{marginBottom:5}}
                                value={item.name}
                                onChange={e =>
                                    updateItem(index, "name", e.target.value)
                                }
                                placeholder="dreamy item"
                            />
                            <input
                                value={item.url}
                                onChange={e =>
                                    updateItem(index, "url", e.target.value)
                                }
                                placeholder="https://mydreamitem.com/item"
                            />

                            
                            <div className="qty-row">
                                <button
                                    className="qty-btn"
                                    onClick={() =>
                                        updateItem(
                                            index,
                                            "qty",
                                            Math.max(1, item.qty - 1)
                                        )
                                    }
                                >
                                    −
                                </button>

                                <div className="qty-val">{item.qty}</div>

                                <button
                                    className="qty-btn"
                                    onClick={() =>
                                        updateItem(index, "qty", item.qty + 1)
                                    }
                                >
                                    +
                                </button>

                                <button
                                    className="qty-btn"
                                    onClick={() => removeItem(index)}
                                    style={{ marginLeft: "auto", padding: 5 }}
                                >
                                    x
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* ADD ITEM BUTTON */}
                    <button
                        className="btn-secondary"
                        onClick={addItem}
                        style={{
                            marginBottom:14,background:'var(--surface2)',
                            border:'1px solid var(--border)', borderRadius:8,
                            padding:'9px', color:'var(--text)', cursor:'pointer',
                            fontSize:13, fontFamily:'DM Sans, sans-serif'
                            
                        }}
                    >
                        + Add another product
                    </button>

                    {/* PRIORITY BOX */}
                    <div className="priority-box">
                        <div className="priority-icon"></div>
                        <div className="priority-text">
                            <strong>Priority Logistics</strong>
                            <br />
                            <span style={{ fontSize: "13px" }}>
                                Please email directly if items cost more than 2 Lakhs
                            </span>
                        </div>
                    </div>

                    {/* NOTES */}
                    <div className="field">
                        <label>Additional Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Specify size, color preferences, custom packaging or other requirement or delivery"
                        />
                    </div>

                    {/* SUBMIT */}
                    <button className="btn-submit" onClick={handleSubmit}>
                        Request Quote for {items.length} Item
                        {items.length !== 1 ? "s" : ""}
                    </button>
                </div>
                {/* SIDEBAR */}
                <div className="sidebar">
                    <div className="card recent-card">
                        <div className="recent-title">Recent Requests</div>
                        {recentRequests.map(r => (
                            <div className="recent-item" key={r.name}>
                                <div className="recent-icon">{r.icon}</div>
                                <div>
                                    <div className="recent-name">{r.name}</div>
                                    <div className="recent-time">{r.time}</div>
                                </div>
                                {r.badge && (
                                    <span className={`recent-badge ${r.badgeClass}`}>{r.badge}</span>
                                )}
                            </div>
                        ))}
                        <NavButton text="Sign in for your own international wishlist" to="/login" style={{
                                       marginTop:24, width:'100%', background:'var(--surface2)',
                                       border:'1px solid var(--border)', borderRadius:8,
                                       padding:'9px', color:'var(--text)', cursor:'pointer',
                                       fontSize:13, fontFamily:'DM Sans, sans-serif'
                                   }}
				   showWhenLoggedIn={false}
                        />
                    </div>

                    <div className="card why-card">
                        <div className="why-title">Why Sheeped?</div>
                        {[
                            "One upfront sourcing fee",
                            "Private label & blind shipping",
                            "Stress free Custom handleing",
                        ].map(w => (
                            <div className="why-item" key={w}>{w}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
