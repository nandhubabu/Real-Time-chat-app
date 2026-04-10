import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import { app, server } from "./lib/socket.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
// 1. Logic Check: Connect to DB first
connectDB();

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // Limit each IP to 150 requests per windowMs
    message: { message: "Too many requests, please try again later." }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs for auth routes
    message: { message: "Too many authentication attempts, please try again later." }
});

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow your React app securely
        credentials: true, // Allow cookies to be sent back and forth
    })
);

import messageRoutes from './routes/message.routes.js';

app.use("/api/", generalLimiter);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/messages", messageRoutes);
app.get('/', (req, res) => {
    res.send("Chat Server is Running Successfully!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});