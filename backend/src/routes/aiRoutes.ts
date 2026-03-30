import express from 'express';
import { handleAIQuery } from '../controllers/aiController.js';

const router = express.Router();

router.post('/ask-assistant', handleAIQuery);

export default router;