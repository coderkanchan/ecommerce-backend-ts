import express from 'express';
import { createProductReview, createProduct, getProducts, getProductById } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', getProducts);

router.post('/add', protect, admin, createProduct);

router.get('/:id', getProductById);

router.post('/:id/reviews', protect, createProductReview);

export default router;