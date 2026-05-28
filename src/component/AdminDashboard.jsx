import '../css/Home.css'
import '../css/Admin.css'

import sheeped from  '../assets/White-Stupid-Cute-Cartoon-Sheep.svg'
import { useState } from 'react'

const recentOrders = [
    { id: '#1041', customer: 'Aarav S.', product: 'Pashmina Shawls',    source: 'Nepal', country: 'Nepal',  status: 'pending',   amount: '12,500' },
    { id: '#1040', customer: 'Priya M.', product: 'Spice Set (bulk)',    source: 'India', country: 'India',  status: 'sourcing',  amount: '34,000' },
    { id: '#1039', customer: 'Chen W.',  product: 'Electronics x50',     source: 'China', country: 'China',  status: 'shipped',   amount: '210,000' },
    { id: '#1038', customer: 'John D.',  product: 'Yoga Mats x20',       source: 'USA', country: 'USA',    status: 'pending',   amount: '58,000' },
    { id: '#1037', customer: 'Sita K.',  product: 'Thangka Paintings',   source: 'Nepal', country: 'Nepal',  status: 'cancelled', amount: '—' },
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
    const [activeNav, setActiveNav]   = useState('dashboard');
    const [activeTab, setActiveTab]   = useState('all');
    const [userSearch, setUserSearch] = useState('');

    const filteredUsers = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(userSearch.toLowerCase());
        const matchTab = activeTab === 'all' ||
                         (activeTab === 'admins' && u.role === 'admin') ||
                         (activeTab === 'users'  && u.role === 'user');
        return matchSearch && matchTab;
    });

    return (
        <div className="admin-root">
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

                    {/* STAT CARDS */}
                    <div className="admin-stats-row">
                        <div className="admin-stat-card">
                            <div className="stat-card-label">🛍️ Total Orders</div>
                            <div className="stat-card-value">1,284</div>
                            <div className="stat-card-delta delta-up">↑ +12% this month</div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="stat-card-label">👥 Active Users</div>
                            <div className="stat-card-value">348</div>
                            <div className="stat-card-delta delta-up">↑ +8 this week</div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="stat-card-label">₨ Revenue (NRS)</div>
                            <div className="stat-card-value">4.2M</div>
                            <div className="stat-card-delta delta-up">↑ +18% vs last mo</div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="stat-card-label">⏱ Avg Quote Time</div>
                            <div className="stat-card-value">11h</div>
                            <div className="stat-card-delta delta-down">↓ Over 24h SLA!</div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="admin-quick-actions">
                        <div className="quick-action">
                            <div className="qa-icon qa-cyan">📋</div>
                            <div className="qa-label">Create Sourcing Request</div>
                            <div className="qa-sub">Manually raise a request</div>
                        </div>
                        <div className="quick-action">
                            <div className="qa-icon qa-green">👤+</div>
                            <div className="qa-label">Add User</div>
                            <div className="qa-sub">Invite or create manually</div>
                        </div>
                        <div className="quick-action">
                            <div className="qa-icon qa-purple">✉️</div>
                            <div className="qa-label">Send Quote</div>
                            <div className="qa-sub">Respond to a request</div>
                        </div>
                    </div>

                    {/* ORDERS + CHARTS ROW */}
                    <div className="admin-grid-2">

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
                                            <th>Product</th>
                                            <th>Source</th>
                                            <th>Status</th>
                                            <th>NRS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(o => (
                                            <tr key={o.id}>
                                                <td className="order-id">{o.id}</td>
                                                <td>{o.customer}</td>
                                                <td>{o.product}</td>
                                                <td>{o.source} {o.country}</td>
                                                <td>
                                                    <span className={`status-pill ${statusClass[o.status]}`}>
                                                        <span className="status-dot" />
                                                        {statusLabel[o.status]}
                                                    </span>
                                                </td>
                                                <td className="order-amount">{o.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* BAR CHART */}
                            <div className="admin-panel">
                                <div className="panel-header">
                                    <div className="panel-title">📊 Orders by Month</div>
                                </div>
                                <div className="chart-area">
                                    {[['Dec',55],['Jan',40],['Feb',65],['Mar',50],['Apr',75],['May',90]].map(([m, h]) => (
                                        <div className="bar-col" key={m}>
                                            <div className={`bar${m === 'May' ? ' bar-accent' : ''}`} style={{ height: `${h}%` }} />
                                            <div className={`bar-label${m === 'May' ? ' bar-label-accent' : ''}`}>{m}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SOURCE COUNTRIES */}
                            <div className="admin-panel">
                                <div className="panel-header">
                                    <div className="panel-title">🌏 Source Countries</div>
                                </div>
                                {[['🇳🇵','Nepal',62],['🇨🇳','China',21],['🇮🇳','India',12],['🇺🇸','USA',5]].map(([flag, name, pct]) => (
                                    <div className="source-row" key={name}>
                                        <span>{flag}</span>
                                        <span style={{ minWidth: 48 }}>{name}</span>
                                        <div className="source-bar-track">
                                            <div className="source-bar-fill" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="source-pct">{pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CHILL BREAK */}
                    <div className="chill-break">
                        <img src = {sheeped} style={{width: "30px", height: "30px"}} className="chill-sheep"></img>
                        <div>
                            <div className="chill-title">Taking a little <em>baa-reak...</em></div>
                            <div className="chill-sub">Even admins need to breathe. Take a break. Maybe, have a kitkat.</div>
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
