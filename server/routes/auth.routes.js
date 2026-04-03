import express from 'express';
import { signup } from '../controllers/auth.controller.js'; // Must include .js
import { signup, login } from '../controllers/auth.controller.js';

// ...

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);

export default router; // Modern Export