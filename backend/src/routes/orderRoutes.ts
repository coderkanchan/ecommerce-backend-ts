
import express from 'express';
import { addOrderItems, getMyOrders, updateOrderToPaid, getOrderStats, getOrderById, getOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);

router.route('/myorders').get(protect, getMyOrders);

router.route('/stats').get(protect, getOrderStats);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id').get(protect, getOrderById);

router.route('/').get(protect, admin, getOrders);

export default router;