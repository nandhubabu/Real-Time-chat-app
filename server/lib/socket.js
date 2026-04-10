import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL || "http://localhost:5173"],
        credentials: true,
    },
});

// The "Memory" of our online users
const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.use((socket, next) => {
    try {
        const cookieStr = socket.handshake.headers.cookie;
        if (!cookieStr) return next(new Error("Authentication error"));

        const token = cookieStr.split("; ").find(c => c.startsWith("jwt="))?.split("=")[1];
        if (!token) return next(new Error("Authentication error"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (err) {
        return next(new Error("Authentication error"));
    }
});

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // 1. Get the User ID securely verified via JWT
    const userId = socket.userId;

    // 2. If the user is valid, store them in our map
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // 3. Tell EVERYONE who is currently online
    // io.emit sends a message to every single connected person
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);

        // 4. Remove the user from our map when they leave
        delete userSocketMap[userId];

        // 5. Update the online list for everyone else
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };