import express from 'express';
import { handleAIQuery } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { optionalProtect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/ask-assistant', protect, handleAIQuery);

router.route('/ask-assistant').post(optionalProtect, askAssistant);

export default router;