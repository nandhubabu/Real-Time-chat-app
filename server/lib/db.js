// lib/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
    // LOGIC CHECK: This tells us if the URI is actually reaching the function
    if (!process.env.MONGO_URI) {
        console.error("❌ ERROR: MONGO_URI is not defined in .env file!");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
};