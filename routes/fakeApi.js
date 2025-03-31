import express from 'express';
import { fakeApiSensors } from '../controllers/fakeApi.js';
const router = express.Router();

router.get('/fake-api', fakeApiSensors);

export default router;
