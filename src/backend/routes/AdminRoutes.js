import express from 'express'

import { getCountries, getCategories, getTaxes, getUsers } from '../controllers/AdminController.js'

import { verifyJWT, requireAdmin } from '../utils/middleware.js';

const router = express.Router();

router.get("/country", verifyJWT, requireAdmin, getCountries);
router.get("/category", verifyJWT, requireAdmin, getCategories);
router.get("/taxes", verifyJWT, requireAdmin, getTaxes);
router.get("/users", verifyJWT, requireAdmin, getUsers);

export default router;
