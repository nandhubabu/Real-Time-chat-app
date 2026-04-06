import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// The Logic: Anyone can try to visit /send/:id, 
// but ONLY those with a valid JWT get past protectRoute!
router.post("/send/:id", protectRoute, sendMessage);

export default router;