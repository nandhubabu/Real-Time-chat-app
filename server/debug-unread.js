import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Message from './models/Message.js';

dotenv.config();

async function debug() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const users = await User.find({}).lean();
    console.log("Total users:", users.length);

    if (users.length > 0) {
        // Mocking the get users function for the first user
        const loggedInUserId = users[0]._id;
        console.log("Mocking logged in as:", users[0].username, loggedInUserId);

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId },
            ],
        }).select("senderId receiverId");

        const contactIds = new Set();
        messages.forEach((msg) => {
            const otherId = msg.senderId.toString() === loggedInUserId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString();
            contactIds.add(otherId);
        });

        const contacts = await User.find({
            _id: { $in: Array.from(contactIds) },
        }).select("-password").lean();

        for (let contact of contacts) {
            const unreadCount = await Message.countDocuments({
                senderId: contact._id,
                receiverId: loggedInUserId,
                isRead: false,
                isDeleted: { $ne: true }
            });
            contact.unreadCount = unreadCount;
        }

        console.log("Contacts with unreadCount:", JSON.stringify(contacts, null, 2));

        const unreadMessages = await Message.find({
            receiverId: loggedInUserId,
            isRead: false,
            isDeleted: { $ne: true }
        });
        console.log(`Found ${unreadMessages.length} total unread messages for this user in DB.`);
    }

    mongoose.disconnect();
}

debug();
