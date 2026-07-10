import "../css/Home.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Navigation from "../component/Navigation.jsx";
import { getToken } from "../imports/jwt.js";


export default function UserProfile() {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        const token = getToken();
        if(!token){
            navigate("/");
            return;
        }
        try {

            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }
            setForm({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        }
        catch {

            setError("Unable to load profile.");

        }
        finally {

            setLoading(false);

        }

    }

    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }

    async function saveProfile(e) {

        e.preventDefault();

        setMessage("");
        setError("");
        console.log("password:", JSON.stringify(form.password));
        console.log("confirm:", JSON.stringify(form.confirmPassword));

        if (form.currentPassword.trim() === "") {
            setError("Please enter your current password.");
            return;
        }

        if (
            form.newPassword.trim() !== "" ||
                form.confirmPassword.trim() !== ""
        ) {
            if (form.newPassword !== form.confirmPassword) {
                setError("New passwords do not match.");
                return;
            }
        }
        
        const token = getToken();
        if(!token){
            navigate("/");
            return;
        }
        try {

            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },

                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    phone: form.phone,
                    address: form.address,
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage(data.message);

            setForm({
                ...form,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        }
        catch {

            setError("Unable to update profile.");

        }

    }

    if (loading) {

        return (
            <>
                <Navigation />
                <div className="section">
                    <div className="card">
                        <h2 className="card-title">Loading...</h2>
                    </div>
                </div>
            </>
        );

    }

    return (

        <>
            <Navigation />

            <section className="section">

                <div className="main-grid">

                    <div className="card">

                        <h2 className="card-title">
                            My Profile
                        </h2>

                        <p className="card-sub">
                            Update your account information.
                        </p>

                        {message && (
                            <div
                                style={{
                                    marginBottom: 20,
                                    color: "#4ade80",
                                    fontWeight: 600
                                }}
                            >
                                {message}
                            </div>
                        )}

                        {error && (
                            <div
                                style={{
                                    marginBottom: 20,
                                    color: "#ff7272",
                                    fontWeight: 600
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={saveProfile}>

                            <div className="field">
                                <label>First Name</label>

                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <label>Last Name</label>

                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <label>Email</label>

                                <input
                                    value={form.email}
                                    disabled
                                />

                                <div className="field-hint">
                                    Email cannot be changed.
                                </div>
                            </div>

                            <div className="field">
                                <label>Phone Number</label>

                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <label>Address</label>

                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <label>Current Password *</label>

                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>New Password</label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    placeholder="Leave blank to keep your current password"
                                />
                            </div>

                            <div className="field">
                                <label>Confirm New Password</label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    placeholder="Leave blank to keep your current password"
                                />
                            </div>
                            <button
                                className="btn-submit"
                                type="submit"
                            >
                                Save Changes
                            </button>

                        </form>

                    </div>

                    <div className="sidebar">

                        <div className="card">

                            <h3 className="recent-title">
                                Account Information
                            </h3>

                            <div className="recent-item">
                                <div className="recent-icon">
                                    👤
                                </div>

                                <div>
                                    <div className="recent-name">
                                        {form.firstName} {form.lastName}
                                    </div>

                                    <div className="recent-time">
                                        {form.email}
                                    </div>
                                </div>

                            </div>

                            <div className="recent-item">

                                <div className="recent-icon">
                                    📞
                                </div>

                                <div>

                                    <div className="recent-name">
                                        Phone
                                    </div>

                                    <div className="recent-time">
                                        {form.phone}
                                    </div>

                                </div>

                            </div>

                            <div className="recent-item">

                                <div className="recent-icon">
                                    📍
                                </div>

                                <div>

                                    <div className="recent-name">
                                        Address
                                    </div>

                                    <div className="recent-time">
                                        {form.address}
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="card">

                            <h3 className="why-title">
                                Tips
                            </h3>

                            <div className="why-item">
                                Leave the password fields empty if you don't want to change your password.
                            </div>

                            <div className="why-item">
                                Your email address cannot be changed.
                            </div>

                            <div className="why-item">
                                Click "Save Changes" after updating your information.
                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </>

    );

}
