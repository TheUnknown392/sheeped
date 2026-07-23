import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navigation from '../component/Navigation.jsx';
import Footer from '../component/Footer.jsx';
import { getToken } from '../imports/jwt.js';

import '../css/Home.css';
import '../css/Admin.css';

export default function PaymentStatus() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = getToken();

    // Extract parameters sent by Khalti redirect
    const pidx = searchParams.get('pidx');
    const urlStatus = searchParams.get('status');
    const amount = searchParams.get('amount'); // In Paisa

    const [verifying, setVerifying] = useState(true);
    const [paymentState, setPaymentState] = useState({
        success: false,
        message: '',
        data: null,
    });

    useEffect(() => {
        // 1. If user canceled directly on Khalti page
        if (urlStatus === 'User canceled') {
            setVerifying(false);
            setPaymentState({
                success: false,
                message: 'Payment was canceled by the user.',
            });
            return;
        }

        // 2. If no pidx is present in URL
        if (!pidx) {
            setVerifying(false);
            setPaymentState({
                success: false,
                message: 'Invalid payment response. No transaction index found.',
            });
            return;
        }

        // 3. Perform server-side lookup verification
        const verifyPayment = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/khalti-verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({ pidx }),
                });

                const data = await response.json();

                if (response.ok && data.status === 'Completed') {
                    setPaymentState({
                        success: true,
                        message: 'Payment verified and quote accepted successfully!',
                        data,
                    });
                } else {
                    setPaymentState({
                        success: false,
                        message: data.message || `Payment status: ${data.status || 'Failed'}`,
                        data,
                    });
                }
            } catch (err) {
                console.error('Verification Error:', err);
                setPaymentState({
                    success: false,
                    message: 'Could not connect to backend to verify payment.',
                });
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [pidx, urlStatus, token]);

    return (
        <>
            <Navigation />
            <div className="quotes-section" style={{ minHeight: '60vh', padding: '40px 20px', marginTop: '10vh' }}>
                <div className="admin-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    
                    {verifying ? (
                        <div style={{ padding: '30px' }}>
                            <h2>⏳ Verifying Payment...</h2>
                            <p className="admin-page-sub">Please wait while we confirm your transaction with Khalti.</p>
                        </div>
                    ) : paymentState.success ? (
                        <div style={{ padding: '20px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                            <h2 style={{ color: '#2e7d32' }}>Payment Successful!</h2>
                            <p style={{ margin: '15px 0' }}>{paymentState.message}</p>
                            
                            {amount && (
                                <p><strong>Amount Paid:</strong> NRS {(Number(amount) / 100).toFixed(2)}</p>
                            )}

                            <div style={{ marginTop: '25px' }}>
                                <Link to="/UserOrders" className="admin-btn-primary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
                                    View Your Quotes & Orders
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '20px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>❌</div>
                            <h2 style={{ color: '#d32f2f' }}>Payment Unsuccessful</h2>
                            <p style={{ margin: '15px 0', color: '#555' }}>{paymentState.message}</p>

                            <div style={{ marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <Link to="/UserOrders" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
                                    Back to Orders
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </>
    );
}
