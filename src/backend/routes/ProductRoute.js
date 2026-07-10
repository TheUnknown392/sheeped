import express from 'express'

import { addRequest, recentRequest, respondToRequest, myQuotes, respondToQuote } from '../controllers/ProductController.js'
import { verifyJWT, requireAdmin } from '../utils/middleware.js';

const router = express.Router();

router.post("/add", addRequest);
router.post("/requestdetail", verifyJWT, requireAdmin, respondToRequest);
router.get("/requests/:page", verifyJWT, requireAdmin, recentRequest);

router.get("/quotes", verifyJWT, myQuotes);
router.post("/quotes/:id/respond", verifyJWT, respondToQuote);

export default router;
