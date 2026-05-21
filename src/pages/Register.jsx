import '../css/Login.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthSidebar from '../component/AuthSidebar.jsx'

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
        country:    '',
        address:    '',
        city:       '',
        postal:     '',
        password:   '',
    });
    const [showPass, setShowPass] = useState(false);

    const strength = getStrength(form.password);

    function update(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function handleSubmit() {
        // TODO: wire up your registration logic here
        console.log(form);
    }

    return (
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

                    {/* PHONE + COUNTRY */}
                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="reg-phone">Phone number</label>
                            <input
                                id="reg-phone"
                                type="tel"
                                placeholder="+977 98XXXXXXXX"
                                value={form.phone}
                                onChange={e => update('phone', e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="reg-country">Country</label>
                            <select
                                id="reg-country"
                                value={form.country}
                                onChange={e => update('country', e.target.value)}
                            >
                                <option value="">Select country</option>
                                <option value="NP">Nepal</option>
                                <option value="IN">India</option>
                                <option value="CN">China</option>
                                <option value="US">United States</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
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

                    {/* CITY + POSTAL */}
                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="reg-city">City</label>
                            <input
                                id="reg-city"
                                type="text"
                                placeholder="Kathmandu"
                                value={form.city}
                                onChange={e => update('city', e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="reg-postal">Postal / ZIP code</label>
                            <input
                                id="reg-postal"
                                type="text"
                                placeholder="44600"
                                value={form.postal}
                                onChange={e => update('postal', e.target.value)}
                            />
                        </div>
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
    );
}
