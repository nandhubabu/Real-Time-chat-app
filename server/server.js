import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import { app, server } from "./lib/socket.js";

dotenv.config();
const app = express();

// 1. Logic Check: Connect to DB first
connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);


app.get('/', (req, res) => {
    res.send("Chat Server is Running Successfully!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});