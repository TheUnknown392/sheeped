import '../css/Login.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthSidebar from '../component/AuthSidebar.jsx'

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    async function handleSubmit() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/signin`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email    : email,
                password : password
            })
        });
        if(response.status == 200){
            const data = await response.json();
            localStorage.setItem("token", data.token);
            navigate("/");
        }
        
        setPassword("");
        setShowPass("");
        setEmail("");
    }

    return (
        <div className="auth-page">
            <div className="auth-body">
                <div className="auth-card">
                    <span className="auth-label">Welcome back</span>
                    <h1 className="auth-title">
                        Log in to <em>Sheeped</em>
                    </h1>
                    <p className="auth-sub">
                        Track your orders, manage sourcing requests and more.
                    </p>

                    <div className="field">
                        <label htmlFor="login-email">Email address</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="login-pass">Password</label>
                        <div className="pass-wrap">
                            <input
                                id="login-pass"
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button
                                className="pass-toggle"
                                onClick={() => setShowPass(v => !v)}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? 's' : 'n'}
                            </button>
                        </div>
                    </div>

                    <div className="forgot-row">
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>

                    <button className="btn-submit" onClick={handleSubmit}>
                        Log in
                    </button>

                    <div className="auth-divider">
                        <div className="divider-line" />
                        <span>or</span>
                        <div className="divider-line" />
                    </div>

                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <button className="btn-ghost-full">
                            Create a new account →
                        </button>
                    </Link>

                    <p className="auth-terms">
                        By logging in you agree to our{' '}
                        <a href="#">Terms of Service</a> and{' '}
                        <a href="#">Privacy Policy</a>.
                    </p>
                </div>

                <AuthSidebar />
            </div>
        </div>
    );
}
