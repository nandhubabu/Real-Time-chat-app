import express from 'express';
import { signup, login, checkAuth } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/check", checkAuth);

export default router; // Modern Export