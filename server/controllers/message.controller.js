import Message from "../models/Message.js";
import User from "../models/User.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // The person you are chatting with
        const senderId = req.user._id; // The logged-in user (from your JWT middleware)

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // 1. Create the message object
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
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
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all unique user IDs that the logged-in user has messaged or received messages from
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId },
            ],
        }).select("senderId receiverId");

        // Collect the other user ID from each message conversation
        const contactIds = new Set();
        messages.forEach((msg) => {
            const otherId = msg.senderId.toString() === loggedInUserId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString();
            contactIds.add(otherId);
        });

        // Fetch full user details for those contacts only
        const contacts = await User.find({
            _id: { $in: Array.from(contactIds) },
        }).select("-password").lean();

        // Calculate unread message count for each contact
        for (let contact of contacts) {
            const unreadCount = await Message.countDocuments({
                senderId: contact._id,
                receiverId: loggedInUserId,
                isRead: false,
                isDeleted: { $ne: true }
            });
            contact.unreadCount = unreadCount;
        }

        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const searchUserByUniqueId = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const loggedInUserId = req.user._id;

        const user = await User.findOne({
            uniqueId: uniqueId.toUpperCase(),
            _id: { $ne: loggedInUserId },
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "No user found with this ID" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in searchUserByUniqueId: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markMessagesRead = async (req, res) => {
    try {
        const { senderId } = req.params;  // the person who sent the messages we are marking as read
        const receiverId = req.user._id;  // the logged-in user who is now reading them

        // Mark all unread messages from senderId to receiverId as read
        await Message.updateMany(
            { senderId, receiverId, isRead: false },
            { $set: { isRead: true } }
        );

        // Notify the original sender in real-time that their messages were read
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesRead", { readBy: receiverId, from: senderId });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error in markMessagesRead: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ error: "Message not found" });
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You can only delete your own messages" });
        }

        // Soft-delete: mark as deleted, clear text/image
        message.isDeleted = true;
        message.text = null;
        message.image = null;
        await message.save();

        // Notify the other person in real-time
        const otherUserId = message.receiverId.toString();
        const receiverSocketId = getReceiverSocketId(otherUserId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", { messageId: id });
        }

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in deleteMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const editMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        if (!text?.trim()) return res.status(400).json({ error: "Text cannot be empty" });

        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ error: "Message not found" });
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You can only edit your own messages" });
        }
        if (message.isDeleted) return res.status(400).json({ error: "Cannot edit a deleted message" });

        message.text = text.trim();
        message.isEdited = true;
        await message.save();

        // Notify the other person in real-time
        const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageEdited", message);
        }

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in editMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteAllMessages = async (req, res) => {
    try {
        const { id: otherUserId } = req.params;
        const myId = req.user._id;

        // Soft-delete all messages I sent in this conversation
        await Message.updateMany(
            { senderId: myId, receiverId: otherUserId },
            { $set: { isDeleted: true, text: null, image: null } }
        );

        // Notify the other person
        const receiverSocketId = getReceiverSocketId(otherUserId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("allMessagesDeleted", { fromUserId: myId });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in deleteAllMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const clearChat = async (req, res) => {
    try {
        const { id: otherUserId } = req.params;
        const myId = req.user._id;

        // Hard-delete ALL messages in this conversation (both directions) for good
        await Message.deleteMany({
            $or: [
                { senderId: myId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: myId },
            ],
        });

        // Notify the other person so their screen clears too
        const receiverSocketId = getReceiverSocketId(otherUserId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("chatCleared", { clearedBy: myId });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in clearChat controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};