import Message from "../models/Message.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // The person you are chatting with
        const senderId = req.user._id; // The logged-in user (from your JWT middleware)

        // 1. Create the message object
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image,
        });

        // 2. Save it permanently
        await newMessage.save();

        // 3. Real-time Logic: Send to the receiver if they are online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to() sends a message to a SPECIFIC socket ID
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};