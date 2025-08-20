// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage=(folderName)=>{ return new CloudinaryStorage({
  cloudinary,
  params: {
    folder:folderName,
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf']
  }
});
};

export const cloudinaryUpload = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "order_reports", // You can customize the folder
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result.secure_url); // 🔥 Return the uploaded image URL
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
});
};

export { cloudinary,storage};