// lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// The "Memory" of our online users
const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // 1. Get the User ID from the handshake (sent from Frontend)
    const userId = socket.handshake.query.userId;

    // 2. If the user is valid, store them in our map
    if (userId && userId !== "undefined") {
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