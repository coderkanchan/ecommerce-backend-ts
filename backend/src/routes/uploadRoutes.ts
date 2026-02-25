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
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'Please upload an image' });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'ecommerce_products', 
    });

    res.send({
      message: 'Image Uploaded to Cloudinary',
      image: uploadResponse.secure_url, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Upload to Cloudinary failed' });
  }
});

export default router;