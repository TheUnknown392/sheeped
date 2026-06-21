import '../css/Login.css'
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Popup from '../component/Popup.jsx'
import AuthSidebar from '../component/AuthSidebar.jsx'

import { SessionContext } from '../component/SessionProvider.jsx'

function getStrength(password) {
    let score = 0;
    if (password.length >= 8)          score++;
    if (/[A-Z]/.test(password))        score++;
    if (/[0-9]/.test(password))        score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score; 
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthClass  = ['', 'weak', 'ok',   'ok',   'strong'];

export default function Register() {
    const [form, setForm] = useState({
        firstName:  '',
        lastName:   '',
        email:      '',
        phone:      '',
        address:    '',
        password:   '',
    });
    const [showPass, setShowPass] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const { refreshSession } = useContext(SessionContext);
    

    const strength = getStrength(form.password);

    const navigate = useNavigate();

    function update(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSubmit() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/signup`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: form.firstName,
                lastName : form.lastName,
                email    : form.email,
                phone    : form.phone,
                address  : form.address,
                password : form.password
            })
        });
	    
	    const data = await response.json();
        if(response.status == 200){
            localStorage.setItem("token", data.token);
	        refreshSession();
            navigate("/");
        }else{
	        setMessage(data.message);
	        setOpen(true);
	    }

        console.log(response.status);
        console.log(form);
    }

    return (
	<>
            <div className="auth-page">
		<div className="auth-body">
                    <div className="auth-card wide">

			<div className="auth-badge">
                            <div className="auth-badge-dot" />
                            Free to join
			</div>

			<span className="auth-label">New account</span>
			<h1 className="auth-title">
                            Create your <em>wishlist</em>
			</h1>
			<p className="auth-sub">
                            Start sourcing globally — products from Nepal, India, China &amp; America.
			</p>

			{/* NAME ROW */}
			<div className="field-row">
                            <div className="field">
				<label htmlFor="reg-first">First name</label>
				<input
                                    id="reg-first"
                                    type="text"
                                    placeholder="Aarav"
                                    value={form.firstName}
                                    onChange={e => update('firstName', e.target.value)}
				/>
                            </div>
                            <div className="field">
				<label htmlFor="reg-last">Last name</label>
				<input
                                    id="reg-last"
                                    type="text"
                                    placeholder="Sharma"
                                    value={form.lastName}
                                    onChange={e => update('lastName', e.target.value)}
				/>
                            </div>
			</div>

			{/* EMAIL */}
			<div className="field">
                            <label htmlFor="reg-email">Email address</label>
                            <input
				id="reg-email"
				type="email"
				placeholder="you@email.com"
				value={form.email}
				onChange={e => update('email', e.target.value)}
                            />
			</div>

			{/* PHONE */}
			<div className="field">
                            <label htmlFor="reg-phone">Phone number</label>
                            <input
				id="reg-phone"
				type="tel"
				placeholder="98XXXXXXXX"
				value={form.phone}
				onChange={e => update('phone', e.target.value)}
                            />
			</div>

			{/* ADDRESS */}
			<div className="field">
                            <label htmlFor="reg-address">Street address</label>
                            <input
				id="reg-address"
				type="text"
				placeholder="123 Durbar Marg, Kathmandu"
				value={form.address}
				onChange={e => update('address', e.target.value)}
                            />
			</div>
			{/* PASSWORD */}
			<div className="field">
                            <label htmlFor="reg-pass">Password</label>
                            <div className="pass-wrap">
				<input
                                    id="reg-pass"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    value={form.password}
                                    onChange={e => update('password', e.target.value)}
				/>
				<button
                                    className="pass-toggle"
                                    onClick={() => setShowPass(v => !v)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
				>
                                    {showPass ? '🙈' : '👁'}
				</button>
                            </div>

                            {/* STRENGTH BARS */}
                            {form.password.length > 0 && (
				<>
                                    <div className="strength-bars">
					{[0, 1, 2, 3].map(i => (
                                            <div
						key={i}
						className={`strength-bar${i < strength ? ` ${strengthClass[strength]}` : ''}`}
                                            />
					))}
                                    </div>
                                    <p className="field-hint">{strengthLabels[strength]}</p>
				</>
                            )}
			</div>

			{/* INFO BOX */}
			<div className="info-box">
                            <span className="info-box-icon">🚚</span>
                            <div className="info-box-text">
				<strong>Delivery address</strong>
				<span>This will be used as your default delivery address for all orders.</span>
                            </div>
			</div>

			<button className="btn-submit" onClick={handleSubmit}>
                            Create Account
			</button>

			<p className="auth-terms">
                            Already have an account?{' '}
                            <Link to="/login">Log in here</Link>.{' '}
                            By registering you agree to our{' '}
                            <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
			</p>
                    </div>

                    <AuthSidebar />
		</div>
            </div>
	    <Popup name="Forbidden"
		   content={message}
		   open={open}
		   onClose={() => setOpen(false)}
	    />
	</>
    );
}
