import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  updateOrderToPaid,
  getOrderStats,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  getOrderSummary,
  getSellerStats,
  getSellerSummary,
  getSellerOrders
} from '../controllers/orderController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/seller').get(protect, seller, getSellerOrders);
router.get('/seller-summary', protect, seller, getSellerSummary);
router.get('/seller-stats', protect, seller, getSellerStats);
router.route('/myorders').get(protect, getMyOrders);
router.route('/stats').get(protect, getOrderStats);

router.get('/summary', protect, admin, getOrderSummary);

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').get(protect, getOrderById);

export default router;