import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import { app, server } from "./lib/socket.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
// 1. Logic Check: Connect to DB first
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173", // Allow your React app
        credentials: true, // Allow cookies to be sent back and forth
    })
);

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.send("Chat Server is Running Successfully!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});