import express from 'express'

import { addRequest, recentRequest } from '../controllers/ProductController.js'

const router = express.Router();

router.post("/add", addRequest);
//router.post("/requestdetail", requestDetail)

router.get("/requests/:page", recentRequest)

export default router;
