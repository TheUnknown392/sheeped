import express from 'express'

import { addRequest } from '../controllers/ProductController.js'

const router = express.Router();

router.post("/add", addRequest);

export default router;
