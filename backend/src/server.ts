import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import uploadRoutes from './routes/uploadRoutes.js';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import passport from 'passport';
import { configurePassport } from './config/passport.js';
import aiRoutes from './routes/aiRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

connectDB();

console.log("Cloudinary Name:", process.env.CLOUDINARY_CLOUD_NAME);

const app = express();

configurePassport();
app.use(passport.initialize());

app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

const __dirname = path.resolve();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.use('/api/ai', aiRoutes);

app.use("/api/chat", chatRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use('/api/upload', uploadRoutes);

app.use('/api/users', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

