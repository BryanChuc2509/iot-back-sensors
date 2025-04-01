import express from 'express';
import { syncData, getPlotsDeleted } from '../controllers/consumeApi.js';

const router = express.Router();

router
    .get('/consume-api', syncData)
    .get('/consume-api/plots-deleted', getPlotsDeleted)


export default router;
