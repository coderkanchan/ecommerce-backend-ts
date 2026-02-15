import express from 'express';
import { addOrderItems, getMyOrders, updateOrderToPaid, getOrderStats } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addOrderItems);

router.get('/myorders', protect, getMyOrders);

router.put('/:id/pay', protect, updateOrderToPaid);

router.get('/stats', protect, admin, getOrderStats);

export default router;