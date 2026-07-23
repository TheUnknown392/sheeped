import express from 'express';
import axios from 'axios';

const router = express.Router();

const KHALTI_INITIATE_URL = 'https://dev.khalti.com/api/v2/epayment/initiate/';
const KHALTI_LOOKUP_URL = 'https://dev.khalti.com/api/v2/epayment/lookup/';

const initiate = async (req, res) => {
    try {
        console.log("from initiate: ", req.body);
        
        const {quoteId, amount, orderName, customerInfo} = req.body;
        // Convert NPR to Paisa
        const amountInPaisa = Math.round(Number(amount) * 100);

        const payload = {
            return_url: `${process.env.CLIENT_URL}/payment-status`,
            website_url: process.env.CLIENT_URL,
            amount: amountInPaisa,
            purchase_order_id: String(quoteId),
            purchase_order_name: orderName || `Order #${quoteId}`,
            customer_info: {
                name: customerInfo?.firstName + " " + customerInfo?.lastName || 'College Student',
                email: customerInfo?.email || 'student@example.com',
                phone: "-" // we don't have it in session right now, email doesn't show if we don't keep phone
            },
        };

        const response = await axios.post(KHALTI_INITIATE_URL, payload, {
            headers: {
                Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        res.json({
            success: true,
            payment_url: response.data.payment_url,
            pidx: response.data.pidx,
        });
    } catch (error) {
        console.error('Khalti Initiate Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate Khalti payment',
        });
    }
}

const verify = async (req, res) => {
    try {
        const { pidx } = req.body;

        const response = await axios.post(
            KHALTI_LOOKUP_URL,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.status === 'Completed') {
            // TODO: Update order status in DB
            return res.json({
                success: true,
                status: 'Completed',
                data: response.data,
            });
        }

        res.json({
            success: false,
            status: response.data.status,
            data: response.data,
        });
    } catch (error) {
        console.error('Khalti Verification Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
        });
    }
}

export { initiate, verify };
