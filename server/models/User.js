const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        type: String, // We store the URL of the image, not the image itself
        default: "",
    },
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

const User = mongoose.model('User', userSchema);
module.exports = User;