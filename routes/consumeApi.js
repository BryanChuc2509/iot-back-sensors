import express from 'express';
import { syncData } from '../controllers/consumeApi.js';

const router = express.Router();

router.get('/consume-api', syncData);

export default router;
