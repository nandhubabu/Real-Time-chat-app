import mongoose from 'mongoose';
import crypto from 'crypto';

// Generate a short, readable unique ID like "USR-A3F9B2"
function generateUniqueId() {
    return "USR-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

const userSchema = new mongoose.Schema({
    uniqueId: {
        type: String,
        unique: true,
        default: generateUniqueId,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: "https://avatar.iran.liara.run/public",
    },
    about: {
        type: String,
        default: "",
        maxlength: 150,
    },
    lastProfilePicUpdate: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

// Retry uniqueId generation on the rare chance of collision
userSchema.pre("save", async function () {
    if (this.isNew && !this.uniqueId) {
        this.uniqueId = generateUniqueId();
    }
});

const User = mongoose.model('User', userSchema);
export default User;
