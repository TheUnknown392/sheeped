import '../css/Home.css'
import '../css/Admin.css'

import sheeped from  '../assets/White-Stupid-Cute-Cartoon-Sheep.svg'

import RequestList from './AdminRequestList.jsx'
import UserPanel from '../component/AdminUserPanel.jsx'

import { SessionContext } from '../component/SessionProvider.jsx';
import { getToken } from '../imports/jwt.js'


import { useState, useEffect, useContext, useCallback } from 'react'


const TODAY = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

export default function AdminDashboard() {
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

    const [unquotedCount, setUnquotedCount] = useState(0);

    const handleCountsChange = useCallback(({ unquotedCount }) => {
        setUnquotedCount(unquotedCount);
    }, []);

    return (
        <div className="root">
        <div className="admin-body">

        {/* MAIN CONTENT */}
        <main className="admin-main">

            {/* PAGE HEADER */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Good morning, <em>Admin</em></h1>
                    <p className="admin-page-sub">
                        {TODAY} · {unquotedCount} {unquotedCount === 1 ? "order needs" : "orders need"} attention
                    </p>
                </div>
            </div>

            <RequestList onCountsChange={handleCountsChange} />

            {/* CHILL BREAK */}
            <div className="chill-break">
                <img src = {sheeped} style={{width: "30px", height: "30px"}} className="chill-sheep"></img>
                <div>
                    <div className="chill-title">Take a little <em>baa-reak...</em></div>
                    <div className="chill-sub">My wool is starting to block my eyessss.</div>
                </div>
            </div>
            <UserPanel />
        </main>
        </div>
        </div>
    );
}
