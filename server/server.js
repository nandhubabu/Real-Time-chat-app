// 1. Load your tools
const express = require('express');
const dotenv = require('dotenv');

// 2. Load your secret variables from .env
dotenv.config();

const app = express();

const authRoutes = require('./routes/auth.routes');

// Add this line after your middlewares
app.use("/api/auth", authRoutes);

// 3. Middlewares: This allows the server to read JSON data sent from React
app.use(express.json());

// 4. A Test Route: To check if the server is alive
app.get('/', (req, res) => {
    res.send("Chat Server is Running Successfully!");
});


// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});