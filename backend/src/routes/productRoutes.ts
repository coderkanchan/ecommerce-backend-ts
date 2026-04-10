
import express from 'express';
import {
  createProductReview,
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct
} from '../controllers/productController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', getProducts);
router.get('/:id', getProductById);

router.post('/:id/reviews', protect, createProductReview);

router.post('/add', protect, seller, createProduct);

router.route('/:id')
  .delete(protect, seller, deleteProduct)
  .put(protect, seller, updateProduct);

export default router;