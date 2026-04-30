
import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  updateOrderToPaid,
  getOrderStats,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  getOrderSummary
}
  from '../controllers/orderController.js';
import { getSellerSummary, getSellerOrders } from '../controllers/orderController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/seller').get(protect, seller, getSellerOrders);

router.get('/seller-summary', protect, seller, getSellerSummary);

router.get('/summary', protect, admin, getOrderSummary);

router.route('/').post(protect, addOrderItems);

router.route('/myorders').get(protect, getMyOrders);

router.route('/stats').get(protect, getOrderStats);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id').get(protect, getOrderById);

router.route('/').get(protect, admin, getOrders);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);


export default router;