import User from '../models/User.js'; // Must include .js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Validation Logic
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already exists" });

        // 3. Hash the Password (The Industry Guard)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create and Save the User
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            await newUser.save();

            // 5. Generate JWT (The Digital Passport)
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: "7d", // User stays logged in for 7 days
            });

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                token: token, // Send this back to React to store in LocalStorage
            });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 2. Compare Password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 3. Generate Token (The same logic as signup)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            token: token,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};