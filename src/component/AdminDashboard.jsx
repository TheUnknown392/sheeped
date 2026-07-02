import '../css/Home.css'
import '../css/Admin.css'

import sheeped from  '../assets/White-Stupid-Cute-Cartoon-Sheep.svg'

import ProductPopup from '../component/AdminForm.jsx';
import { SessionContext } from '../component/SessionProvider.jsx';
import { getToken } from '../imports/jwt.js'


import { useState, useEffect, useContext } from 'react'

const recentRequest = [
    { id: '#1041', customer: 'Aarav S.', name: 'Pashmina Shawls', country: 'Nepal',  status: 'pending',   amount: '12,500' },
    { id: '#1040', customer: 'Priya M.', name: 'Spice Set (bulk)', country: 'India',  status: 'sourcing',  amount: '34,000' },
    { id: '#1039', customer: 'Chen W.',  name: 'Electronics x50',      country: 'China',  status: 'shipped',   amount: '210,000' },
    { id: '#1038', customer: 'John D.',  name: 'Yoga Mats x20',        country: 'USA',    status: 'pending',   amount: '58,000' },
    { id: '#1037', customer: 'Sita K.',  name: 'Thangka Paintings',   country: 'Nepal',  status: 'cancelled', amount: '—' },
];

const users = [
    { initials: 'AS', name: 'Aarav Sharma',  email: 'aarav@sheeped.com',    role: 'admin', flag: 'Nepal', grad: 'linear-gradient(135deg,#a78bfa,#6ee7f7)' },
    { initials: 'PM', name: 'Priya Mehta',   email: 'priya.m@mail.com',     role: 'user',  flag: 'India', grad: 'linear-gradient(135deg,#4ade80,#6ee7f7)' },
    { initials: 'CW', name: 'Chen Wei',      email: 'chenw@outlook.com',    role: 'user',  flag: 'China', grad: 'linear-gradient(135deg,#fbbf24,#f87171)' },
    { initials: 'JD', name: 'John Doe',      email: 'john.doe@gmail.com',   role: 'user',  flag: 'USA', grad: 'linear-gradient(135deg,#60a5fa,#a78bfa)' },
    { initials: 'SK', name: 'Sita KC',       email: 'sitakc@proton.me',     role: 'user',  flag: 'Nepal', grad: 'linear-gradient(135deg,#f472b6,#a78bfa)' },
];

