import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// ✅ Load environment variables
dotenv.config(); 

const connectCloudinary = () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
        console.error("❌ Cloudinary config missing! Check your .env file.");
        return;
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

    console.log("✅ Cloudinary connected successfully!");
};

export default connectCloudinary;
