import express from 'express'

import { addRequest, recentRequest, respondToRequest, myQuotes, respondToQuote, myRequests } from '../controllers/ProductController.js'
import { verifyJWT, requireAdmin } from '../utils/middleware.js';

const router = express.Router();

router.post("/add", addRequest);
router.post("/requestdetail", verifyJWT, requireAdmin, respondToRequest);
router.post("/quotes/:id/respond", verifyJWT, respondToQuote);


router.get("/requests/:page", verifyJWT, requireAdmin, recentRequest);
router.get("/myRequests", verifyJWT, myRequests);

export default router;
