import express from 'express'

import { signup, signin, getProfile, updateProfile  } from '../controllers/UserController.js'
import { verifyJWT } from '../utils/middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/profile", verifyJWT, getProfile);

router.put("/profile", verifyJWT, updateProfile);
export default router;