const activity = [
    { type: 'order',   icon: '🛍️', text: <><strong>New order #1041</strong> from Aarav Sharma — Pashmina Shawls</>,  time: '2 min ago' },
    { type: 'payment', icon: '💳', text: <><strong>Payment received</strong> NRS 210,000 for order #1039</>,          time: '18 min ago' },
    { type: 'user',    icon: '👤', text: <><strong>New user registered</strong> — Anjali Rai (NP)</>,                 time: '1 hr ago' },
    { type: 'alert',   icon: '⚠️', text: <><strong>SLA warning</strong> — Order #1038 quote overdue by 2h</>,        time: '2 hr ago' },
    { type: 'order',   icon: '🚚', text: <><strong>Order #1039 shipped</strong> — tracking added by team</>,          time: '4 hr ago' },
    { type: 'payment', icon: '📄', text: <><strong>Invoice #INV-284</strong> generated and sent to Chen Wei</>,       time: 'Yesterday' },
];

const statusClass = { pending: 'status-pending', sourcing: 'status-sourcing', shipped: 'status-shipped', cancelled: 'status-cancelled' };
const statusLabel  = { pending: 'Pending', sourcing: 'Sourcing', shipped: 'Shipped', cancelled: 'Cancelled' };
const activityClass = { order: 'activity-order', payment: 'activity-payment', user: 'activity-user', alert: 'activity-alert' };



export default function AdminDashboard() {
    const { refreshSession } = useContext(SessionContext);
    const token = getToken();

    // todo: somehow extract tihs logout flow. can't use logout.jsx as that's a hook
    //       remove this code dublication
    if(!token){
        localStorage.clear();
        refreshSession();
        return;
    }

    const [showForm, setShowForm]     = useState(false);
    const [activeNav, setActiveNav]   = useState('dashboard');
    const [activeTab, setActiveTab]   = useState('all');
    const [userSearch, setUserSearch] = useState('');

    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);

    var request_id = ""; // Todo
    useEffect(() => {
        getCategories();
        getCountries();
    }, []);

    async function getCategories() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get/category`,{
                method: "GET",
                headers: {
                    "Content-Type"  : "application/json",
                    "Authorization" : "Bearer " + token
                }
            }
                                        );

            if (!response.ok) {
                throw new Error("Failed to fetch categories.");
                console.log("unable to get categories");
            }

            const data = await response.json();
            setCategories(data);
            console.log("category:", data);
        } catch (err) {
            console.error(err);
        }
    }

    async function getCountries() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get/country`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : "Bearer " + token
                }
            }
                                        );

            if (!response.ok) {
                throw new Error("Failed to fetch countries.");
                console.log("unable to get countries");
            }

            const data = await response.json();
            setCountries(data);
            console.log("countries:", data);
        } catch (err) {
            console.error(err);
        }
    }
    const filteredUsers = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
              u.email.toLowerCase().includes(userSearch.toLowerCase());
        const matchTab = activeTab === 'all' ||
              (activeTab === 'admins' && u.role === 'admin') ||
              (activeTab === 'users'  && u.role === 'user');
        return matchSearch && matchTab;
    });
    
    // todo: I want this to open another form so we can put all the requestDetail datas
    function verifyRequest(id){
        setShowForm(true);
        request_id = id;
        console.log(request_id);
    };

    function requestUpdate(){
        console.log("requestUpdate");
    }
    
    return (
        <div className="root">
        <div className="admin-body">

        {/* MAIN CONTENT */}
        <main className="admin-main">

            {/* PAGE HEADER */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Good morning, <em>Admin</em></h1>
                    <p className="admin-page-sub">Saturday, May 23 2026 · 7 orders need attention</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-btn-ghost">⬇ Export</button>
                    <button className="admin-btn-primary">＋ New Order</button>
                </div>
            </div>


            {/* ORDERS TABLE */}
            <div className="admin-panel">
                <div className="panel-header">
                    <div className="panel-title">🛍️ Recent Orders</div>
                    <button className="panel-action">View all →</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Name</th>
                                <th>Source</th>
                                <th>Status</th>
                                <th>NRS</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequest.map(r => (
                                <tr key={r.id}>
                                    <td className="order-id">{r.id}</td>
                                    <td>{r.customer}</td>
                                    <td>{r.name}</td>
                                    <td>{r.country}</td>
                                    <td>
                                        <span className={`status-pill ${statusClass[r.status]}`}>
                                            <span className="status-dot" />
                                            {statusLabel[r.status]}
                                        </span>
                                    </td>
                                    <td className="order-amount">{r.amount}</td>
                                    <td>
                                        <button onClick={() => verifyRequest(r.id)} className="admin-btn-primary" style={{background: "#005522"}}> Fill </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ProductPopup
                isOpen={showForm}
                country={countries}
                category={categories}
                onClose={() => setShowForm(false)}
                onSubmit={requestUpdate}
            />
            {/* CHILL BREAK */}
            <div className="chill-break">
                <img src = {sheeped} style={{width: "30px", height: "30px"}} className="chill-sheep"></img>
                <div>
                    <div className="chill-title">Take a little <em>baa-reak...</em></div>
                    <div className="chill-sub">My wool is starting to block my eyessss.</div>
                </div>
            </div>

            {/* USERS + ACTIVITY ROW */}
            <div className="admin-grid-2">

                {/* USERS PANEL */}
                <div className="admin-panel">
                    <div className="panel-header">
                        <div className="panel-title">👥 Users</div>
                        <button className="panel-action">Manage →</button>
                    </div>
                    <div style={{ padding: '12px 20px 0' }}>
                        <div className="admin-search-bar">
                            🔍
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                            />
                        </div>
                        <div className="admin-tabs">
                            {['all','admins','users','suspended'].map(t => (
                                <button key={t} className={`admin-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        {filteredUsers.map(u => (
                            <div className="user-row" key={u.email}>
                                <div className="user-avatar" style={{ background: u.grad }}>{u.initials}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="user-name">
                                        {u.name}
                                        <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                            {u.role}
                                        </span>
                                    </div>
                                    <div className="user-email">{u.email}</div>
                                </div>
                                <span>{u.flag}</span>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No users found.</div>
                        )}
                    </div>
                </div>

                {/* ACTIVITY FEED */}
                <div className="admin-panel">
                    <div className="panel-header">
                        <div className="panel-title">⚡ Live Activity</div>
                        <span className="live-dot" title="Live" />
                    </div>
                    <div>
                        {activity.map((a, i) => (
                            <div className="activity-item" key={i}>
                                <div className={`activity-icon ${activityClass[a.type]}`}>{a.icon}</div>
                                <div className="activity-text">
                                    {a.text}
                                    <div className="activity-time">{a.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </main>
        </div>
        </div>
    );
}
