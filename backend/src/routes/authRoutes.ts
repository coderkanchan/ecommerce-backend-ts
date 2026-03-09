import express from 'express';
import { registerUser, loginUser, updateUserProfile } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').put(protect, updateUserProfile);
router.route('/').get(protect, admin, getUsers);

export default router;