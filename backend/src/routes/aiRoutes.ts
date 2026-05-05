import express from 'express';
import { handleAIQuery } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask-assistant', protect, handleAIQuery);

export default router;