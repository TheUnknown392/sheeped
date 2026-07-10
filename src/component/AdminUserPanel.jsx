import { useState, useEffect, useContext } from 'react'
import { SessionContext } from '../component/SessionProvider.jsx'
import { getToken } from '../imports/jwt.js'

async function getUsers(token, page, search, role) {
    const params = new URLSearchParams({
        page,
        limit: 10,
        search,
        role
    });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users?${params}`,{
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    
    return response.json();
}

export default function UserPanel(){
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

    const [users, setUsers] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [userSearch, setUserSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        if (!token) return;

        async function loadUsers() {
            const data = await getUsers(
                token,
                page,
                userSearch,
                activeTab
            );

            setUsers(data.users);
            setTotalPages(data.totalPages);
        }

        loadUsers();
    }, [page, userSearch, activeTab, token]);
    
    return (
        <>
            {/* USERS PANEL */}
            <div className="admin-panel">
                <div className="panel-header">
                    <div className="panel-title">👥 Users</div>
                </div>

                <div style={{ padding: '12px 20px 0' }}>
                    <div className="admin-search-bar">
                        🔍
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={userSearch}
                            onChange={(e) => {
                                setUserSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="admin-tabs">
                        {["all", "admin", "user"].map((t) => (
                            <button
                                key={t}
                                className={`admin-tab ${activeTab === t ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTab(t);
                                    setPage(1);
                                }}
                            >
                                {t === "all"
                                 ? "All"
                                 : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    {users.map((u) => (
                        <div className="user-row" key={u._id}>
                            <div className="user-avatar">
                                {`${u.firstName[0]}${u.lastName[0]}`.toUpperCase()}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="user-name">
                                    {u.firstName} {u.lastName}

                                    <span
                                        className={`role-badge ${
                                        u.role === "admin"
                                            ? "role-admin"
                                            : "role-user"
                                    }`}
                                    >
                                        {u.role}
                                    </span>
                                </div>

                                <div className="user-email">
                                    {u.email}
                                </div>
                            </div>
                        </div>
                    ))}

                    {users.length === 0 && (
                        <div
                            style={{
                                padding: "20px",
                                textAlign: "center",
                                color: "var(--muted)",
                                fontSize: 13,
                            }}
                        >
                            No users found.
                        </div>
                    )}
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        padding: "20px",
                    }}
                >
                    <button
                        className="panel-action"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        className="panel-action"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
