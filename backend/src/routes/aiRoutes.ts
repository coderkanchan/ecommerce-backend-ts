import express from 'express';
import { handleAIQuery } from '../controllers/aiController';

const router = express.Router();

router.post('/ask-assistant', handleAIQuery);

export default router;