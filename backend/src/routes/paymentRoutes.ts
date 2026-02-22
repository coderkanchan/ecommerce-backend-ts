import express from 'express';
import { createOrder } from '../controllers/paymentController.js';

const router = express.Router();

// Order create karne ka endpoint
router.post('/order', createOrder);

export default router;