import express from 'express';

import { verifyJWT } from '../utils/middleware.js'

import { initiate, verify } from '../controllers/PaymentController.js'

const router = express.Router();

// 1. Initiate Payment Endpoint
router.post('/khalti-initiate', verifyJWT, initiate);

// 2. Verify Payment Lookup Endpoint
router.post('/khalti-verify', verifyJWT, verify);

export default router;
