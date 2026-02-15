import cors from 'cors';
//import * as cors from 'cors';
import path from 'path';
import uploadRoutes from './routes/uploadRoutes.js';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use('/api/upload', uploadRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/orders', orderRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

