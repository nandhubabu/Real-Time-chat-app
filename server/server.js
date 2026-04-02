// 1. Modern Imports (ES Modules)
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'; // IMPORTANT: Must include .js

// 2. Configuration
dotenv.config();
const app = express();

// 3. Middlewares
app.use(express.json());

// 4. Routes
app.get('/', (req, res) => {
    res.send("Chat Server is Running Successfully!");
});

app.use("/api/auth", authRoutes);

// 5. Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});