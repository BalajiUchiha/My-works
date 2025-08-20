// utils/upload.js
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

export const preUpload = multer({ storage:storage('pre-shipment') });

export const postUpload = multer({ storage:storage('post-shipment') });


const memoryStorage = multer.memoryStorage();

export const reportUpload = multer({ storage: memoryStorage }).fields([
  { name: "report-photo", maxCount: 1 },
  { name: "document", maxCount:1},
]);