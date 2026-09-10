import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, AnalyticsController.getDashboardOverview);

export default router;
