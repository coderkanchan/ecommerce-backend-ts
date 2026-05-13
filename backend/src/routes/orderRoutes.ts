// backend/src/routes/orderRoutes.ts

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

// --- 1. FIXED/STATIC ROUTES (Hamesha upar rakhein) ---

// Seller specific routes
router.route('/seller').get(protect, seller, getSellerOrders);
router.get('/seller-summary', protect, seller, getSellerSummary);
router.get('/seller-stats', protect, getSellerStats); // Isse upar lana zaroori tha

// User orders and stats
router.route('/myorders').get(protect, getMyOrders);
router.route('/stats').get(protect, getOrderStats);

// Admin summary
router.get('/summary', protect, admin, getOrderSummary);

// Base '/' routes
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);


// --- 2. DYNAMIC ROUTES (/:id wale hamesha niche rakhein) ---

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').get(protect, getOrderById); // Ye sabse niche hona chahiye

export default router;