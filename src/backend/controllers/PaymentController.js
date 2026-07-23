import express from 'express';
import axios from 'axios';

import RequestDetail from '../models/RequestDetailModel.js';
import Request from '../models/RequestModel.js'; 
import Order from '../models/OrderModel.js';    

const KHALTI_INITIATE_URL = 'https://dev.khalti.com/api/v2/epayment/initiate/';
const KHALTI_LOOKUP_URL = 'https://dev.khalti.com/api/v2/epayment/lookup/';

const initiate = async (req, res) => {
    try {
        console.log("from initiate: ", req.body);
        
        const { quoteId, amount, orderName, customerInfo } = req.body;
        // Convert NPR to Paisa
        const amountInPaisa = Math.round(Number(amount) * 100);

        const payload = {
            return_url: `${process.env.CLIENT_URL}/payment-status`,
            website_url: process.env.CLIENT_URL,
            amount: amountInPaisa,
            purchase_order_id: String(quoteId),
            purchase_order_name: orderName || `Order #${quoteId}`,
            customer_info: {
                name: (customerInfo?.firstName && customerInfo?.lastName) 
                    ? `${customerInfo.firstName} ${customerInfo.lastName}` 
                    : 'College Student',
                email: customerInfo?.email || 'student@example.com',
                phone: "-"
            },
        };

        const response = await axios.post(KHALTI_INITIATE_URL, payload, {
            headers: {
                Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return res.json({
            success: true,
            payment_url: response.data.payment_url,
            pidx: response.data.pidx,
        });
    } catch (error) {
        console.error('Khalti Initiate Error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to initiate Khalti payment',
        });
    }
};

const verify = async (req, res) => {
    try {
        const { pidx, purchase_order_id } = req.body;

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

        if (response.data.status !== 'Completed') {
            return res.json({
                success: false,
                status: response.data.status,
                data: response.data,
            });
        }
        
        const requestDetail = await RequestDetail.findById(purchase_order_id);
        if (!requestDetail) {
            return res.status(404).json({ message: "Quote not found." });
        }

        const parentRequest = await Request.findById(requestDetail.request_id);
        if (!parentRequest || parentRequest.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "This quote does not belong to you." });
        }

        if (requestDetail.status === "accepted") {
            return res.status(409).json({ message: `This quote was already ${requestDetail.status}.` });
        }

        const order = await Order.create({
            user_id: req.user.id,
            request_detail_id: requestDetail._id,
            charge: requestDetail.charge
            // todo delivered and other
        });

        requestDetail.status = "accepted";
        await requestDetail.save();

        
        return res.json({
            success: true,
            status: 'Completed',
            data: response.data,
            order
        });

    } catch (error) {
        console.error('Khalti Verification Error:', error.response?.data || error.message);
        
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Payment verification failed',
                error: error.message
            });
        }
    }
};

export { initiate, verify };
