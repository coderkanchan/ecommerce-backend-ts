import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post('/', upload.single('image'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'Please upload an image' });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'nexus_mart_products',
      resource_type: 'auto',
    });

    res.send({
      message: 'Image Uploaded Successfully',
      image: uploadResponse.secure_url, 
    });
  } catch (error) {
    console.error("Cloudinary Error:", error);
    res.status(500).send({ message: 'Upload to Cloudinary failed' });
  }
});

export default router;