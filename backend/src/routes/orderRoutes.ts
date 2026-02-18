
import express from 'express';
import { addOrderItems, getMyOrders, updateOrderToPaid, getOrderStats, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, getMyOrders);
router.route('/stats').get(protect, getOrderStats);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id').get(protect, getOrderById);

export default router;