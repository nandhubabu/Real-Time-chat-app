import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    sendMessage,
    getUsersForSidebar,
    getMessages,
    searchUserByUniqueId,
    markMessagesRead,
    deleteMessage,
    editMessage,
    deleteAllMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/search/:uniqueId", protectRoute, searchUserByUniqueId);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/read/:senderId", protectRoute, markMessagesRead);
router.delete("/all/:id", protectRoute, deleteAllMessages);
router.delete("/:id", protectRoute, deleteMessage);
router.put("/:id", protectRoute, editMessage);

export default router;