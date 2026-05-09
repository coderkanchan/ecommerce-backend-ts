import express from 'express';
import { handleAIQuery } from '../controllers/aiController.js'; 
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/ask-assistant').post(optionalProtect, handleAIQuery);

export default router;
