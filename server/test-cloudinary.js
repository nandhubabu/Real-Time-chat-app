import cloudinary from "./lib/cloudinary.js";
import fs from "fs";

async function testCloudinary() {
    try {
        console.log("Configuring Cloudinary...");
        const base64Pixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        const res = await cloudinary.uploader.upload(base64Pixel);
        console.log("SUCCESS! Image URL:", res.secure_url);
    } catch (err) {
        console.error("CLOUDINARY ERROR:", err);
    }
}

testCloudinary();
