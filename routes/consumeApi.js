import express from 'express';
import { syncData, getPlotsDeleted } from '../controllers/consumeApi.js';
import { getHistoricDataGeneralSensor } from '../controllers/HistoricData.js';

const router = express.Router();

router
    .get('/consume-api', syncData)
    .get('/consume-api/plots-deleted', getPlotsDeleted)
    .get('/consume-api/historic-data-general-sensor/:limit', getHistoricDataGeneralSensor)

export default router;
