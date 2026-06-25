import express from 'express';
import { getSystemStats } from '../controllers/statsController.js';

const router = express.Router();

// Mount the stats endpoint
router.get('/system-metrics', getSystemStats);

export default router;